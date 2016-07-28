<?php

namespace App\Http\Controllers;

use App\Jobs\VinciJob;
use App\VinciUser;
use Illuminate\Http\Request;

use App\Http\Requests;

define('BOT_TOKEN', '60ebeb171fa26f39c539a1e0735e35c0a37a6a5973d31231589c1d19d149c574b25d001b11ebfd17b704d');
define('BOT_KEY', 'c5b826d7');

class VkCallback extends Controller
{
    public function index(Request $r) {

        $message = $r->all();

        $type = $message['type'];
        $object = $message['object'];

        if ($type == 'confirmation') {
            return $this->confirmWebHook();
        } else if( $type == 'message_new' ) {
            $this->process($object);
        }
        echo "ok";
    }

    private function confirmWebHook()
    {
        return response(BOT_KEY);
    }

    private function process($message)
    {
        $user = VinciUser::find($message['user_id']);
        if (!$user) {
            VinciUser::create(['id'=>$message['user_id'], 'preload'=>'']);
        }

        try {
            $attachments = isset($message['attachments']) ? $message['attachments'] : [];
            foreach ($attachments as $attach) {
                $type = $attach['type'];
                $attach = $attach[$type];
                if ($type == 'photo') {
                    $max = [
                        'x' => 0,
                        'url' => false
                    ];
                    foreach ($attach as $key=>$value) {
                        if ( strpos($key, 'photo_') === 0 ) {
                            $x = (int)strtr($key, ['photo_' => '']);
                            if ( $x > $max['x'] && $x <= 1080 ) {
                                $max['x'] = $x;
                                $max['url'] = $value;
                            }
                        }
                    }
                }
            }

            if (!empty($max['url'])) {
                $params = [
                    'peer_id'=> $message['user_id'],
                    'message' => "Теперь выберите фильтр"
                ];
                $this->api('messages.send', $params);

                dispatch( new VinciJob(
                    [
                        'type' => 'init',
                        'user_id' => $message['user_id'],
                        'photo' => $max['url'],
                    ]
                ) );
                
            } else {
                if (empty($user)) {
                    $params = [
                        'peer_id' => $message['user_id'],
                        'message' => "Привет!\nЭто бот Vinci отправь мне фотграфию и я сделаю магию!"
                    ];
                    $this->api('messages.send', $params);
                } else {
                    $body = $message['body'];
                    $body = (int) $body;
                    if ($body >= 1 && $body <= 20) {

                        $user->preload = '';
                        $user->save();

                        $params = [
                            'peer_id'=> $message['user_id'],
                            'message' => "Подождите"
                        ];
                        $this->api('messages.send', $params);


                        dispatch( new VinciJob(
                            [
                                'type' => 'apply-filter',
                                'user_id' => $message['user_id'],
                                'filter' => $body,
                            ]
                        ) );


                    } else {

                        $params = [
                            'peer_id'=> $message['user_id'],
                            'message' => "Выберите фильтр"
                        ];
                        $this->api('messages.send', $params);

                    }
                }
            }

        } catch (\Exception $e) {
            $error = [
                $e->getMessage() . ' #' . $e->getCode(),
                $e->getFile() . ':' . $e->getLine(),
                $e->getTraceAsString(),
                json_encode($message),
                json_encode(!empty($user) ? $user : null)
            ];
            $error = implode("\n", $error);
            \Log::error($error);
        }
    }

    public function api($method, $parameters, $try = 0) {
        \Log::info($method.' '.json_encode($parameters));
        $url = 'https://api.vk.com/method/'.$method;

        $parameters = array_merge( $parameters, [
            'v' => '5.52',
            'lang' => 'ru',
            'https' => 1,
            'access_token' => BOT_TOKEN,
        ] );

        if (isset($parameters['no-token'])) {
            unset($parameters['access_token']);
            unset($parameters['no-token']);
        }

        $context = stream_context_create(array(
            'http' => array(
                'timeout' => '10',
                'method' => 'POST',
                'header' => 'Content-Type: application/x-www-form-urlencoded' . PHP_EOL,
                'content' => http_build_query($parameters),
            ),
        ));

        $raw = @file_get_contents($url, false, $context);

        $data = json_decode($raw, true);

        if ($data) {
            if (isset($data['error'])) {
                $code = isset($data['error']['error_code']) ? $data['error']['error_code'] : 0;
                if ($code == 9) {
                    return ['response'=>[]];
                }
                if (in_array($code, [0, 1, 6, 10]) && $try < 4) {
                    \Log::error($raw);
                    sleep(1);
                    return $this->api($method, $parameters, $try + 1);
                } else {
                    throw new \Exception('API ERROR '.$raw);
                }
            } else {
                return $data;
            }
        } else {
            \Log::error('VK API ERROR: '.$raw);
            if ($try < 4) {
                sleep(1);
                return $this->api($method, $parameters, $try + 1);
            } else {
                throw new \Exception('API ERROR '.$raw);
            }
        }
    }

}
