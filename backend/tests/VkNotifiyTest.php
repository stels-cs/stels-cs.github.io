<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class VkNotifiyTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testNotify()
    {
        $job = new \App\Jobs\SendNoticeIfLike(0,0);
        $data = $job->noticeTo(19039187);
        $this->assertTrue( !empty($data) && !isset($data['error']) );
    }
}
