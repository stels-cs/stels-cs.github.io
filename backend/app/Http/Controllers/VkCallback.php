<?php

namespace App\Http\Controllers;

use App\Jobs\VinciJob;
use App\VinciUser;
use Illuminate\Http\Request;

use App\Http\Requests;
use Intervention\Image\ImageManager;

define('BOT_TOKEN', '60ebeb171fa26f39c539a1e0735e35c0a37a6a5973d31231589c1d19d149c574b25d001b11ebfd17b704d');
define('BOT_KEY', 'c5b826d7');

class VkCallback extends Controller
{
    public function index(Request $r) {
        if ($r->has('test')) {
            $file_contents = file_get_contents('https://pp.vk.me/c630029/v630029187/4572b/GASCpwdjFPo.jpg');

            $manager = new ImageManager(array('driver' => 'gd'));

            $image = $manager->make($file_contents);

            $w = $image->width();
            $h = $image->height();

            if ($h > $w) {
                $image = $image->crop( $w, $w, 0, round(($h-$w)/2) );
                $file_contents = $image->response('jpg', 90);
            } else if ($w > $h) {
                $image = $image->crop( $h, $h, round(($w-$h)/2), 0 );
                $file_contents = $image->response('jpg', 90);
            }
            return $file_contents;
        }

        $message = $r->all();

        $type = $message['type'];

        if ($type == 'confirmation') {
            return $this->confirmWebHook();
        } else if( $type == 'message_new' ) {
            $object = $message['object'];
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
            VinciUser::create(['id'=>$message['user_id'], 'preload'=>'', 'page'=>-1]);
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
                $this->chooseFiter($user, $message);

                dispatch( new VinciJob(
                    [
                        'type' => 'init',
                        'user_id' => $message['user_id'],
                        'photo' => $max['url'],
                    ]
                ) );
            } else {
                if (empty($user) || $user->page < 0) {
                    $params = [
                        'peer_id' => $message['user_id'],
                        'message' => "Привет!\nЭто бот Vinci отправь мне фотграфию и я сделаю магию!"
                    ];
                    $this->api('messages.send', $params);
                } else {
                    $body = $message['body'];
                    $body = (int) $body;
                    if ($body >= 1 && $body <= 20) {

                        if ($body == 9 && $user->page == 1) {
                            $user->page = 2;
                            $user->save();
                            $params = [
                                'peer_id'=> $message['user_id'],
                                'message' => "Чтобы посмотреть другие фильтры отправь цифру 16.\nЧтобы вернуться к предыдущим фильтрам отправь цифру 8.",
                                'attachment' => 'photo19039187_420449968_d53a667a03a58241d6'
                            ];
                            $this->api('messages.send', $params);
                            return;
                        }

                        if ($body == 8 && $user->page == 2) {
                            $user->page = 1;
                            $user->save();
                            $params = [
                                'peer_id'=> $message['user_id'],
                                'message' => 'Чтобы посмотреть другие фильтры отправь цифру 9.',
                                'attachment' => 'photo19039187_420449967_ec3b3cf76a5d537c2f'
                            ];
                            $this->api('messages.send', $params);
                            return;
                        }

                        if ($body == 16 && $user->page == 2) {
                            $user->page = 3;
                            $user->save();
                            $params = [
                                'peer_id'=> $message['user_id'],
                                'message' => "Чтобы вернуться к предыдущим фильтрам отправь цифру 15.",
                                'attachment' => 'photo19039187_420449969_5b8df24045ce11b9a2'
                            ];
                            $this->api('messages.send', $params);
                            return;
                        }

                        if ($body == 15 && $user->page == 3) {
                            $user->page = 2;
                            $user->save();
                            $params = [
                                'peer_id'=> $message['user_id'],
                                'message' => "Чтобы посмотреть другие фильтры отправь цифру 16.\nЧтобы вернуться к предыдущим фильтрам отправь цифру 8.",
                                'attachment' => 'photo19039187_420449968_d53a667a03a58241d6'
                            ];
                            $this->api('messages.send', $params);
                            return;
                        }

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
                        $this->chooseFiter($user, $message, true);
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

    private function chooseFiter($user, $message, $ex = false)
    {
        $params = [
            'peer_id'=> $message['user_id'],
            'message' => "Отправь номер фильтра, чтобы применить его.\n\nЧтобы посмотреть другие фильтры отправь цифру 9.",
            'attachment' => 'photo19039187_420449967_ec3b3cf76a5d537c2f'
        ];
        $this->api('messages.send', $params);
        $user->page = 1;
        $user->save();
    }

}
