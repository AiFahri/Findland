<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('property_listings', function (Blueprint $table) {
            $table->id();
            $table->string('image');
            $table->json('images')->nullable();
            $table->string('status');
            $table->decimal('price', 15, 2);
            $table->text('description');
            $table->string('place');
            $table->text('desc_detail')->nullable();
            $table->string('maps')->nullable();
            $table->string('wa')->nullable();
            $table->boolean('featured')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('property_listings');
    }
};