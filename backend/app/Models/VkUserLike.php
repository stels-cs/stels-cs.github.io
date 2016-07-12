<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class VkUserLike
 * @package App\Models
 * @property int $from_id
 * @property int $to_id
 * @property int $is_really_like
 * @property string $created_at
 * @property VkUser $from
 * @property VkUser $to
 */
class VkUserLike extends Model
{
    protected $table = 'vk_user_like';

    public function from() {
        return $this->hasOne('App\Models\VkUser', 'id', 'from_id');
    }

    public function to() {
        return $this->hasOne('App\Models\VkUser', 'id', 'to_id');
    }

    public function hasSyncLike()
    {
        if ($this->is_really_like) {
            $like = self::where('from_id', $this->to_id)->where('to_id', $this->from_id)->where('is_really_like', 1)->count();
            return !!$like;
        }
        return false;
    }
}
