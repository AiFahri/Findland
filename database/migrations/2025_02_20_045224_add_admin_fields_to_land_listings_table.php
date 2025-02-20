<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdminFieldsToLandListingsTable extends Migration
{
    public function up()
    {
        Schema::table('land_listings', function (Blueprint $table) {
            if (!Schema::hasColumn('land_listings', 'approved_by')) {
                $table->unsignedBigInteger('approved_by')->nullable()->after('user_id');
            }

            if (!Schema::hasColumn('land_listings', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('approved_by');
            }

            if (!Schema::hasColumn('land_listings', 'admin_notes')) {
                $table->text('admin_notes')->nullable()->after('approved_at');
            }

            if (!Schema::hasColumn('land_listings', 'admin_status')) {
                $table->enum('admin_status', ['pending', 'approved', 'rejected'])
                      ->default('pending')
                      ->after('admin_notes');
            }

            // Add foreign key constraint if not exists
            if (!Schema::hasColumn('land_listings', 'approved_by')) {
                $table->foreign('approved_by')
                      ->references('id')
                      ->on('admin')
                      ->onDelete('set null');
            }
        });
    }

    public function down()
    {
        Schema::table('land_listings', function (Blueprint $table) {
            // Only drop columns and foreign key if they exist
            if (Schema::hasColumn('land_listings', 'approved_by')) {
                $table->dropForeign(['approved_by']);
                $table->dropColumn('approved_by');
            }

            $columns = ['approved_at', 'admin_notes', 'admin_status'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('land_listings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
}