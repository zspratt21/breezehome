<?php

namespace App\Search\Engines;

use Laravel\Scout\Engines\MeilisearchEngine;
use App\Search\Clients\LocalMeilisearchClient;

class LocalMeilisearchEngine extends MeilisearchEngine
{
    /**
     * Constructs a new instance of the LocalMeilisearchEngine class.
     *
     * This constructor replaces the default Meilisearch client with one that disables SSL verification.
     * This is intended for local development only and should NOT be used in production environments.
     *
     * @param  LocalMeilisearchClient  $meilisearch The Meilisearch client to use for requests.
     * @param  bool  $updateSettings Whether to update the settings for the engine.
     */
    public function __construct(LocalMeilisearchClient $meilisearch, $updateSettings = true)
    {
        parent::__construct($meilisearch, $updateSettings);
    }

}

