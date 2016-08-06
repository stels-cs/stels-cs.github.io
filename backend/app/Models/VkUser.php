<?php

namespace App\Models;

use App\Jobs\SendNoticeIfLike;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;

class VkUser extends Model
{
    protected $table = 'vk_user';
    
    protected $casts = [
        'watched_ids' => 'array'
    ];

    public static function findOrCreate($id)
    {
        $id = (int)$id;
        $user = self::find($id);
        if ($user) {
            return $user;
        } else {
            return self::createUser($id);
        }
    }

    public static function createUser($id)
    {
        $u = new self();
        $u->id = $id;
        $u->save();
        $u->id = $id;
        return $u;
    }

    public function iLike() {
        return $this->iSelect()->where('is_really_like', 1);
    }

    public function iSelect() {
        return $this->hasMany('App\Models\VkUserLike', 'from_id', 'id');
    }

    public function meLike() {
        return $this->hasMany('App\Models\VkUserLike', 'to_id', 'id')->where('is_really_like', 1);
    }

    public function matched() {
        return VkUserLike::where('from_id', $this->id)->where('is_really_like', 1)->whereRaw('to_id IN (SELECT from_id FROM vk_user_like WHERE to_id = ? AND is_really_like = 1 )', [$this->id] )->take(100000);
    }

    public function toArray($light = false) {
        $data = parent::toArray();
        if (!$light) {
            $data['selected'] = $this->iLike()->count();
            $data['selectedIds'] = $this->iSelect()->select('to_id')->pluck('to_id')->all();
        }
        $data['selectedMe'] = $this->meLike()->count();
        $data['matchedUsers'] = $this->matched()->select('to_id')->pluck('to_id')->all();
        $data['matched'] = count($data['matchedUsers']);
        return $data;
    }
    
    public function like($userId) {
        $like = new VkUserLike();
        $like->from_id = $this->id;
        $like->to_id = $userId;
        $like->is_really_like = 1;
        try {
            $like->save();
        } catch (QueryException $e ) {
            VkUserLike::where('from_id', $this->id)->where('to_id', $userId)->update([
                'is_really_like' => 1
            ]);
        }
        dispatch( new SendNoticeIfLike($this->id, $userId) );
    }
    
    public function skip($userId) {
        $like = new VkUserLike();
        $like->from_id = $this->id;
        $like->to_id = $userId;
        $like->is_really_like = 0;
        try {
            $like->save();
        } catch (QueryException $e ) {
            VkUserLike::where('from_id', $this->id)->where('to_id', $userId)->update([
               'is_really_like' => 0 
            ]);
        }
    }

    public function pay()
    {
        $watchedIds = $this->meLike()->select('from_id')->get()->map( function ($x) { return $x->from_id;  } )->all();
        \Log::info("Payed user", [
            'id'=>$this->id, 
            'new_ids'=>$watchedIds,
            'old_ids'=>$this->watched_ids
        ]);
        $this->watched_ids = $watchedIds;
        $this->save();
    }

    public function getWatchedIdsAttribute($ids) {
        $ids = json_decode($ids);
        if (!is_array($ids)) {
            return [];
        } else {
            return $ids;
        }
    }
}
