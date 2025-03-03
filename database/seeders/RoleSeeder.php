<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Asegurarse de que todos los permisos existan
        $permissions = Permission::all();

        // Crear roles
        $admin = Role::create(['name' => 'admin']);
        $instructor = Role::create(['name' => 'instructor']);
        $developer = Role::create(['name' => 'developer']);

        // Asignar todos los permisos al admin
        $admin->givePermissionTo($permissions);

        // Asignar permisos específicos al instructor
        $instructorPermissions = Permission::whereIn('name', [
            'view courses',
            'create courses',
            'edit courses',
            'delete courses',
            'view students',
            'create students',
            'edit students',
        ])->get();

        $instructor->givePermissionTo($instructorPermissions);
    }
}
