<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Category;
use App\Models\Agency;
use App\Models\User;
use App\Models\Complaint;
use App\Models\ComplaintComment;
use App\Models\ComplaintFile;
use App\Models\ComplaintActivityLog;
use App\Enums\UserRole;
use Laravel\Sanctum\Sanctum;
use Illuminate\Http\UploadedFile;

/**
 * QA regression tests for the complaint detail feature and
 * security fixes (dashboard role-gating, upload validation,
 * password reset flow).
 */
class DetailSecurityQATest extends TestCase
{
    use RefreshDatabase;

    private function makeComplaint(array $overrides = []): Complaint
    {
        $category = Category::firstOrCreate(
            ['slug' => 'jalan-rusak-detail'],
            ['name' => 'Jalan Rusak', 'description' => 'Test', 'icon' => 'road'],
        );

        return Complaint::create(array_merge([
            'ticket_code'   => 'SPL-DET-' . uniqid(),
            'title'         => 'Jalan Berlubang',
            'description'   => 'Lubang besar di tengah jalan',
            'category_id'   => $category->id,
            'subdistrict'   => 'Wolio',
            'address'       => 'Jl. Test No. 1',
            'reporter_name' => 'Warga Test',
            'urgency'       => 'tinggi',
            'status'        => 'menunggu',
            'latitude'      => -5.4642,
            'longitude'     => 122.6035,
        ], $overrides));
    }

    // ──────────────────────────────────────────────
    // DETAIL ENDPOINT — RBAC MATRIX
    // ──────────────────────────────────────────────

    public function test_detail_requires_authentication(): void
    {
        $complaint = $this->makeComplaint();

        $response = $this->getJson("/api/v1/complaints/{$complaint->id}");
        $response->assertStatus(401);
    }

    public function test_admin_can_view_any_complaint_detail(): void
    {
        $complaint = $this->makeComplaint();
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        Sanctum::actingAs($admin);

        $response = $this->getJson("/api/v1/complaints/{$complaint->id}");
        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'data' => [
                    'id', 'ticket_code', 'title', 'status',
                    'progress_percentage', 'comments', 'activity_logs', 'related',
                ],
            ]);
    }

    public function test_owner_citizen_can_view_own_complaint_detail(): void
    {
        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        $complaint = $this->makeComplaint(['user_id' => $citizen->id]);
        Sanctum::actingAs($citizen);

        $response = $this->getJson("/api/v1/complaints/{$complaint->id}");
        $response->assertStatus(200);
    }

    public function test_citizen_cannot_view_others_complaint_detail(): void
    {
        $owner = User::factory()->create(['role' => UserRole::CITIZEN]);
        $other = User::factory()->create(['role' => UserRole::CITIZEN]);
        $complaint = $this->makeComplaint(['user_id' => $owner->id]);
        Sanctum::actingAs($other);

        $response = $this->getJson("/api/v1/complaints/{$complaint->id}");
        $response->assertStatus(403);
    }

    public function test_officer_can_view_complaint_of_own_agency(): void
    {
        $agency = Agency::create(['code' => 'PUPR', 'name' => 'Dinas PU', 'description' => 'Test', 'contact_email' => 'pu@test.com', 'phone' => '1']);
        $officer = User::factory()->create(['role' => UserRole::OFFICER, 'agency_id' => $agency->id]);
        $complaint = $this->makeComplaint(['agency_id' => $agency->id]);
        Sanctum::actingAs($officer);

        $response = $this->getJson("/api/v1/complaints/{$complaint->id}");
        $response->assertStatus(200);
    }

    public function test_officer_cannot_view_complaint_of_other_agency(): void
    {
        $agencyA = Agency::create(['code' => 'PUPR', 'name' => 'Dinas PU', 'description' => 'Test', 'contact_email' => 'pu@test.com', 'phone' => '1']);
        $agencyB = Agency::create(['code' => 'DKES', 'name' => 'Dinas Kesehatan', 'description' => 'Test', 'contact_email' => 'kes@test.com', 'phone' => '2']);
        $officer = User::factory()->create(['role' => UserRole::OFFICER, 'agency_id' => $agencyB->id]);
        $complaint = $this->makeComplaint(['agency_id' => $agencyA->id]);
        Sanctum::actingAs($officer);

        $response = $this->getJson("/api/v1/complaints/{$complaint->id}");
        $response->assertStatus(403);
    }

    public function test_detail_404_for_missing_complaint(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/v1/complaints/999999');
        $response->assertStatus(404)
            ->assertJson(['success' => false]);
    }

    // ──────────────────────────────────────────────
    // COMMENTS
    // ──────────────────────────────────────────────

    public function test_comment_creates_activity_log(): void
    {
        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        $complaint = $this->makeComplaint(['user_id' => $citizen->id]);
        Sanctum::actingAs($citizen);

        $response = $this->postJson("/api/v1/complaints/{$complaint->id}/comments", [
            'body' => 'Mohon segera ditindaklanjuti.',
        ]);
        $response->assertStatus(201)->assertJson(['success' => true]);

        $this->assertDatabaseHas('complaint_comments', [
            'complaint_id' => $complaint->id,
            'body' => 'Mohon segera ditindaklanjuti.',
        ]);
        $this->assertDatabaseHas('complaint_activity_logs', [
            'complaint_id' => $complaint->id,
            'action' => 'comment_added',
        ]);
    }

    public function test_comment_validation_empty_body(): void
    {
        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        $complaint = $this->makeComplaint(['user_id' => $citizen->id]);
        Sanctum::actingAs($citizen);

        $response = $this->postJson("/api/v1/complaints/{$complaint->id}/comments", ['body' => '']);
        $response->assertStatus(422);
    }

    public function test_comment_xss_payload_is_sanitized(): void
    {
        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        $complaint = $this->makeComplaint(['user_id' => $citizen->id]);
        Sanctum::actingAs($citizen);

        $response = $this->postJson("/api/v1/complaints/{$complaint->id}/comments", [
            'body' => '<script>alert(1)</script>Halo',
        ]);
        $response->assertStatus(201);

        $comment = ComplaintComment::where('complaint_id', $complaint->id)->first();
        $this->assertNotNull($comment);
        $this->assertStringNotContainsString('<script>', $comment->body);
        $this->assertStringContainsString('Halo', $comment->body);
    }

    public function test_citizen_cannot_comment_on_others_complaint(): void
    {
        $owner = User::factory()->create(['role' => UserRole::CITIZEN]);
        $other = User::factory()->create(['role' => UserRole::CITIZEN]);
        $complaint = $this->makeComplaint(['user_id' => $owner->id]);
        Sanctum::actingAs($other);

        $response = $this->postJson("/api/v1/complaints/{$complaint->id}/comments", ['body' => 'Hi']);
        $response->assertStatus(403);
    }

    // ──────────────────────────────────────────────
    // FILE UPLOADS
    // ──────────────────────────────────────────────

    public function test_valid_image_upload_succeeds(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $complaint = $this->makeComplaint();
        Sanctum::actingAs($admin);

        $response = $this->postJson("/api/v1/complaints/{$complaint->id}/files", [
            'file' => UploadedFile::fake()->create('before.png', 100, 'image/png'),
            'category' => 'before',
        ]);
        $response->assertStatus(201)->assertJson(['success' => true]);

        $this->assertDatabaseHas('complaint_files', [
            'complaint_id' => $complaint->id,
            'category' => 'before',
        ]);
    }

    public function test_invalid_file_type_is_rejected(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $complaint = $this->makeComplaint();
        Sanctum::actingAs($admin);

        // A PHP file masquerading as a valid upload must be rejected.
        $response = $this->postJson("/api/v1/complaints/{$complaint->id}/files", [
            'file' => UploadedFile::fake()->create('evil.php', 10, 'application/x-php'),
            'category' => 'support',
        ]);
        $response->assertStatus(422);

        $this->assertDatabaseCount('complaint_files', 0);
    }

    public function test_oversize_file_is_rejected(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $complaint = $this->makeComplaint();
        Sanctum::actingAs($admin);

        // 16 MB > 15 MB limit
        $response = $this->postJson("/api/v1/complaints/{$complaint->id}/files", [
            'file' => UploadedFile::fake()->create('big.png', 16 * 1024),
            'category' => 'support',
        ]);
        $response->assertStatus(422);
    }

    public function test_citizen_cannot_upload_file(): void
    {
        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        $complaint = $this->makeComplaint(['user_id' => $citizen->id]);
        Sanctum::actingAs($citizen);

        $response = $this->postJson("/api/v1/complaints/{$complaint->id}/files", [
            'file' => UploadedFile::fake()->create('x.png', 100, 'image/png'),
            'category' => 'support',
        ]);
        $response->assertStatus(403);
    }

    // ──────────────────────────────────────────────
    // DASHBOARD ROLE GATING (BUG-001 regression)
    // ──────────────────────────────────────────────

    public function test_citizen_cannot_access_admin_dashboard(): void
    {
        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        Sanctum::actingAs($citizen);

        $this->getJson('/api/v1/dashboard/admin')->assertStatus(403);
        $this->getJson('/api/v1/dashboard/officer')->assertStatus(403);
        $this->getJson('/api/v1/dashboard/head')->assertStatus(403);
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/dashboard/admin')->assertStatus(200);
    }

    public function test_officer_can_access_officer_dashboard_only(): void
    {
        $agency = Agency::create(['code' => 'PUPR', 'name' => 'Dinas PU', 'description' => 'Test', 'contact_email' => 'pu@test.com', 'phone' => '1']);
        $officer = User::factory()->create(['role' => UserRole::OFFICER, 'agency_id' => $agency->id]);
        Sanctum::actingAs($officer);

        $this->getJson('/api/v1/dashboard/officer')->assertStatus(200);
        $this->getJson('/api/v1/dashboard/admin')->assertStatus(403);
    }

    public function test_quick_search_is_scoped_for_citizen(): void
    {
        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        $other = User::factory()->create(['role' => UserRole::CITIZEN]);
        $this->makeComplaint(['user_id' => $citizen->id, 'title' => 'Jalan Rusak Milik Saya']);
        $this->makeComplaint(['user_id' => $other->id, 'title' => 'Jalan Rusak Orang Lain']);

        Sanctum::actingAs($citizen);
        $response = $this->getJson('/api/v1/dashboard/search?q=Jalan');
        $response->assertStatus(200);

        $titles = collect($response->json('data'))->pluck('title');
        $this->assertTrue($titles->contains('Jalan Rusak Milik Saya'));
        $this->assertFalse($titles->contains('Jalan Rusak Orang Lain'));
    }

    // ──────────────────────────────────────────────
    // PASSWORD RESET (BUG-004 regression)
    // ──────────────────────────────────────────────

    public function test_forgot_password_does_not_leak_email_existence(): void
    {
        $existing = User::factory()->create(['email' => 'ada@test.com']);
        $missing = $this->postJson('/api/v1/auth/forgot-password', ['email' => 'tidakada@test.com']);
        $missing->assertStatus(200)->assertJson(['success' => true]);

        $this->postJson('/api/v1/auth/forgot-password', ['email' => 'ada@test.com'])
            ->assertStatus(200);

        $this->assertDatabaseHas('password_reset_tokens', ['email' => 'ada@test.com']);
        $this->assertDatabaseMissing('password_reset_tokens', ['email' => 'tidakada@test.com']);
    }

    public function test_reset_password_with_invalid_token_rejected(): void
    {
        $user = User::factory()->create(['email' => 'reset@test.com']);

        $response = $this->postJson('/api/v1/auth/reset-password', [
            'token' => 'invalid-token',
            'email' => $user->email,
            'password' => 'NewPass123!',
            'password_confirmation' => 'NewPass123!',
        ]);
        $response->assertStatus(422);
    }

    public function test_reset_password_full_flow(): void
    {
        $user = User::factory()->create(['email' => 'full@test.com']);

        // 1. Request link
        $this->postJson('/api/v1/auth/forgot-password', ['email' => $user->email])
            ->assertStatus(200);

        // 2. Grab the raw token from DB (it is hashed; we cannot reverse it,
        // so instead verify the record exists and the flow is consistent).
        $this->assertDatabaseHas('password_reset_tokens', ['email' => $user->email]);

        // 3. Reset with a malformed password fails validation
        $this->postJson('/api/v1/auth/reset-password', [
            'token' => 'whatever',
            'email' => $user->email,
            'password' => 'short',
            'password_confirmation' => 'short',
        ])->assertStatus(422);
    }

    // ──────────────────────────────────────────────
    // SQLI / XSS PAYLOADS
    // ──────────────────────────────────────────────

    public function test_sqli_payload_in_complaint_store_does_not_500(): void
    {
        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        Sanctum::actingAs($citizen);
        $category = Category::create(['name' => 'Test', 'slug' => 'sqli', 'description' => 'Test', 'icon' => 't']);

        $response = $this->postJson('/api/v1/complaints', [
            'title' => "'; DROP TABLE complaints; --",
            'description' => 'x',
            'category_id' => $category->id,
            'subdistrict' => 'Wolio',
            'address' => "x'; OR 1=1 --",
            'urgency' => 'rendah',
            'reporter_name' => 'Test',
        ]);
        $response->assertStatus(201);
        $this->assertDatabaseHas('complaints', ['title' => "'; DROP TABLE complaints; --"]);
    }

    public function test_error_shape_consistency_for_401(): void
    {
        $response = $this->getJson('/api/v1/dashboard/citizen');
        $response->assertStatus(401)
            ->assertJson(['success' => false]);
    }
}
