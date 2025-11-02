# LVWA (Laravel Vulnerable Web Application) - Demo

This single-file package contains a compact educational LVWA skeleton you can paste into a fresh Laravel project for learning purposes.

**Warning: This project is intentionally vulnerable. Run only in isolated/local environment (localhost, Docker, VM). DO NOT expose to public networks.**

---

## What this document contains

- README (quick run instructions)
- routes/web.php
- app/Http/Controllers/AuthDemoController.php
- app/Http/Controllers/SQLiController.php
- app/Http/Controllers/XSSController.php
- app/Http/Controllers/UploadController.php
- database/migrations/2025_01_01_000000_create_users_table.php
- database/seeders/UserSeeder.php
- resources/views/layouts/app.blade.php
- resources/views/home.blade.php
- resources/views/auth/login.blade.php
- resources/views/sqli/index.blade.php
- resources/views/xss/index.blade.php
- resources/views/upload/index.blade.php

---

# README

1. Create fresh Laravel project (Laravel 10+ recommended):

   ```bash
   composer create-project laravel/laravel lvwa-demo
   cd lvwa-demo
   ```

2. Copy code from this document into the corresponding files in the project.
3. Set your `.env` to use a local DB (sqlite recommended for simplicity):

   ```bash
   touch database/database.sqlite
   # in .env set DB_CONNECTION=sqlite and comment DB_* other vars
   ```

4. Run migrations and seeders:

   ```bash
   php artisan migrate
   php artisan db:seed --class=UserSeeder
   ```

5. Start server:

   ```bash
   php artisan serve
   ```

6. Open http://127.0.0.1:8000

---

# Quick teaching notes

- Use this demo to show *how an app becomes vulnerable* when security best practices are bypassed.
- After demonstrating an exploit, show the secure alternative:
  - Use parameter binding or Eloquent for SQL queries.
  - Escape output (`{{ }}`) instead of raw output (`{!! !!}`) for XSS.
  - Validate file uploads by checki
