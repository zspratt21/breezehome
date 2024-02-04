<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Display the user's dashboard.
     */
    public function dashboard(): Response
    {
        $user = Auth::user();
        if (count((array) json_decode($user->two_factor_recovery_codes)) < 1 && $user->two_factor_enabled) {
            $codes = generateTwoFactorRecoveryCodes(5);
            $user->two_factor_recovery_codes = json_encode($codes);
            $user->save();

            return Inertia::render('Dashboard', ['recoveryCodes' => $codes]);
        }

        return Inertia::render('Dashboard');
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $response = Redirect::route('profile.edit');
        $request->user()->fill($request->validated());
        $update = [
            'name' => $request->user()->name,
            'email' => $request->user()->email,
        ];
        if ($request->user()->isDirty('email')) {
            $update['email_verified_at'] = null;
        }
        if ((int) $request->remove_avatar == 1) {
            $request->user()->deleteAvatar();
            $update['avatar'] = null;
        } elseif ($request->hasFile('file_avatar')) {
            $request->user()->deleteAvatar();
            $upload = $request->file('file_avatar')->storePubliclyAs('users/'.Auth::user()->id.'/avatars', date('U').'_'.$request->file('file_avatar')->getClientOriginalName(), ['disk' => env('APP_DISK', 's3')]);
            $update['avatar'] = $upload ?: null;
        }
        Auth::user()->update($update);

        return $response;
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);
        $user = $request->user();
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
