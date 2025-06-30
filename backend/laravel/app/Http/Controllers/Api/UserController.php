<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            [
                'id' => 1,
                'name' => 'Ibrat',
                'age' => 25,
                'mail' => 'ibrat@gmail.com',
            ],
            [
                'id' => 2,
                'name' => 'Shaxzod',
                'age' => 26,
                'mail' => 'shaxzod@gmail.com',
            ],
            [
                'id' => 3,
                'name' => 'Ismail',
                'age' => 20,
                'mail' => 'ismail@gmail.com',
            ],
            [
                'id' => 4,
                'name' => 'Neel',
                'age' => 21,
                'mail' => 'neel@gmail.com',
            ]
        ]);
    }
}
