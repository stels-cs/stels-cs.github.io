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

        $secret_key = env('VK_APP_SECRET'); // Защищенный ключ приложения

        $response = [];
        $input = $r->all();
        $sig = $input['sig'];
        unset($input['sig']);
        ksort($input);
        $str = '';
        foreach ($input as $k => $v) {
            $str .= $k.'='.$v;
        }

        if ($sig != md5($str.$secret_key)) {
            $response['error'] = array(
                'error_code' => 10,
                'error_msg' => 'Несовпадение вычисленной и переданной подписи запроса.',
                'critical' => true
            );
        } else {
            // Подпись правильная
            switch ($input['notification_type']) {
                case 'get_item':
                    // Получение информации о товаре
                    $item = $input['item']; // наименование товара

                    if ($item == 'item1') {
                        $response['response'] = array(
                            'item_id' => 1,
                            'title' => 'Подсмотреть 1 раз',
                            'photo_url' => url('coin.jpg'),
                            'price' => 5
                        );
                    } else {
                        $response['error'] = array(
                            'error_code' => 20,
                            'error_msg' => 'Товара не существует.',
                            'critical' => true
                        );
                    }
                    break;

                case 'get_item_test':
                    // Получение информации о товаре в тестовом режиме
                    $item = $input['item'];
                    if ($item == 'item1') {
                        $response['response'] = array(
                            'item_id' => 11,
                            'title' => 'Подсмотреть 1 раз (тестовый режим)',
                            'photo_url' => url('coin.jpg'),
                            'price' => 5
                        );
                    } else {
                        $response['error'] = array(
                            'error_code' => 20,
                            'error_msg' => 'Товара не существует.',
                            'critical' => true
                        );
                    }
                    break;

                case 'order_status_change':
                    // Изменение статуса заказа
                    if ($input['status'] == 'chargeable') {
                        $order_id = intval($input['order_id']);
                        $userId = (int) $input['user_id'];

                        $user = VkUser::find($userId);
                        if ($user instanceof VkUser) {
                            $user->pay();
                        }

                        $app_order_id = $userId * 10;
                        $response['response'] = array(
                            'order_id' => $order_id,
                            'app_order_id' => $app_order_id,
                        );
                    } else {
                        $response['error'] = array(
                            'error_code' => 100,
                            'error_msg' => 'Передано непонятно что вместо chargeable.',
                            'critical' => true
                        );
                    }
                    break;

                case 'order_status_change_test':
                    // Изменение статуса заказа в тестовом режиме
                    if ($input['status'] == 'chargeable') {
                        $order_id = intval($input['order_id']);
                        $userId = (int) $input['user_id'];

                        $user = VkUser::find($userId);
                        if ($user instanceof VkUser) {
                            $user->pay();
                        }

                        $app_order_id = $userId * 10;
                        $response['response'] = array(
                            'order_id' => $order_id,
                            'app_order_id' => $app_order_id,
                        );
                    } else {
                        $response['error'] = array(
                            'error_code' => 100,
                            'error_msg' => 'Передано непонятно что вместо chargeable.',
                            'critical' => true
                        );
                    }
                    break;
            }
        }

        return response()->json($response);
    }

}