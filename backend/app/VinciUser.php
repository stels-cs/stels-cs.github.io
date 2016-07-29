<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class VinciUser extends Model
{
    protected $table = 'vinci-user';
    public $timestamps = false;
    protected $fillable = ['id', 'preload', 'page'];
}
