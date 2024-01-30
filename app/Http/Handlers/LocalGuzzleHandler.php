<?php

namespace App\Http\Handlers;
use GuzzleHttp\Client;
use Aws\Handler\GuzzleV6\GuzzleHandler as BaseAwsGuzzleHandler;

class LocalGuzzleHandler extends BaseAwsGuzzleHandler
{
    /**
     * Local GuzzleHandler class.
     *
     * This handler class is meant for local development only do not EVER user this in production!!!
     */
    public function __construct()
    {
        parent::__construct(new Client(
            ['verify' => false]
        ));
    }
}
