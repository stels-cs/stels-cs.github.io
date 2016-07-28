<?php

namespace App\Jobs;

use App\Jobs\Job;
use App\Models\VkUserLike;
use App\Providers\Vk\Auth;
use App\Providers\Vk\VkApiException;
use App\VinciUser;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

if (!defined('BOT_TOKEN')) {
    define('BOT_TOKEN', '60ebeb171fa26f39c539a1e0735e35c0a37a6a5973d31231589c1d19d149c574b25d001b11ebfd17b704d');
    define('BOT_KEY', 'c5b826d7');
}
define('MULTIPART_BOUNDARY', '--------------------------'.microtime(true));
define('FORM_FIELD', 'uploaded_file');
define('UPLOAD_URL', 'http://vinci.camera/preload');

class VinciJob extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    protected $params;

    public function __construct($params)
    {
        $this->params = $params;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $userId = $this->params['user_id'];
        $type = $this->params['type'];


        $filterMap = [
            [
                "id" => "1",
                "name" => "Sunny",
                "file" => "http://vinci.camera/list/1/foxy.jpg?50905"
            ],
            [
                "id" => "2",
                "name" => "Delaunay",
                "file" => "http://vinci.camera/list/2/delaunay.jpg?54101"
            ],
            [
                "id" => "3",
                "name" => "Mystic",
                "file" => "http://vinci.camera/list/3/mystic.jpg?49331"
            ],
            [
                "id" => "4",
                "name" => "Kandinsky",
                "file" => "http://vinci.camera/list/4/artistic_1.jpg?49689"
            ],
            [
                "id" => "5",
                "name" => "Pin-Up",
                "file" => "http://vinci.camera/list/5/pinup.jpg?52860"
            ],
            [
                "id" => "6",
                "name" => "Wind",
                "file" => "http://vinci.camera/list/6/dog.jpg?42605"
            ],
            [
                "id" => "7",
                "name" => "Milk",
                "file" => "http://vinci.camera/list/7/negron.jpg?32356"
            ],
            [
                "id" => "8",
                "name" => "Prisma",
                "file" => "http://vinci.camera/list/8/vinci_288.jpg?38519"
            ],
            [
                "id" => "9",
                "name" => "Fire",
                "file" => "http://vinci.camera/list/9/fire.jpg?45460"
            ],
            [
                "id" => "10",
                "name" => "Jesus",
                "file" => "http://vinci.camera/list/10/vinci_2.jpg?61082"
            ],
            [
                "id" => "11",
                "name" => "Oil",
                "file" => "http://vinci.camera/list/11/oil.jpg?60621"
            ],
            [
                "id" => "12",
                "name" => "Poster",
                "file" => "http://vinci.camera/list/12/poster.jpg?43375"
            ],
            [
                "id" => "13",
                "name" => "Annenkov",
                "file" => "http://vinci.camera/list/13/annenkov.jpg?45005"
            ],
            [
                "id" => "14",
                "name" => "Musson",
                "file" => "http://vinci.camera/list/14/wind.jpg?47771"
            ],
            [
                "id" => "15",
                "name" => "42",
                "file" => "http://vinci.camera/list/15/42.jpg?70297"
            ],
            [
                "id" => "16",
                "name" => "Modern",
                "file" => "http://vinci.camera/list/16/modern.jpg?56768"
            ],
            [
                "id" => "17",
                "name" => "Sonia",
                "file" => "http://vinci.camera/list/17/sonia.jpg?53024"
            ],
            [
                "id" => "18",
                "name" => "Girl",
                "file" => "http://vinci.camera/list/18/girl.jpg?49487"
            ],
            [
                "id" => "19",
                "name" => "Malevich",
                "file" => "http://vinci.camera/list/19/malevich.jpg?46949"
            ],
            [
                "id" => "20",
                "name" => "Clouds",
                "file" => "http://vinci.camera/list/20/clouds.jpg?31849"
            ]
        ];

        if ($type == 'init')  {
            $url = $this->params['photo'];
            $file_contents = file_get_contents($url);


            $header = 'Content-Type: multipart/form-data; boundary='.MULTIPART_BOUNDARY;
            $content =  "--".MULTIPART_BOUNDARY."\r\n".
                "Content-Disposition: form-data; name=\"".FORM_FIELD."\"; filename=\"photo.jpg\"\r\n".
                "Content-Type: image/jpeg\r\n\r\n".
                $file_contents."\r\n";
            $content .= "--".MULTIPART_BOUNDARY."--\r\n";
            $context = stream_context_create(array(
                'http' => array(
                    'method' => 'POST',
                    'header' => $header,
                    'content' => $content,
                    'timeout' => 30,
                    'ignore_errors' => true
                )
            ));
            $data = file_get_contents(UPLOAD_URL, false, $context);
            if ($data) {
                $json = json_decode($data, true);
                if ($json && isset($json['preload'])) {
                    $preload = $json['preload'];

                    $user = VinciUser::find($userId);

                    if ($user) {
                        $user->preload = $preload;
                        $user->save();
                    }

//            $task = new \google\appengine\api\taskqueue\PushTask('/vinchi-api', [
//                'type' => 'filter',
//                'user_id' => $userId,
//                'preload' => $preload,
//                'filter' => 0,
//                'group_id' => GROUP_ID
//            ]);
//            $task->add('vinchi-filter');

                } else {
                    \Log::error('ERROR UPLOADING TO VINCI '.$url.' '.$data);
                }
            } else {
                \Log::error('ERROR UPLOADING TO VINCI '.$url);
            }
        } else if ($type == 'filter') {
            $preload = $this->params['preload'];
            $filterId = $this->params['filter'];

            if ($filterId) {

                $url = 'http://vinci.camera/process/'.$preload.'/'.$filterId;

                $context = stream_context_create(array(
                    'http' => array(
                        'timeout' => 30,
                        'ignore_errors' => true
                    )
                ));
                $image = file_get_contents($url, null, $context);

                if ($image) {
                    $data = $this->api('photos.getMessagesUploadServer', []);
                    $url = $data['response']['upload_url'];

                    $header = 'Content-Type: multipart/form-data; boundary='.MULTIPART_BOUNDARY;
                    $content =  "--".MULTIPART_BOUNDARY."\r\n".
                        "Content-Disposition: form-data; name=\"photo\"; filename=\"photo.jpg\"\r\n".
                        "Content-Type: image/jpeg\r\n\r\n".
                        $image."\r\n";
                    $content .= "--".MULTIPART_BOUNDARY."--\r\n";
                    $context = stream_context_create(array(
                        'http' => array(
                            'method' => 'POST',
                            'header' => $header,
                            'content' => $content,
                            'timeout' => 30,
                            'ignore_errors' => true
                        )
                    ));
                    $data = file_get_contents($url, null, $context);

                    if ($data) {
                        $json = json_decode($data, true);
                        if ($json && isset($json['server'])) {
                            $photo = $json['photo'];
                            $server = $json['server'];
                            $hash = $json['hash'];
                            $data = $this->api('photos.saveMessagesPhoto', [
                                'photo' => stripslashes($photo),
                                'server' => $server,
                                'hash' => $hash
                            ]);
                            \Log::error(print_r($data,true));
                            $id = $data['response'][0]['id'];
                            $ownerId = $data['response'][0]['owner_id'];
                            $attach = 'photo'.$ownerId.'_'.$id;
                            $this->api('messages.send', ['peer_id'=>$userId, 'attachment'=>$attach]);
                        } else {
                            \Log::error("BAD ANSWER ".$data);
                        }
                    } else {
                        \Log::error('UPLOADING PHOTO TO VK '.$url);
                    }


                } else {
                    \Log::error('FAIL DOWNLOAD IMAGE FROM VINCI '.$url);
                }

            } else {
                //FUCK
                \Log::error('BAD FILTER '.$filterId);
            }
        } else if ($type == 'apply-filter') {
            $filterId = $this->params['filter'];


            $user = VinciUser::find($userId);

            if ($user && !empty($user['preload'])) {
                dispatch( new VinciJob(
                    [
                        'type' => 'filter',
                        'user_id' => $userId,
                        'preload' => $user->preload,
                        'filter' => $filterId,
                    ]
                ) );

            } else {

                dispatch( new VinciJob(
                    [
                        'type' => 'apply-filter',
                        'user_id' => $userId,
                        'filter' => $filterId,
                    ]
                ) );
            }
        } else {
            \Log::error('Bad params', $this->params);
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
                    return $this->$this->api($method, $parameters, $try + 1);
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
                return $this->$this->api($method, $parameters, $try + 1);
            } else {
                throw new \Exception('API ERROR '.$raw);
            }
        }
    }
}
