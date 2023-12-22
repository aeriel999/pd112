<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categories;
use Faker\Core\Number;
use Illuminate\Http\Request;
use ValidationException;
use Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;


class CategoryController extends Controller
{
    /**
     * @OA\Get(
     *     tags={"Category"},
     *     path="/api/categories",
     *     @OA\Response(response="200", description="List Categories.")
     * )
     */
    public function getList()
    {
        $data = Categories::all();

        return response()->json($data);
    }

    /**
     * @OA\Post(
     *     tags={"Category"},
     *     path="/api/categories/add",
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"name","image","description"},
     *                 @OA\Property(
     *                     property="image",
     *                     type="file",
     *                 ),
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                      property="description",
     *                      type="string"
     *                  )
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Add Category.")
     * )
     */
    public function insertData(Request $request)
    {
        $inputs = $request->all();

        $rules = [
            'name' => 'required|string|max:255|min:3|unique:categories',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ];

        try {
            $validator = Validator::make($request->all(), $rules);
            $validator->validate();
        } catch (ValidationException $e) {
            $errorMessages = $e->validator->getMessageBag()->toArray();

            return response()->json(['error' => $errorMessages], 422);
        }

        $image = $request->file("image");

        //\Log::info($inputs);

        $imageName = uniqid() . ".webp";
        $sizes = [50, 150, 300, 600, 1200];
        $manager = new ImageManager(new Driver());

        foreach ($sizes as $size) {
            $fileSave = $size . "_" . $imageName;
            // read image from file system
            $imageRead = $manager->read($image);
            // resize image proportionally to 300px width
            $imageRead->scale(width: $size);
            // save modified image in new format
            $path = public_path('upload/' . $fileSave);
            $imageRead->toWebp()->save($path);
        }

        $inputs["image"] = $imageName;

        try {
            Categories::create($inputs);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Data inserted successfully'], 200);
    }

    /**
     * @OA\Get(
     *     tags={"Category"},
     *     path="/api/categories/get/{id}",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Ідентифікатор категорії",
     *         required=true,
     *         @OA\Schema(
     *             type="number",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(response="200", description="List Categories."),
     * @OA\Response(
     *    response=404,
     *    description="Wrong id",
     *    @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Sorry, wrong Category Id has been sent. Pls try another one.")
     *        )
     *     )
     * )
     */
    public function getCategory($idCategory)
    {
        try {
            $category = Categories::findOrFail($idCategory);

            return response()->json($category);
        } catch (\Exception $e) {
            return response()->json(['error' => $e]);
        }
    }

    /**
     * @OA\Post(
     *     tags={"Category"},
     *     path="/api/categories/update/{id}",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Id of Category",
     *         required=true,
     *         @OA\Schema(
     *             type="number",
     *             format="int64"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *
     *                 @OA\Property(
     *                     property="image",
     *                     type="file"
     *                 ),
     *               @OA\Property(
     *                      property="description",
     *                      type="strinfig"
     *                  ),
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Add Category.")
     * )
     */
    public function updateCategory($idCategory, Request $request)
    {
        $category = Categories::findOrFail($idCategory);

        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $rules = [
            'name' => 'string|max:255|min:3|unique:categories',
            'description' => 'string',
            'image' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ];

        try {
            $validator = Validator::make($request->all(), $rules);
            $validator->validate();
        } catch (ValidationException $e) {
            $errorMessages = $e->validator->getMessageBag()->toArray();

            return response()->json(['error' => $errorMessages], 422);
        }

        if ($request->input('name') != null) {
            $category->name = $request->input('name');
        }

        if ($request->input('description') != null) {
            $category->description = $request->input('description');
        }

        if ($request->input('image') != null) {
            $oldImageName = $category->image;

            $image = $request->file("image");
            $imageName = uniqid() . ".webp";
            $sizes = [50, 150, 300, 600, 1200];
            $manager = new ImageManager(new Driver());

            foreach ($sizes as $size) {
                $fileSave = $size . "_" . $imageName;
                $imageRead = $manager->read($image);
                $imageRead->scale(width: $size);
                $path = public_path('upload/' . $fileSave);
                $imageRead->toWebp()->save($path);

                $oldImagePath = public_path('upload/' . $size . '_' . $oldImageName);

                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $category->image = $imageName;

            $category->isImageReload = false;
        }

        $category->save();

        return response()->json(['message' => 'Category updated successfully'], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/categories/delete/{id}",
     *     tags={"Category"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Id of Category",
     *         required=true,
     *         @OA\Schema(
     *             type="number",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Not authorized"
     *     )
     * )
     */
    public function deleteCategory($idCategory)
    {
        $category = Categories::findOrFail($idCategory);

        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $ImageName = $category->image;
        $sizes = [50, 150, 300, 600, 1200];
        foreach ($sizes as $size) {
            $imagePath = public_path('upload/' . $size . '_' . $ImageName);

            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully'], 200);
    }
}

