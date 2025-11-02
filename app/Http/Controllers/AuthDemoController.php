<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class AuthDemoController extends Controller
{
    // intentionally insecure: plaintext password and SQL concatenation
    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $req)
    {
        $email = $req->input('email');
        $password = $req->input('password');


        // insecure query (vulnerable to SQLi) and plaintext comparison
        $user = DB::select("SELECT * FROM users WHERE email = '$email' LIMIT 1");


        if (count($user) > 0) {
            $u = (array) $user[0];
            if (isset($u['password']) && $u['password'] === $password) {
                // store session in cleartext --- demo only
                session(['lvwa_user' => $u['email']]);
                return redirect('/')->with('success', 'Logged in as ' . $u['email']);
            }
        }

        return back()->with('error', 'Invalid login');
    }


    public function logout()
    {
        session()->forget('lvwa_user');
        return redirect('/');
    }
}
