<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'id' => 1,
                'name' => 'Jalan & Jembatan',
                'slug' => 'jalan-jembatan',
                'icon' => 'Road',
                'description' => 'Kerusakan badan jalan, lubang, aspal terkelupas, jembatan rusak'
            ],
            [
                'id' => 2,
                'name' => 'Drainase & Banjir',
                'slug' => 'drainase-banjir',
                'icon' => 'Waves',
                'description' => 'Saluran air tersumbat, tanggul jebol, genangan air jalan'
            ],
            [
                'id' => 3,
                'name' => 'Penerangan Jalan (PJU)',
                'slug' => 'pju',
                'icon' => 'Lightbulb',
                'description' => 'Lampu jalan padam, tiang PJU miring/roboh, kabel terputus'
            ],
            [
                'id' => 4,
                'name' => 'Kebersihan & Sampah',
                'slug' => 'kebersihan-sampah',
                'icon' => 'Trash2',
                'description' => 'Penumpukan sampah liar, TPS meluap, pohon tumbang'
            ],
            [
                'id' => 5,
                'name' => 'Fasilitas & Bangunan Publik',
                'slug' => 'fasilitas-publik',
                'icon' => 'Building2',
                'description' => 'Taman kota rusak, trotoar rusak, halte bus tidak layak'
            ],
            [
                'id' => 6,
                'name' => 'Rambu & Perhubungan',
                'slug' => 'rambu-perhubungan',
                'icon' => 'Signpost',
                'description' => 'Rambu lalu lintas rusak, traffic light padam, cermin tikungan'
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['id' => $cat['id']], $cat);
        }
    }
}
