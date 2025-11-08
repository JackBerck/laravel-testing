<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'Welcome to Laravel Testing API',
            'data' => [
                'app_name' => config('app.name'),
                'environment' => config('app.env'),
                'timestamp' => now()->toIso8601String(),
            ],
        ]);
    }

    public function health()
    {
        return response()->json([
            'success' => true,
            'status' => 'healthy',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
