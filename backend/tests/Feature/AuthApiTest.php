<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_successfully(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Warga Baru',
            'email' => 'wargabaru@gmail.com',
            'password' => 'Password123!',
            'phone' => '081299998888',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email', 'role'],
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'wargabaru@gmail.com',
        ]);
    }

    public function test_invalid_login_credentials_returns_generic_error(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'nonexistent@gmail.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Email atau kata sandi salah.',
            ]);
    }

    public function test_valid_user_can_login(): void
    {
        $user = User::factory()->create([
            'email' => 'testuser@gmail.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'testuser@gmail.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['user', 'token'],
            ]);
    }
}
