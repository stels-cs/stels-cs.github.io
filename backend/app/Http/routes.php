<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::resource('/api/v1/me', 'Api\V1\MeController', [
    'middleware' => ['web', 'api']
]);

Route::resource('/api/v1/like', 'Api\V1\LikeController', [
    'middleware' => ['web', 'api']
]);

Route::resource('/api/v1/skip', 'Api\V1\SkipController', [
    'middleware' => ['web', 'api']
]);


Route::any('/vk-callback', 'VkCallback@index');

Route::any('/api/v1/vk-payment', 'Api\V1\VkPayment@index');

Route::get('/', function () {
    return view('welcome');
});


