<?php

namespace Database\Seeders;

use App\Models\LandListing;
use App\Models\Package;
use App\Models\PropertyListing;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PropertyListingSeeder extends Seeder
{
    public function run(): void
    {
        $packageId = Package::where('name', 'Pro')->value('id')
            ?? Package::query()->value('id');

        foreach ($this->properties() as $index => $property) {
            $ownerNumber = $index + 1;
            $user = User::updateOrCreate(
                ['email' => "pemilik{$ownerNumber}@example.test"],
                [
                    'first_name' => $property['owner']['first_name'],
                    'last_name' => $property['owner']['last_name'],
                    'address' => $property['owner']['address'],
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                ]
            );

            $landListing = LandListing::updateOrCreate(
                ['ktp_id' => $property['owner']['ktp_id']],
                [
                    'user_id' => $user->id,
                    'full_name' => $property['owner']['first_name'].' '.$property['owner']['last_name'],
                    'birth_place_date' => $property['owner']['birth_place_date'],
                    'address' => $property['owner']['address'],
                    'phone_number' => $property['owner']['phone_number'],
                    'npwp' => $property['owner']['npwp'],
                    'ktp_scan' => 'ktp/dummy.jpg',
                    'package_id' => $packageId,
                    'land_photos' => $property['images'],
                    'status' => $property['status'],
                    'admin_status' => 'approved',
                    'admin_notes' => 'Data demo area Malang untuk pengembangan aplikasi.',
                    'approved_at' => now(),
                    'is_paid' => true,
                    'expiry_date' => now()->addYear(),
                    'maps_link' => $property['maps'],
                ]
            );

            PropertyListing::updateOrCreate(
                ['land_listing_id' => $landListing->id],
                [
                    'user_id' => $user->id,
                    'image' => $property['images'][0],
                    'images' => array_slice($property['images'], 1),
                    'title' => $property['title'],
                    'status' => $property['status'],
                    'price' => $property['price'],
                    'description' => $property['description'],
                    'place' => $property['place'],
                    'desc_detail' => $property['desc_detail'],
                    'maps' => $property['maps'],
                    'wa' => '6287889601959',
                    'featured' => $property['featured'],
                    'latitude' => $property['latitude'],
                    'longitude' => $property['longitude'],
                    'land_area' => $property['land_area'],
                    'certificate_type' => $property['certificate_type'],
                ]
            );
        }
    }

    private function properties(): array
    {
        $photos = [
            'rice' => 'https://images.unsplash.com/photo-1504656920499-6ba6cba050e8?auto=format&fit=crop&w=1400&q=80',
            'paddy' => 'https://images.unsplash.com/photo-1560601642-acf510731c63?auto=format&fit=crop&w=1400&q=80',
            'field' => 'https://images.unsplash.com/photo-1563177682-c9878c71a5f9?auto=format&fit=crop&w=1400&q=80',
            'hills' => 'https://images.unsplash.com/photo-1512895087696-f9b474716b8d?auto=format&fit=crop&w=1400&q=80',
            'terrace' => 'https://images.unsplash.com/photo-1553673257-c9c9cb846dfc?auto=format&fit=crop&w=1400&q=80',
            'meadow' => 'https://images.unsplash.com/photo-1679017111256-9f4b8583db45?auto=format&fit=crop&w=1400&q=80',
            'green' => 'https://images.unsplash.com/photo-1731838210795-aba7a7437cc4?auto=format&fit=crop&w=1400&q=80',
            'road' => 'https://images.unsplash.com/photo-1546695075-b7a89499fdfa?auto=format&fit=crop&w=1400&q=80',
        ];

        return [
            [
                'title' => 'Tanah Pekarangan Strategis Lowokwaru',
                'status' => 'Dijual',
                'price' => 1530000000,
                'description' => 'Kavling siap bangun di kawasan Lowokwaru dengan akses lingkungan yang baik.',
                'place' => 'Lowokwaru, Kota Malang',
                'desc_detail' => "Data demo. Tanah pekarangan 180 m2 di kawasan Lowokwaru. Cocok untuk hunian atau rumah kos, dengan akses kendaraan roda empat dan lingkungan yang telah berkembang. Harga setara Rp8,5 juta per m2.",
                'land_area' => 180,
                'certificate_type' => 'SHM',
                'latitude' => -7.94490,
                'longitude' => 112.61750,
                'featured' => true,
                'images' => [$photos['road'], $photos['green'], $photos['meadow']],
                'maps' => 'https://www.google.com/maps/search/?api=1&query=-7.94490,112.61750',
                'owner' => $this->owner(1, 'Arif', 'Prasetyo', 'Malang, 12 Mei 1987', 'Lowokwaru, Kota Malang'),
            ],
            [
                'title' => 'Kavling View Pegunungan Dau',
                'status' => 'Dijual',
                'price' => 975000000,
                'description' => 'Kavling berkontur landai di Dau dengan suasana sejuk dan panorama pegunungan.',
                'place' => 'Dau, Kabupaten Malang',
                'desc_detail' => "Data demo. Kavling 300 m2 dengan kontur relatif landai dan akses jalan lingkungan. Sesuai untuk rumah tinggal, vila kecil, atau investasi jangka menengah. Harga setara Rp3,25 juta per m2.",
                'land_area' => 300,
                'certificate_type' => 'SHM',
                'latitude' => -7.92180,
                'longitude' => 112.55860,
                'featured' => true,
                'images' => [$photos['meadow'], $photos['hills'], $photos['green']],
                'maps' => 'https://www.google.com/maps/search/?api=1&query=-7.92180,112.55860',
                'owner' => $this->owner(2, 'Dewi', 'Lestari', 'Malang, 8 Agustus 1990', 'Dau, Kabupaten Malang'),
            ],
            [
                'title' => 'Tanah Hook Dekat Karangploso',
                'status' => 'Dijual',
                'price' => 1125000000,
                'description' => 'Tanah sudut dengan dua sisi akses di kawasan berkembang Karangploso.',
                'place' => 'Karangploso, Kabupaten Malang',
                'desc_detail' => "Data demo. Tanah 450 m2 dengan posisi sudut dan akses mobil. Cocok untuk hunian, usaha lingkungan, atau kavling. Harga setara Rp2,5 juta per m2.",
                'land_area' => 450,
                'certificate_type' => 'SHM',
                'latitude' => -7.89840,
                'longitude' => 112.59610,
                'featured' => true,
                'images' => [$photos['green'], $photos['road'], $photos['meadow']],
                'maps' => 'https://www.google.com/maps/search/?api=1&query=-7.89840,112.59610',
                'owner' => $this->owner(3, 'Bima', 'Santoso', 'Malang, 21 Januari 1985', 'Karangploso, Kabupaten Malang'),
            ],
            [
                'title' => 'Lahan Usaha Tepi Jalan Pakis',
                'status' => 'Dijual',
                'price' => 1080000000,
                'description' => 'Lahan dengan muka lebar di Pakis untuk gudang ringan atau tempat usaha.',
                'place' => 'Pakis, Kabupaten Malang',
                'desc_detail' => "Data demo. Lahan 600 m2 dengan akses kendaraan dan muka tanah yang memadai. Potensial untuk gudang ringan, bengkel, atau usaha lokal sesuai perizinan. Harga setara Rp1,8 juta per m2.",
                'land_area' => 600,
                'certificate_type' => 'HGB',
                'latitude' => -7.95360,
                'longitude' => 112.72120,
                'featured' => false,
                'images' => [$photos['field'], $photos['road'], $photos['green']],
                'maps' => 'https://www.google.com/maps/search/?api=1&query=-7.95360,112.72120',
                'owner' => $this->owner(4, 'Nadia', 'Kusuma', 'Malang, 17 Maret 1992', 'Pakis, Kabupaten Malang'),
            ],
            [
                'title' => 'Tanah Pertanian Produktif Tumpang',
                'status' => 'Dijual',
                'price' => 850000000,
                'description' => 'Lahan pertanian luas di Tumpang dengan lingkungan agraris dan udara sejuk.',
                'place' => 'Tumpang, Kabupaten Malang',
                'desc_detail' => "Data demo. Lahan pertanian 1.250 m2 dengan akses jalan desa dan lingkungan agraris. Cocok dipertahankan sebagai kebun atau lahan budidaya. Harga setara Rp680 ribu per m2.",
                'land_area' => 1250,
                'certificate_type' => 'SHM',
                'latitude' => -8.00670,
                'longitude' => 112.76370,
                'featured' => false,
                'images' => [$photos['rice'], $photos['paddy'], $photos['terrace']],
                'maps' => 'https://www.google.com/maps/search/?api=1&query=-8.00670,112.76370',
                'owner' => $this->owner(5, 'Rizky', 'Maulana', 'Malang, 4 Oktober 1988', 'Tumpang, Kabupaten Malang'),
            ],
            [
                'title' => 'Sewa Lahan Komersial Kepanjen',
                'status' => 'Disewa',
                'price' => 90000000,
                'description' => 'Lahan sewa tahunan dekat pusat Kepanjen untuk area usaha terbuka.',
                'place' => 'Kepanjen, Kabupaten Malang',
                'desc_detail' => "Data demo. Lahan 900 m2 disewakan Rp90 juta per tahun. Akses kendaraan memadai dan cocok untuk area usaha terbuka, parkir, atau penyimpanan nonpermanen sesuai perizinan.",
                'land_area' => 900,
                'certificate_type' => 'SHM',
                'latitude' => -8.13030,
                'longitude' => 112.57290,
                'featured' => false,
                'images' => [$photos['road'], $photos['field'], $photos['hills']],
                'maps' => 'https://www.google.com/maps/search/?api=1&query=-8.13030,112.57290',
                'owner' => $this->owner(6, 'Sari', 'Wulandari', 'Malang, 29 Juni 1991', 'Kepanjen, Kabupaten Malang'),
            ],
        ];
    }

    private function owner(int $number, string $firstName, string $lastName, string $birth, string $address): array
    {
        return [
            'first_name' => $firstName,
            'last_name' => $lastName,
            'birth_place_date' => $birth,
            'address' => $address,
            'ktp_id' => (str_contains($address, 'Kota Malang') ? '3573' : '3507')
                .str_pad((string) $number, 12, '0', STR_PAD_LEFT),
            'phone_number' => '628000000'.str_pad((string) $number, 3, '0', STR_PAD_LEFT),
            'npwp' => '00.000.00'.$number.'.0-000.000',
        ];
    }
}
