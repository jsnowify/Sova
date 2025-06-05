<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admins can view all users.'], 403);
        }

        $users = User::select('id', 'name', 'email', 'role', 'created_at')->get();

        return response()->json($users);
    }
}
