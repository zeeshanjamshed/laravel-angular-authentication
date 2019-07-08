<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Mailable;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'sendPasswordResetLink', 'resetPassword']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'These credentials do not match our record.', 'status' => false], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }
    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required | string',
            'email' => 'required | email | unique:users',
            'password' => 'required | confirmed',
        ]);
        $user = User::create($request->all());
        return $this->login($user);
    }

    public function sendPasswordResetLink(Request $request)
    {

        if(!$this->validateEmail($request->email))
        {
            return response()->json([
                'error' => 'Email does\'nt exists',
                'status' => false
            ], Response::HTTP_NOT_FOUND);
        }
        $token = $this->createToken($request->email);
        Mail::to($request->email)->send(new ResetPasswordMail($token));
        return response()->json([
            'data' => 'Email sent successfully.',
            'status' => true
        ], Response::HTTP_OK);
    }
    public function createToken($email)
    {
        $oldToken = DB::table('password_resets')->where('email', $email)->first();
        if($oldToken)
        {
            return $oldToken->token;
        }
        $token = str_random(60);
        DB::table('password_resets')->insert([
            'email'=> $email,
            'token'=> $token,
            'created_at'=> Carbon::now()
        ]);
        return $token;
    }

    public function validateEmail($email)
    {
        return !!User::where('email', $email)->first();
    }

    public function resetPassword(Request $request)
    {
        $this->validate($request, [
            'email' => 'required | email',
            'password' => 'required | confirmed'
        ]);
        // return $this->getPasswordResetTableRow($request)->count();
        return $this->getPasswordResetTableRow($request)->count() > 0  ? $this->changePassword($request) : $this->tokenNotFoundResponse();
    }

    private function getPasswordResetTableRow($request)
    {
        return DB::table('password_resets')->where([
            'email'=> $request->email, 
            'token'=> $request->resetToken
            ]);
    }

    private function tokenNotFoundResponse()
    {
        return response()->json([
            'error' => 'Invalid token or email.',
            'status' => false
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }
    private function changePassword($request)
    {
        $user = User::whereEmail($request->email)->first();
        $user->update(['password'=> $request->password]);
        $this->getPasswordResetTableRow($request)->delete();
        return response()->json([
            'data' => 'Password changed successfully.',
            'status' => true
        ], Response::HTTP_CREATED);

    }
}