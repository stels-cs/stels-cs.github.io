<?php

namespace App\Jobs;

use App\Jobs\Job;
use App\Models\VkUserLike;
use App\Providers\Vk\Auth;
use App\Providers\Vk\VkApiException;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendNoticeIfLike extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    protected $fromId;
    protected $toId;

    /**
     * Create a new job instance.
     *
     * @param int $fromId
     * @param int $toId
     */
    public function __construct(int $fromId, int $toId)
    {
        $this->fromId = $fromId;
        $this->toId = $toId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        //fromId -  Вася
        //toId - Катя
        $like = VkUserLike::where('from_id', $this->fromId)->where('to_id', $this->toId)->where('is_really_like', 1)->first();
        if ($like instanceof VkUserLike) {
            //Вася лайкнул катю
            if ($like->hasSyncLike()) { //Если катя тоже лайкнула васю
                $response = $this->noticeTo( $this->toId ); //Отправим сообщение Кате, а вася увидел его в прилоении
                if (isset($response['response'])) {
                    \Log::info('Success notify to '.$this->toId);
                } else {
                    \Log::error('Fail notify to '.$this->toId);
                }
            }
        }
    }

    public function noticeTo($toId)
    {
        $token = $this->getToken();

        $m = 'secure.sendNotification';
        
        $text = [
            'У вас есть новая пара!',
            'У вас появилась новая пара!',
            'Новая пара в Pinder!',
            'Откройте Pinder, у вас новая пара!',
            'Вы кому то понравились в Pinder!',
        ];
        
        $params = [
            'user_id' => $toId,
            'message' => $text[ rand(0, count($text)-1) ],
            'access_token' => $token,
            'test_mode' => env('VK_TEST_MODE', 1),
            'client_secret' => env('VK_APP_SECRET')
        ];
    
        try {
            return Auth::call($m, $params);
        } catch (VkApiException $e) {
            \Log::error($e);
        }
    }

    private function getToken()
    {
        $key = 'VK_TOKEN_KEY_';
        return \Cache::remember($key, 2880, function () {
            return Auth::getServerToken();
        });
    }
}
