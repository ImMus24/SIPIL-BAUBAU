<?php

namespace Database\Seeders;

use App\Models\Agency;
use Illuminate\Database\Seeder;

class AgencySeeder extends Seeder
{
    public function run(): void
    {
        $agencies = [
            [
                'id' => 1,
                'code' => 'PUPR',
                'name' => 'Dinas Pekerjaan Umum dan Penataan Ruang Kota Baubau',
                'description' => 'Penanganan infrastruktur jalan, jembatan, dan tata ruang',
                'contact_email' => 'dinaspupr@baubaukota.go.id',
                'phone' => '(0402) 2821101'
            ],
            [
                'id' => 2,
                'code' => 'PERKIM',
                'name' => 'Dinas Perumahan dan Kawasan Permukiman Kota Baubau',
                'description' => 'Penanganan penerangan jalan umum dan drainase permukiman',
                'contact_email' => 'disperkim@baubaukota.go.id',
                'phone' => '(0402) 2821102'
            ],
            [
                'id' => 3,
                'code' => 'DLH',
                'name' => 'Dinas Lingkungan Hidup Kota Baubau',
                'description' => 'Pengelolaan kebersihan, pembersihan tempat sampah, dan pertamanan',
                'contact_email' => 'dlh@baubaukota.go.id',
                'phone' => '(0402) 2821103'
            ],
            [
                'id' => 4,
                'code' => 'DISHUB',
                'name' => 'Dinas Perhubungan Kota Baubau',
                'description' => 'Pengelolaan rambu-rambu lalu lintas dan markah jalan',
                'contact_email' => 'dishub@baubaukota.go.id',
                'phone' => '(0402) 2821104'
            ],
        ];

        foreach ($agencies as $agency) {
            Agency::updateOrCreate(['id' => $agency['id']], $agency);
        }
    }
}
