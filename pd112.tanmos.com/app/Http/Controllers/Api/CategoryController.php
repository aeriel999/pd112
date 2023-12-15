<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categories;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function getList(){
        $data =  Categories::all();

       return response()->json($data);
    }

    public function insertData(Request $request)
    {
        try {
            Categories::create($request->all());

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Data inserted successfully']);
    }
}
