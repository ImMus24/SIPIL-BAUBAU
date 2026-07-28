<?php

namespace App\Providers;

use App\Actions\CreateComplaintAction;
use App\Actions\RegisterUserAction;
use App\Actions\LogoutUserAction;
use App\Actions\UpdateComplaintStatusAction;
use App\Contracts\ComplaintRepositoryInterface;
use App\Contracts\UserRepositoryInterface;
use App\Models\Complaint;
use App\Observers\ComplaintObserver;
use App\Repositories\ComplaintRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /** Register any application services. */
    public function register(): void
    {
        // Repositories
        $this->app->bind(ComplaintRepositoryInterface::class, ComplaintRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);

        // Actions
        $this->app->bind(CreateComplaintAction::class, function ($app) {
            return new CreateComplaintAction($app->make(ComplaintRepositoryInterface::class));
        });
        $this->app->bind(UpdateComplaintStatusAction::class, function ($app) {
            return new UpdateComplaintStatusAction($app->make(ComplaintRepositoryInterface::class));
        });
        $this->app->bind(RegisterUserAction::class, function ($app) {
            return new RegisterUserAction($app->make(UserRepositoryInterface::class));
        });
        $this->app->bind(LogoutUserAction::class, function () {
            return new LogoutUserAction();
        });
    }

    /** Bootstrap any application services. */
    public function boot(): void
    {
        Complaint::observe(ComplaintObserver::class);
    }
}
