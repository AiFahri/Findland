<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddPackageIdToLandListingsTable extends Migration
{
    public function up()
    {
        Schema::table('land_listings', function (Blueprint $table) {
            if (!Schema::hasColumn('land_listings', 'package_id')) {
                $table->unsignedBigInteger('package_id')->nullable()->after('ktp_scan');
            }

            if (!Schema::hasColumn('land_listings', 'land_photos')) {
                $table->text('land_photos')->nullable()->after('package_id');
                // Set default value menggunakan DB::statement setelah kolom dibuat
                DB::statement("UPDATE land_listings SET land_photos = '[]' WHERE land_photos IS NULL");
            }
        });
    }

    public function down()
    {
        Schema::table('land_listings', function (Blueprint $table) {
            if (Schema::hasColumn('land_listings', 'package_id')) {
                $table->dropColumn('package_id');
            }
            
            if (Schema::hasColumn('land_listings', 'land_photos')) {
                $table->dropColumn('land_photos');
            }
        });
    }
}
