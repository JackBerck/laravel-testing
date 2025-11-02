<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class XSSController extends Controller
{
    // XSS - Level Low (Vulnerable)
    public function xssLowView()
    {
        return Inertia::render('DVWA/XssLow');
    }

    public function xssLow(Request $request)
    {
        $name = $request->input('name');

        // VULNERABLE: No sanitization
        return response()->json([
            'success' => true,
            'message' => "Hello " . $name . "!",
            'raw_input' => $name,
        ]);
    }

    // XSS - Level Medium (Basic filtering)
    public function xssMediumView()
    {
        return Inertia::render('DVWA/XssMedium');
    }

    public function xssMedium(Request $request)
    {
        $name = $request->input('name');

        // MEDIUM: Basic filtering (can be bypassed)
        $name = str_replace('<script>', '', $name);

        return response()->json([
            'success' => true,
            'message' => "Hello " . $name . "!",
            'raw_input' => $name,
        ]);
    }

    // XSS - Level High (Secure)
    public function xssHighView()
    {
        return Inertia::render('DVWA/XssHigh');
    }

    public function xssHigh(Request $request)
    {
        $name = $request->input('name');

        // HIGH: Proper sanitization
        $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');

        return response()->json([
            'success' => true,
            'message' => "Hello " . $name . "!",
            'raw_input' => $name,
        ]);
    }
}
