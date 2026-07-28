<?php

namespace Database\Seeders;

use App\Models\Complaint;
use App\Models\ComplaintStatusLog;
use Illuminate\Database\Seeder;

class ComplaintSeeder extends Seeder
{
    public function run(): void
    {
        $complaints = [
            [
                'id' => 1,
                'ticket_code' => 'SIPIL-2026-8A91',
                'title' => 'Jalan Berlubang Parah di Depan Benteng Keraton Wolio',
                'description' => 'Terdapat lubang sedalam 15 cm di jalur utama dekat gerbang Benteng Keraton. Sangat membahayakan pengendara sepeda motor saat malam hari.',
                'category_id' => 1,
                'agency_id' => 1,
                'user_id' => 3,
                'reporter_name' => 'La Ode Ahmad',
                'reporter_phone' => '081245678901',
                'reporter_email' => 'laode.ahmad@gmail.com',
                'address' => 'Jl. Sultan Murhum No. 45, Wolio',
                'subdistrict' => 'Wolio',
                'latitude' => -5.4642000,
                'longitude' => 122.6035000,
                'urgency' => 'tinggi',
                'status' => 'diproses',
            ],
            [
                'id' => 2,
                'ticket_code' => 'SIPIL-2026-8A92',
                'title' => 'Lampu PJU Padam Sepanjang Jalur Pantai Kamali',
                'description' => 'Deretan 5 tiang lampu jalan utama Pantai Kamali mati total sejak 3 hari lalu. Suasana menjadi gelap dan rawan kejahatan.',
                'category_id' => 3,
                'agency_id' => 2,
                'user_id' => 3,
                'reporter_name' => 'Wa Ode Rosmiati',
                'reporter_phone' => '085298765432',
                'reporter_email' => 'rosmiati@gmail.com',
                'address' => 'Kawasan Wisata Pantai Kamali, Betoambari',
                'subdistrict' => 'Betoambari',
                'latitude' => -5.4688000,
                'longitude' => 122.6012000,
                'urgency' => 'sedang',
                'status' => 'selesai',
                'completed_at' => now(),
            ],
            [
                'id' => 3,
                'ticket_code' => 'SIPIL-2026-8A93',
                'title' => 'Drainase Tersumbat Sampah Menyebabkan Meluap ke Jalan Murhum',
                'description' => 'Saluran pembuangan air di sekitar pertokoan Murhum tersumbat endapan lumpur dan sampah plastik, meluap setiap kali hujan deras.',
                'category_id' => 2,
                'agency_id' => 1,
                'user_id' => 3,
                'reporter_name' => 'Muhammad Fadel',
                'reporter_phone' => '082134567890',
                'reporter_email' => 'fadel.baubau@gmail.com',
                'address' => 'Jl. Palagimata Komp. Kantor Walikota, Murhum',
                'subdistrict' => 'Murhum',
                'latitude' => -5.4755000,
                'longitude' => 122.6105000,
                'urgency' => 'darurat',
                'status' => 'menunggu',
            ],
        ];

        foreach ($complaints as $c) {
            $complaint = Complaint::updateOrCreate(['id' => $c['id']], $c);

            ComplaintStatusLog::updateOrCreate(
                ['complaint_id' => $complaint->id, 'status' => 'menunggu'],
                [
                    'notes' => 'Laporan berhasil terdaftar di Sistem SIPIL BAUBAU.',
                    'updated_by' => 'Sistem',
                ]
            );
        }
    }
}
