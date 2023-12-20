<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categories;
use Faker\Core\Number;
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

      \Log::info($inputs);

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

    public function getCategory($idCategory)
    {
        try {
            // Find the category by ID
            $category = Categories::findOrFail($idCategory);
            // Return the category as a JSON response
            return response()->json($category);
        } catch (\Exception $e) {
            // Handle the exception, for example, return an error response
            return response()->json(['error' => $e]);
        }
    }

    public function updateCategory($idCategory, Request $request)
    {

        // Find the category by ID
        $category = Categories::findOrFail($idCategory);

        // Check if the category exists
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        // Update category attributes
        if($request->input('name') != null)
        {
            $category->name = $request->input('name');
        }
        if($request->input('description') != null)
        {
            $category->description = $request->input('description');
        }

        //check img for existing
        $isreload = $request->input('isImageReload');

        if($isreload)
        {
            $image = $request->file("image");
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

            $category->image = $imageName;

            $category->isImageReload = false;
        }

        // Save the updated category
        $category->save();

        // Optionally, you can return a response to the client
        return response()->json(['message' => 'Category updated successfully']);
    }

    public function deleteCategory($idCategory)
    {
        $category = Categories::findOrFail($idCategory);

        // Check if the category exists
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        // Delete the category
        $category->delete();

        // Optionally, you can return a response to the client
        return response()->json(['message' => 'Category deleted successfully']);
    }
}

