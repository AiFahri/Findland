<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLandListingImagesTable extends Migration
{
    public function up()
    {
        Schema::create('land_listing_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('land_listing_id')->constrained()->onDelete('cascade');
            $table->string('path');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('land_listing_images');
    }
}