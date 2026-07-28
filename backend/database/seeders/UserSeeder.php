<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Master Super Admin
        User::updateOrCreate(
            ['email' => 'admin@baubaukota.go.id'],
            [
                'name' => 'Administrator Master Baubau',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '081234567890',
            ]
        );

        // 2. Petugas OPD PUPR
        User::updateOrCreate(
            ['email' => 'officer.pupr@baubaukota.go.id'],
            [
                'name' => 'Petugas Lapangan PUPR',
                'password' => Hash::make('password123'),
                'role' => 'officer',
                'agency_id' => 1,
                'phone' => '081245678901',
            ]
        );

        // 3. Warga Masyarakat Baubau
        User::updateOrCreate(
            ['email' => 'warga@gmail.com'],
            [
                'name' => 'La Ode Ahmad',
                'password' => Hash::make('password123'),
                'role' => 'citizen',
                'phone' => '085298765432',
            ]
        );
    }
}
