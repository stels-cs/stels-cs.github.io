<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\VkUser;
use App\Providers\Vk\Auth;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function index(Request $r) {
        $targetId = $r->get('target_id', 1);
        $viewerId = $r->get('viewer_id', 1);
        $authKey = $r->get('auth_key', '');
        if (Auth::check($authKey, $viewerId)) {
            $user = VkUser::findOrCreate($viewerId);
            $user->like((int) $targetId);
            return response()->json($user->toArray(true));
        } else {
            return response()->json(['error'=>'Invalid auth key'], 403);
        }
    }
}