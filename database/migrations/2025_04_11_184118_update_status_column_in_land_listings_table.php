<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('land_listings', function (Blueprint $table) {
            if (Schema::hasColumn('land_listings', 'status')) {
                $table->dropColumn('status');
            }
            $table->enum('status', ['Dijual', 'Disewa'])->default('Dijual')->after('land_photos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('land_listings', function (Blueprint $table) {
            if (Schema::hasColumn('land_listings', 'status')) {
                $table->dropColumn('status');
            }
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->after('land_photos');
        });
    }
};
