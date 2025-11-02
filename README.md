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

# K6 Load Testing for Laravel Testing API

## Prerequisites
- Install k6: https://k6.io/docs/get-started/installation/
- Laravel app running on `http://localhost:8000`
- Database configured and migrated

## Available Tests

### 1. Authentication Test (`auth-test.js`)
Tests user registration and login endpoints.
```bash
k6 run k6/auth-test.js
```

### 2. Message API Test (`message-test.js`)
Tests simple GET endpoints for health check.
```bash
k6 run k6/message-test.js
```

### 3. Mahasiswa CRUD Test (`mahasiswa-test.js`)
Tests complete CRUD operations for Mahasiswa resource.
```bash
k6 run k6/mahasiswa-test.js
```

## Test Options

### Run with custom VUs and duration
```bash
k6 run --vus 100 --duration 5m k6/mahasiswa-test.js
```

### Run with stages
```bash
k6 run --stage 30s:10,1m:50,30s:0 k6/auth-test.js
```

### Output results to JSON
```bash
k6 run --out json=results.json k6/mahasiswa-test.js
```

### Output results to InfluxDB (if configured)
```bash
k6 run --out influxdb=http://localhost:8086/k6 k6/mahasiswa-test.js
```

## API Endpoints Tested

### Public Endpoints
- `GET /api/message` - Get welcome message
- `GET /api/health` - Health check
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Protected Endpoints (requires authentication)
- `GET /api/me` - Get current user
- `POST /api/logout` - Logout
- `GET /api/mahasiswa` - Get all mahasiswa
- `POST /api/mahasiswa` - Create mahasiswa
- `GET /api/mahasiswa/{id}` - Get single mahasiswa
- `PUT /api/mahasiswa/{id}` - Update mahasiswa
- `DELETE /api/mahasiswa/{id}` - Delete mahasiswa

## Thresholds

Each test has specific thresholds:
- Response time p(95) < 500ms (auth) or 1000ms (crud)
- Failed requests < 1% or 5%

## Notes
- Make sure to seed your database before running tests
- Tests will create real data in your database
- Consider using a separate testing database
- Clean up test data after load testing
