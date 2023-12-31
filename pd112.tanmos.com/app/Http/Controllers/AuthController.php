<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Validator;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    /**
     * @OA\Post(
     *   path="/api/login",
     *   tags={"Auth"},
     *   summary="Login",
     *   operationId="login",
     *   @OA\RequestBody(
     *     required=true,
     *     description="User login data",
     *     @OA\MediaType(
     *       mediaType="application/json",
     *       @OA\Schema(
     *         required={"email", "password"},
     *         @OA\Property(property="email", type="string"),
     *         @OA\Property(property="password", type="string"),
     *       )
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Success",
     *     @OA\MediaType(
     *       mediaType="application/json"
     *     )
     *   ),
     *   @OA\Response(
     *     response=401,
     *     description="Unauthenticated"
     *   ),
     *   @OA\Response(
     *     response=400,
     *     description="Bad Request"
     *   ),
     *   @OA\Response(
     *     response=404,
     *     description="Not Found"
     *   ),
     *   @OA\Response(
     *     response=403,
     *     description="Forbidden"
     *   )
     * )
     */
    public function login(Request $request)
    {
        $validation = Validator::make($request->all(), [
            "email" => "required|email",
            "password" => "required|string|min:4",

        ], [
            'email.required' => 'Email is required.',
            'email.email' => 'Email is not valid.',
            'password.required' => 'The password cannot be empty.',
            'password.min' => 'The length of the password must be at least 6 characters.',
        ]);

        if($validation->fails()) {
            return response()->json($validation->errors(), Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        if(!$token = auth()->attempt($validation->validated())) {
            return response()->json(['error'=>'The data is incorrect!'], Response::HTTP_UNAUTHORIZED);
        }
        return response()->json(['token'=>$token], Response::HTTP_OK);
    }

    /**
     * @OA\Post(
     *     tags={"Auth"},
     *     path="/api/register",
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={"email", "lastName", "name", "phone", "image", "password", "password_confirmation"},
     *                 @OA\Property(
     *                     property="image",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="email",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="lastName",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="phone",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="password",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="password_confirmation",
     *                     type="string"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Add Category.")
     * )
     * @throws \ImagickException
     */
    public function register(Request $request) {

        $inputs = $request->all();

        $rules = [
            "email" => "required|email",
            "password" => "required|string|min:6",
            "lastName" => "string|min:3|max:256",
            "name" => "string|min:3|max:256",
            "phone"=>"string",
            "image" =>"string"
        ];

        try {
            $validator = Validator::make($request->all(), $rules);
            $validator->validate();
        } catch (ValidationException $e) {
            $errorMessages = $e->validator->getMessageBag()->toArray();

            return response()->json(['error' => $errorMessages], 422);
        }

        $base64Image = $request->input('image');

        // Remove the "data:image/png;base64," prefix from the base64 string
        $base64Image = preg_replace('/^data:image\/(png|jpeg|jpg);base64,/', '', $base64Image);

        // Decode the base64 string
        $imageData = base64_decode($base64Image);

        $imageName = uniqid().".webp";
        $sizes = [150,300,600];
        // create image manager with desired driver
        $driver = new  Driver();
        $manager = new ImageManager($driver);
        foreach ($sizes as $size) {
            $fileSave = $size."_".$imageName;
            $image = $manager->read($imageData);
            //$imageRead = Image::make($imageData);
            $image->scale(width: $size);
            $path=public_path('upload/'.$fileSave);
            $image->toWebp()->save($path);
        }

        $inputs["image"] = $imageName;

        try {
            User::create($inputs);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Data inserted successfully'], Response::HTTP_OK);

    }
}
