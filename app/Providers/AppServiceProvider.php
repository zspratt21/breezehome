<?php

namespace App\Providers;

use App\Search\Clients\LocalMeilisearchClient;
use App\Search\Engines\LocalMeilisearchEngine;
use Illuminate\Support\ServiceProvider;
use Laravel\Scout\EngineManager;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        resolve(EngineManager::class)->extend('local_meilisearch', function () {
            return new LocalMeilisearchEngine(new LocalMeilisearchClient(
                config('scout.meilisearch.host'),
                config('scout.meilisearch.key')
            ));
        });
    }
}
