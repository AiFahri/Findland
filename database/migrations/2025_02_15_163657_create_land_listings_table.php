<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('land_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('full_name');
            $table->string('birth_place_date');
            $table->text('address');
            $table->string('ktp_id')->unique();
            // $table->string('religion');
            // $table->decimal('monthly_income', 15, 2);
            $table->string('phone_number');
            $table->string('npwp');
            $table->string('ktp_scan');
            $table->json('land_photos');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending'); // Approval Status
            $table->string('maps_link')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('land_listings');
    }
};

