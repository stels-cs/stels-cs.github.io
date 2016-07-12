<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class VkUserLikeOtherusers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vk_user_like', function (Blueprint $table) {
            $table->integer('from_id');
            $table->integer('to_id');
            $table->timestamps();
            $table->unique(['from_id', 'to_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExist('vk_user_like');
    }
}
