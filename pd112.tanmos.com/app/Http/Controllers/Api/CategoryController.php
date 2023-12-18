<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categories;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class CategoryController extends Controller
{
    public function getList(){
        $data =  Categories::all();

       return response()->json($data);
    }

    public  function insertData(Request $request)
    {
        $inputs = $request->all();
        $image = $request->file("image");

     //  \Log::info($inputs);

        $imageName = uniqid().".webp";
        $sizes = [50,150,300,600,1200];
        // create image manager with desired driver
        $manager = new ImageManager(new Driver());

        foreach ($sizes as $size) {
            $fileSave = $size."_".$imageName;
            // read image from file system
            $imageRead = $manager->read($image);
            // resize image proportionally to 300px width
            $imageRead->scale(width: $size);
            // save modified image in new format
            $path=public_path('upload/'.$fileSave);
            $imageRead->toWebp()->save($path);
        }
        $inputs["image"] = $imageName;
        try {
            Categories::create($inputs);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Data inserted successfully']);
    }
}
