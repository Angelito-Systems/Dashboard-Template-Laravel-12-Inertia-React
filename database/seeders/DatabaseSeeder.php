<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->callOnce([
            PermissionSeeder::class,
            RoleSeeder::class,
            DemoSeeder::class,
        ]);
    }
}
