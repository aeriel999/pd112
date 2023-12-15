<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('categories', function (Blueprint $table) {
            // Make the 'image' field non-nullable
            $table->string('name')->nullable(false)->change();

            $table->string('image')->nullable(false)->change();

            // Make the 'description' field non-nullable
            $table->text('description')->nullable(false)->change();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('categories', function (Blueprint $table) {
            // Make 'image' nullable again
            $table->string('name')->nullable()->change();

            $table->string('image')->nullable()->change();

            // Make 'description' nullable again
            $table->text('description')->nullable()->change();
        });
    }

};
