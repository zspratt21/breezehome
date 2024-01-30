<?php

namespace App\Search\Clients;

use GuzzleHttp\Client as GuzzleClient;
use Meilisearch\Client;
use Psr\Http\Client\ClientInterface;
use Psr\Http\Message\RequestFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;

class LocalMeilisearchClient extends Client
{
    /**
     * Constructs a new instance of the LocalMeilisearchClient class.
     *
     * This constructor replaces the default HTTP client with one that disables SSL verification.
     * This is intended for local development only and should NOT be used in production environments.
     *
     * @param  string  $url The URL of the Meilisearch instance.
     * @param  string|null  $apiKey The API key for the Meilisearch instance.
     * @param  ClientInterface|null  $httpClient The HTTP client to use for requests.
     * @param  RequestFactoryInterface|null  $requestFactory The request factory to use for creating requests.
     * @param  array  $clientAgents The client agents to use for the requests.
     * @param  StreamFactoryInterface|null  $streamFactory The stream factory to use for creating streams.
     */
    public function __construct(string $url, ?string $apiKey = null, ?ClientInterface $httpClient = null, ?RequestFactoryInterface $requestFactory = null, array $clientAgents = [], ?StreamFactoryInterface $streamFactory = null)
    {
        parent::__construct($url, $apiKey, new GuzzleClient(['verify' => false]), $requestFactory, $clientAgents, $streamFactory);
    }
}
