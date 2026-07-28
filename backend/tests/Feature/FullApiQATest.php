<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Category;
use App\Models\Agency;
use App\Models\User;
use App\Models\Complaint;
use App\Enums\UserRole;
use Laravel\Sanctum\Sanctum;

class FullApiQATest extends TestCase
{
    use RefreshDatabase;

    // ──────────────────────────────────────────────
    // CATEGORIES & AGENCIES
    // ──────────────────────────────────────────────

    public function test_categories_returns_data(): void
    {
        Category::create(['name' => 'Jalan Rusak', 'slug' => 'jalan-rusak', 'description' => 'Test', 'icon' => 'Road']);

        $response = $this->getJson('/api/v1/categories');
        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure(['data' => [['id', 'name', 'slug']]]);
    }

    public function test_categories_empty_state(): void
    {
        $response = $this->getJson('/api/v1/categories');
        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data'));
    }

    public function test_agencies_returns_data(): void
    {
        Agency::create(['code' => 'PUPR', 'name' => 'Dinas PU', 'description' => 'Test', 'contact_email' => 'test@test.com', 'phone' => '123']);

        $response = $this->getJson('/api/v1/agencies');
        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure(['data' => [['id', 'name', 'code']]]);
    }

    public function test_agencies_empty_state(): void
    {
        $response = $this->getJson('/api/v1/agencies');
        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data'));
    }

    // ──────────────────────────────────────────────
    // FULL COMPLAINT FLOW
    // ──────────────────────────────────────────────

    public function test_full_complaint_creation_and_lookup(): void
    {
        // Complaint submission now requires authentication
        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        Sanctum::actingAs($citizen);

        $category = Category::create(['name' => 'Lampu Jalan', 'slug' => 'lampu-jalan', 'description' => 'Test', 'icon' => 'Lightbulb']);

        // 1. Create complaint
        $response = $this->postJson('/api/v1/complaints', [
            'title'         => 'Lampu Mati di Jalan Wolio',
            'description'   => 'Lampu jalan mati total selama 3 hari',
            'category_id'   => $category->id,
            'subdistrict'   => 'Wolio',
            'address'       => 'Jl. Wolio Raya No. 10',
            'urgency'       => 'tinggi',
            'reporter_name' => 'Masyarakat Baubau',
            'reporter_phone' => '08123456789',
            'reporter_email' => 'test@example.com',
        ]);
        $response->assertStatus(201)->assertJson(['success' => true]);

        $ticketCode  = $response->json('data.ticket_code');
        $complaintId = $response->json('data.id');

        $this->assertNotNull($ticketCode);
        // Ticket code format: SPL-{YEAR}-{6-digit-sequence}
        $this->assertStringStartsWith('SPL-', $ticketCode);
        $this->assertEquals('menunggu', $response->json('data.status'));

        // 2. Verify database row exists
        $this->assertDatabaseHas('complaints', [
            'id'          => $complaintId,
            'ticket_code' => $ticketCode,
            'status'      => 'menunggu',
        ]);

        // 3. Lookup by ticket code
        $lookup = $this->getJson("/api/v1/complaints/ticket/{$ticketCode}");
        $lookup->assertStatus(200)->assertJson(['success' => true, 'data' => ['ticket_code' => $ticketCode]]);

        // 4. Verify status log was created
        $this->assertDatabaseHas('complaint_status_logs', [
            'complaint_id' => $complaintId,
            'status'       => 'menunggu',
        ]);

        // 5. Update status — use Sanctum authentication (route uses auth:sanctum)
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        Sanctum::actingAs($admin);

        $update = $this->postJson("/api/v1/complaints/{$complaintId}/status", [
            'status' => 'diproses',
            'notes'  => 'Sedang ditangani oleh tim teknis',
        ]);
        $update->assertStatus(200);
        $this->assertDatabaseHas('complaints', ['id' => $complaintId, 'status' => 'diproses']);
        $this->assertDatabaseHas('complaint_status_logs', [
            'complaint_id' => $complaintId,
            'status'       => 'diproses',
        ]);

        // 6. Complete the complaint
        $complete = $this->postJson("/api/v1/complaints/{$complaintId}/status", [
            'status' => 'selesai',
            'notes'  => 'Perbaikan selesai dikerjakan',
        ]);
        $complete->assertStatus(200);
        $this->assertDatabaseHas('complaints', ['id' => $complaintId, 'status' => 'selesai']);
    }

    // ──────────────────────────────────────────────
    // VALIDATION
    // ──────────────────────────────────────────────

    public function test_complaint_validation_errors(): void
    {
        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        Sanctum::actingAs($citizen);

        $response = $this->postJson('/api/v1/complaints', []);
        $response->assertStatus(422)->assertJson(['success' => false]);
    }

    public function test_complaint_invalid_subdistrict(): void
    {
        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        Sanctum::actingAs($citizen);

        $category = Category::create(['name' => 'Test', 'slug' => 'test', 'description' => 'Test', 'icon' => 'test']);

        $response = $this->postJson('/api/v1/complaints', [
            'title'         => 'Test',
            'description'   => 'Test',
            'category_id'   => $category->id,
            'subdistrict'   => 'InvalidSubdistrict',
            'address'       => 'Test',
            'urgency'       => 'rendah',
            'reporter_name' => 'Test',
        ]);
        $response->assertStatus(422);
    }

    public function test_invalid_ticket_code_returns_404(): void
    {
        $response = $this->getJson('/api/v1/complaints/ticket/NONEXISTENT');
        $response->assertStatus(404);
    }

    // ──────────────────────────────────────────────
    // AUTH FLOW
    // ──────────────────────────────────────────────

    public function test_auth_flow(): void
    {
        // Register
        $register = $this->postJson('/api/v1/auth/register', [
            'name'                  => 'Warga Baubau',
            'email'                 => 'warga@baubau.go.id',
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);
        $register->assertStatus(201)->assertJson(['success' => true]);

        $token = $register->json('data.token');
        $this->assertNotNull($token);

        // Login
        $login = $this->postJson('/api/v1/auth/login', [
            'email'    => 'warga@baubau.go.id',
            'password' => 'Password123!',
        ]);
        $login->assertStatus(200)->assertJson(['success' => true]);

        // Login token
        $loginToken = $login->json('data.token');
        $this->assertNotNull($loginToken);

        // Access protected route with Sanctum token
        $me = $this->withHeaders(['Authorization' => 'Bearer ' . $loginToken])
            ->getJson('/api/v1/auth/me');
        $me->assertStatus(200);
        $this->assertEquals('warga@baubau.go.id', $me->json('data.email'));

        // Logout
        $logout = $this->withHeaders(['Authorization' => 'Bearer ' . $loginToken])
            ->postJson('/api/v1/auth/logout');
        $logout->assertStatus(200);

        // Actual verification: tokens deleted from DB
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $register->json('data.user.id'),
        ]);
    }

    public function test_wrong_password_returns_generic_error(): void
    {
        User::factory()->create(['email' => 'user@test.com', 'password' => bcrypt('Correct1')]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email'    => 'user@test.com',
            'password' => 'wrongpassword',
        ]);
        $response->assertStatus(422)->assertJson(['success' => false]);
    }

    // ──────────────────────────────────────────────
    // STATISTICS
    // ──────────────────────────────────────────────

    public function test_statistics_with_real_data(): void
    {
        $category = Category::create(['name' => 'Test', 'slug' => 'test', 'description' => 'Test', 'icon' => 't']);

        foreach (['menunggu' => 3, 'diproses' => 2, 'selesai' => 5, 'ditolak' => 1] as $status => $count) {
            for ($i = 0; $i < $count; $i++) {
                Complaint::create([
                    'ticket_code'   => 'SPL-TEST-' . uniqid(),
                    'title'         => "Test {$status} {$i}",
                    'description'   => 'Test',
                    'category_id'   => $category->id,
                    'subdistrict'   => 'Wolio',
                    'address'       => 'Test',
                    'reporter_name' => 'Test',
                    'urgency'       => 'sedang',
                    'status'        => $status,
                    'latitude'      => -5.4642,
                    'longitude'     => 122.6035,
                    'completed_at'  => $status === 'selesai' ? now() : null,
                ]);
            }
        }

        $response = $this->getJson('/api/v1/stats/summary');
        $response->assertStatus(200)->assertJson(['success' => true]);

        $data = $response->json('data');
        $this->assertEquals(11, $data['total']);
        $this->assertEquals(3, $data['menunggu']);
        $this->assertEquals(2, $data['diproses']);
        $this->assertEquals(5, $data['selesai']);
        $this->assertEquals(1, $data['ditolak']);
    }

    // ──────────────────────────────────────────────
    // EMPTY STATES
    // ──────────────────────────────────────────────

    public function test_empty_statistics(): void
    {
        $response = $this->getJson('/api/v1/stats/summary');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertEquals(0, $data['total']);
        $this->assertEquals(0, $data['completion_rate']);
    }

    public function test_empty_complaints_list(): void
    {
        $response = $this->getJson('/api/v1/complaints');
        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data'));
    }

    // ──────────────────────────────────────────────
    // AUTHORIZATION
    // ──────────────────────────────────────────────

    public function test_unauthorized_status_update(): void
    {
        $category = Category::create(['name' => 'Test', 'slug' => 'test', 'description' => 'Test', 'icon' => 't']);
        $complaint = Complaint::create([
            'ticket_code'   => 'SPL-UNAUTH',
            'title'         => 'Test',
            'description'   => 'Test',
            'category_id'   => $category->id,
            'subdistrict'   => 'Wolio',
            'address'       => 'Test',
            'reporter_name' => 'Test',
            'urgency'       => 'sedang',
            'status'        => 'menunggu',
            'latitude'      => -5.4642,
            'longitude'     => 122.6035,
        ]);

        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        Sanctum::actingAs($citizen);

        $response = $this->postJson("/api/v1/complaints/{$complaint->id}/status", [
            'status' => 'diproses',
            'notes'  => 'Test',
        ]);
        $response->assertStatus(403);
    }

    /**
     * An officer cannot update a complaint that belongs to a different agency.
     */
    public function test_officer_from_wrong_agency_cannot_update_status(): void
    {
        $agencyA  = Agency::create(['code' => 'PUPR', 'name' => 'Dinas PU', 'description' => 'Test', 'contact_email' => 'a@test.com', 'phone' => '1']);
        $agencyB  = Agency::create(['code' => 'DKES', 'name' => 'Dinas Kesehatan', 'description' => 'Test', 'contact_email' => 'b@test.com', 'phone' => '2']);
        $category = Category::create(['name' => 'Test', 'slug' => 'test-agencyb', 'description' => 'Test', 'icon' => 't']);

        // Complaint assigned to agency A
        $complaint = Complaint::create([
            'ticket_code'   => 'SPL-AGENCYA-001',
            'title'         => 'Test',
            'description'   => 'Test',
            'category_id'   => $category->id,
            'agency_id'     => $agencyA->id,
            'subdistrict'   => 'Wolio',
            'address'       => 'Test',
            'reporter_name' => 'Test',
            'urgency'       => 'sedang',
            'status'        => 'menunggu',
            'latitude'      => -5.4642,
            'longitude'     => 122.6035,
        ]);

        // Officer from agency B tries to update
        $officerB = User::factory()->create([
            'role'      => UserRole::OFFICER,
            'agency_id' => $agencyB->id,
        ]);
        Sanctum::actingAs($officerB);

        $response = $this->postJson("/api/v1/complaints/{$complaint->id}/status", [
            'status' => 'diproses',
            'notes'  => 'Mencoba mengambil alih',
        ]);
        $response->assertStatus(403);
    }

    /**
     * Submitting a duplicate complaint (same email+address+category within 24h) is rejected.
     */
    public function test_duplicate_complaint_is_rejected(): void
    {
        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        Sanctum::actingAs($citizen);

        $category = Category::create(['name' => 'Jalan', 'slug' => 'jalan-dup', 'description' => 'Test', 'icon' => 'road']);

        $payload = [
            'title'          => 'Jalan Rusak',
            'description'    => 'Jalan berlubang besar',
            'category_id'    => $category->id,
            'subdistrict'    => 'Wolio',
            'address'        => 'Jl. Wolio No. 1',
            'urgency'        => 'tinggi',
            'reporter_name'  => 'Test Warga',
            'reporter_email' => 'duplicate@test.com',
        ];

        // First submission succeeds
        $first = $this->postJson('/api/v1/complaints', $payload);
        $first->assertStatus(201);

        // Second submission with identical identity+address+category should be rejected
        $second = $this->postJson('/api/v1/complaints', $payload);
        $second->assertStatus(409);
    }
}
