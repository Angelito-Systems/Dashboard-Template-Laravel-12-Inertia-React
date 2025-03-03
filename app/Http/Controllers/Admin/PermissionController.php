<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Permissions/Index', [
            'permissions' => Permission::all(),
            'routes' => collect(Route::getRoutes()->getRoutesByName())
                ->keys()
                ->filter(fn($route) => str_starts_with($route, 'admin.'))
                ->values()
        ]);
    }

    public function generate()
    {
        $routes = Route::getRoutes()->getRoutesByName();
        
        foreach ($routes as $name => $route) {
            if (str_starts_with($name, 'admin.')) {
                Permission::firstOrCreate(['name' => $name]);
            }
        }

        return redirect()->back();
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();
        return redirect()->back();
    }
}
