<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\LoginLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /** POST /api/register */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'gender'   => 'required|in:Male,Female',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // ✅ CREATE TOKEN
        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ LOG LOGIN
        LoginLog::create([
            'user_id'    => $user->id,
            'action'     => 'login',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'user'  => $user,
            'token' => $token   // ✅ SEND TOKEN
        ], 201);
    }

    /** POST /api/login */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // ✅ CREATE TOKEN
        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ LOG LOGIN
        LoginLog::create([
            'user_id'    => $user->id,
            'action'     => 'login',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'user'  => $user,
            'token' => $token   // ✅ SEND TOKEN
        ]);
    }
    
    /** POST /api/google-login */
    public function googleLogin(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email',
        ]);

        // Find existing user or create a new one
        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            $user = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => Hash::make(bin2hex(random_bytes(10))), // Random secure password
                'gender'   => null, // Optional for Google users
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ LOG LOGIN
        LoginLog::create([
            'user_id'    => $user->id,
            'action'     => 'login',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'user'  => $user,
            'token' => $token
        ]);
    }

    /** POST /api/logout */
    public function logout(Request $request)
    {
        // ✅ LOG LOGOUT
        if ($request->user()) {
            LoginLog::create([
                'user_id'    => $request->user()->id,
                'action'     => 'logout',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
            $request->user()->currentAccessToken()->delete();
        }
        return response()->json(['message' => 'Logged out successfully.']);
    }
}