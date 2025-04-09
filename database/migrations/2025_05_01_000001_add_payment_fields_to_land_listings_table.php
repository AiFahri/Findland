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
            if (!Schema::hasColumn('land_listings', 'is_paid')) {
                $table->boolean('is_paid')->default(false)->after('admin_status');
            }
            
            if (!Schema::hasColumn('land_listings', 'expiry_date')) {
                $table->timestamp('expiry_date')->nullable()->after('is_paid');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('land_listings', function (Blueprint $table) {
            if (Schema::hasColumn('land_listings', 'is_paid')) {
                $table->dropColumn('is_paid');
            }
            
            if (Schema::hasColumn('land_listings', 'expiry_date')) {
                $table->dropColumn('expiry_date');
            }
        });
    }
};
