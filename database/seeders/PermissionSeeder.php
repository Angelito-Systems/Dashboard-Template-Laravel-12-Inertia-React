<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear permisos básicos
        $permissions = [
            'ver panel',
            'editar perfil',
            'crear usuarios',
            'editar usuarios',
            'eliminar usuarios',
            'crear roles',
            'editar roles',
            'eliminar roles',
            'asignar permisos',
            'crear contenido',
            'editar contenido',
            'eliminar contenido',
            'ver logs',
            'acceso api',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
    }
}
