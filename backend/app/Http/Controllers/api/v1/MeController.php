<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\VkUser;
use App\Providers\Vk\Auth;
use Illuminate\Http\Request;

class MeController extends Controller
{
    //asdfsdf
    public function index(Request $r) {
        $viewerId = $r->get('viewer_id', 1);
        $authKey = $r->get('auth_key', '');
        if (Auth::check($authKey, $viewerId)) {
            $user = VkUser::findOrCreate($viewerId);
            $user->touch();
            return response()->json($user->toArray());
        } else {
            return response()->json(['error'=>'Invalid auth key'], 403);
        }
    }
    //HEY
}