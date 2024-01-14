<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Categories;
use App\Models\Product;
use App\Models\ProductImage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Validator;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * @OA\Get(
     *     tags={"Product"},
     *     path="/api/products",
     *     @OA\Response(response="200", description="List Products.")
     * )
     */
    public function getList() {

      $data = Product::with('category')->get();
        return response()->json($data)
            ->header('Content-Type', 'application/json; charset=utf-8');
    }

    /**
     * @OA\Post(
     *      tags={"Product"},
     *      path="/api/products/add",
     *      @OA\RequestBody(
     *          required=true,
     *          description="Product information",
     *          @OA\MediaType(
     *              mediaType="application/json",
     *              @OA\Schema(
     *                  @OA\Property(property="name", type="string"),
     *                  @OA\Property(property="description", type="string"),
     *                  @OA\Property(property="price", type="number"),
     *                  @OA\Property(property="quantity", type="number"),
     *                  @OA\Property(property="category_id", type="integer"),
      *                @OA\Property(
     *                       property="images",
     *                       type="array",
     *                       @OA\Items(type="string")
     *                   ),
     *              )
     *          )
     *      ),
     *      @OA\Response(response="201", description="Product created successfully."),
     *      @OA\Response(response="422", description="Validation error or invalid input.")
     *  )
 */
    public function createProduct(Request $request) {
        // Validate input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'quantity' => 'required|numeric',
            'images' => 'required|array',
            'category_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Create a new product
        $product = Product::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'price' => $request->input('price'),
            'quantity' => $request->input('quantity'),
            'category_id' => $request->input('category_id'),

        ]);

        if ($request->input('images') != null) {
            $images = $request->input('images');

            foreach ($images as $image){
                $imageName = uniqid() . ".webp";
                $sizes = [150, 300, 600, 1200];
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
                // Create product image record
                $productImage = new ProductImage([
                    'name' => $imageName,
                    'product_id' => $product->id,
                ]);

                $productImage->save();
            }

        }
        return response()->json($product, 201);
    }
}
