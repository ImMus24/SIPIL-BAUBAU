<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Category;
use App\Models\User;
use App\Enums\UserRole;
use Laravel\Sanctum\Sanctum;

class ComplaintApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_categories_and_agencies(): void
    {
        Category::create([
            'name' => 'Jalan Rusak',
            'slug' => 'jalan-rusak',
            'description' => 'Kerusakan jalan',
            'icon' => 'warning',
        ]);

        $response = $this->getJson('/api/v1/categories');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => ['id', 'name', 'slug', 'description', 'icon'],
                ],
            ]);
    }

    public function test_can_submit_complaint_and_lookup_by_ticket(): void
    {
        // Authentication is now required for complaint submission
        $citizen = User::factory()->create(['role' => UserRole::CITIZEN]);
        Sanctum::actingAs($citizen);

        $category = Category::create([
            'name' => 'Lampu Jalan',
            'slug' => 'lampu-jalan',
            'description' => 'Lampu mati',
            'icon' => 'lightbulb',
        ]);

        $response = $this->postJson('/api/v1/complaints', [
            'title'         => 'Lampu Jalan Padam Pantai Kamali',
            'description'   => 'Lampu jalan mati total di area dermaga',
            'category_id'   => $category->id,
            'subdistrict'   => 'Wolio',
            'address'       => 'Kawasan Pantai Kamali, Baubau',
            'urgency'       => 'tinggi',
            'reporter_name' => 'Masyarakat Kamali',
            'reporter_phone' => '08123456789',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['id', 'ticket_code', 'title', 'status'],
            ]);

        $ticketCode = $response->json('data.ticket_code');

        $lookupResponse = $this->getJson("/api/v1/complaints/ticket/{$ticketCode}");
        $lookupResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'ticket_code' => $ticketCode,
                    'title' => 'Lampu Jalan Padam Pantai Kamali',
                ],
            ]);
    }

    public function test_can_fetch_statistics_summary(): void
    {
        $response = $this->getJson('/api/v1/stats/summary');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['total', 'menunggu', 'diproses', 'selesai', 'ditolak', 'completion_rate'],
            ]);
    }

    /** Complaint submission now requires authentication. */
    public function test_unauthenticated_submission_returns_401(): void
    {
        $response = $this->postJson('/api/v1/complaints', []);

        $response->assertStatus(401);
    }
}
