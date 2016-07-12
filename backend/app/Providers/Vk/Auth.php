<?php

namespace App\Providers\Vk;

class Auth
{

    public static function check($authKey, $viewerId) {
        $valid = [ env('VK_APP_ID'), $viewerId, env('VK_APP_SECRET') ];
        $valid = md5( implode('_', $valid) );
        return mb_strtolower($valid) == mb_strtolower($authKey);
    }

    public static function getServerToken() {
        $url = 'https://oauth.vk.com/access_token';
        $params = [
            'client_id' => env('VK_APP_ID'),
            'client_secret' => env('VK_APP_SECRET'),
            'grant_type' => 'client_credentials',
            'v' => env('VK_V', '5.52')
        ];
        $url .= '?'.http_build_query($params);
        $data = @file_get_contents($url);
        $data = json_decode($data, true);
        if ($data && isset($data['access_token'])) {
            return $data['access_token'];
        } else {
            throw new VkApiException('Error fetching token', 1);
        }
    }

    public static function call($m, $params)
    {
        $url = 'https://api.vk.com/method/'.$m;
        $params['v'] = env('VK_V', '5.52');
        $url .= '?'.http_build_query($params);
        $data = @file_get_contents($url);
        return json_decode($data, true);
    }

}