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
                $table->text('land_photos')->nullable()->default('[]')->after('package_id');
            } else {
                DB::statement('ALTER TABLE land_listings MODIFY COLUMN land_photos TEXT NULL DEFAULT \'[]\'');
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