<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DvwaUserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('dvwa_users')->insert([
            ['username' => 'admin', 'first_name' => 'Admin', 'last_name' => 'User'],
            ['username' => 'john', 'first_name' => 'John', 'last_name' => 'Doe'],
            ['username' => 'jane', 'first_name' => 'Jane', 'last_name' => 'Smith'],
            ['username' => 'bob', 'first_name' => 'Bob', 'last_name' => 'Wilson'],
        ]);
    }
}
