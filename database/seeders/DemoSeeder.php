<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario admin
        $admin = User::create([
            'name' => 'Administrador',
            'email' => 'admin@ejemplo.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Crear usuario desarrollador
        $dev = User::create([
            'name' => 'Desarrollador',
            'email' => 'dev@ejemplo.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $dev->assignRole('desarrollador');

        // Crear usuario normal
        $user = User::create([
            'name' => 'Usuario',
            'email' => 'usuario@ejemplo.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $user->assignRole('usuario');
    }
}
