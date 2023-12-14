<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function getList(){

        //$data =  Categories::all();
//
        $data = [
            ["id" => "1", "name" => "cats", "description" => "About cats"],
            ["id" => "2", "name" => "dogs", "description" => "About dogs"],
        ];
       return response()->json($data);
    }
}
