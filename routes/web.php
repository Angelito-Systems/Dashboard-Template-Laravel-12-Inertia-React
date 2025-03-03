<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RolePermissionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        
        Route::get('/', function () {
            return redirect()->route('admin.dashboard');
        })->name('home');
        
        Route::middleware(['auth', 'verified'])->group(function () {

            Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {

                // Dashboard Route
                Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

                // Users Routes
                Route::get('users', [UserController::class, 'index'])->name('users.index');
                Route::post('users', [UserController::class, 'store'])->name('users.store');
                Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
                Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
                Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit'); // Mantener para cargar datos

                // Roles Routes
                Route::resource('roles', RoleController::class);

                // Role Permissions Routes
                Route::get('roles/{role}/permissions', [RolePermissionController::class, 'edit'])->name('roles.permissions.edit');
                Route::put('roles/{role}/permissions', [RolePermissionController::class, 'update'])->name('roles.permissions.update');

                // Permissions Routes
                Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index');
                Route::post('permissions/generate', [PermissionController::class, 'generate'])->name('permissions.generate');
                Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
            });
        });
    });
}



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/tenant.php';