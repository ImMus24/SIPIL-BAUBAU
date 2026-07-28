<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Contracts\ComplaintRepositoryInterface;
use App\Repositories\ComplaintRepository;
use App\Contracts\UserRepositoryInterface;
use App\Repositories\UserRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ComplaintRepositoryInterface::class, ComplaintRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
