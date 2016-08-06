<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\VkUser;
use App\Providers\Vk\Auth;
use Illuminate\Http\Request;

class VkPayment extends Controller
{

    public function index(Request $r) {
        \Log::debug("Payment request", $r->all());
    }

}