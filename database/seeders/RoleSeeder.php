<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear roles
        $adminRole = Role::create(['name' => 'admin']);
        $devRole = Role::create(['name' => 'desarrollador']);
        $userRole = Role::create(['name' => 'usuario']);

        // Asignar todos los permisos al rol de admin
        $permissions = Permission::all();
        $adminRole->syncPermissions($permissions);
        
        // Asignar permisos específicos al rol de desarrollador
        // Estos permisos son ejemplos, ajusta según tus necesidades
        $devRole->syncPermissions(
            Permission::whereIn('name', [
                'ver panel', 'editar perfil', 'crear contenido', 
                'editar contenido', 'ver logs', 'acceso api'
            ])->get()
        );
        
        // Asignar permisos básicos al usuario normal
        $userRole->syncPermissions(
            Permission::whereIn('name', [
                'ver panel', 'editar perfil'
            ])->get()
        );
    }
}
