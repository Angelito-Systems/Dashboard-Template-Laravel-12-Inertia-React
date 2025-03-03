<?php

namespace App\Services;

use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function getAvailablePermissions(): array
    {
        $routeCollection = Route::getRoutes();
        $permissions = [];

        foreach ($routeCollection as $route) {
            if (str_starts_with($route->getName(), 'admin.')) {
                $name = str_replace('admin.', '', $route->getName());
                $group = explode('.', $name)[0];
                
                // Convertir route name a permiso
                $permission = $this->routeToPermission($route);
                
                if (!isset($permissions[$group])) {
                    $permissions[$group] = [];
                }
                
                $permissions[$group][] = $permission;
            }
        }

        return $permissions;
    }

    private function routeToPermission($route): array
    {
        $name = $route->getName();
        $action = explode('.', str_replace('admin.', '', $name));
        $group = $action[0];
        $action = count($action) > 1 ? $action[1] : 'view';

        // Mapear acciones de rutas a permisos
        $actionMap = [
            'index' => 'view',
            'show' => 'view',
            'create' => 'create',
            'store' => 'create',
            'edit' => 'edit',
            'update' => 'edit',
            'destroy' => 'delete'
        ];

        $action = $actionMap[$action] ?? $action;
        $permissionName = "{$action} {$group}";

        return [
            'name' => $permissionName,
            'route' => $name,
            'method' => $route->methods()[0],
            'group' => $group
        ];
    }

    public function syncPermissions(): void
    {
        $availablePermissions = $this->getAvailablePermissions();
        
        foreach ($availablePermissions as $group => $permissions) {
            foreach ($permissions as $permission) {
                Permission::findOrCreate($permission['name']);
            }
        }
    }
}
