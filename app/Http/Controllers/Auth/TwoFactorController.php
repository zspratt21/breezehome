<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use chillerlan\QRCode\Common\Version;
use chillerlan\QRCode\Data\QRMatrix;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Inertia\Inertia;
use Inertia\Response;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    /**
     * Get the hash of the current two-factor token.
     */
    public function getTokenHash(): ?string
    {
        if (session('two_factor_token_created_at') && session('two_factor_token')) {
            $token = session('two_factor_token');
            $created_at = session('two_factor_token_created_at');
            $hash = hash('sha512', "{$created_at}_{$token}");
            return "2fa_token_{$hash}";
        }

        return null;
    }

    /**
     * Process a successful two-factor authentication attempt.
     *
     * @param  User  $user  The user that successfully authenticated.
     */
    public function process2faSuccess(User $user): void
    {
        Auth::login($user);
        Redis::del($this->getTokenHash());
        session()->forget(['two_factor_token', 'two_factor_token_created_at']);
        session()->regenerate();
    }

    /**
     * Show the two-factor authentication setup page.
     */
    public function show(): Response|RedirectResponse
    {
        $session_token = Redis::get($this->getTokenHash());
        if ($session_token) {
            return Inertia::render('Auth/EnterOnetimePasscode');
        }

        return redirect()->route('login');
    }

    /**
     * Handle a two-factor authentication check.
     */
    public function check(): RedirectResponse
    {
        $session_token = Redis::get($this->getTokenHash());
        if ($session_token) {
            $user = User::where('email', $session_token)->first();
            if ($user->exists()) {
                if (request()->input('isRecovery')) {
                    $codes = json_decode($user->two_factor_recovery_codes);
                    if (in_array(request()->input('code'), $codes)) {
                        $codes = array_values(array_diff($codes, [request()->input('code')]));
                        $user->two_factor_recovery_codes = json_encode($codes);
                        $user->save();
                        $this->process2faSuccess($user);

                        return redirect()->intended(RouteServiceProvider::HOME);
                    }
                } else {
                    if ($this->validateAttempt($user->two_factor_secret, request()->input('code'))) {
                        $this->process2faSuccess($user);

                        return redirect()->intended(RouteServiceProvider::HOME);
                    }
                }
            }

            return redirect()->route('2fa.check')->withErrors(['code' => 'Invalid code']);
        }

        return redirect()->route('login');
    }

    /**
     * Validate a two-factor authentication attempt.
     *
     * @param  string  $two_factor_secret  The user's two-factor secret.
     * @param  string  $code  The two-factor code to validate.
     */
    public function validateAttempt(string $two_factor_secret, string $code): bool
    {
        $google2fa = new Google2FA();

        return $google2fa->verifyKey($two_factor_secret, $code);
    }

    /**
     * Enable two-factor authentication on the user's account.
     */
    public function enableCheck(): JsonResponse
    {
        $user = Auth::user();
        $code = request()->input('code');
        $valid = $this->validateAttempt($user->two_factor_secret, $code);
        $data = [
            'valid' => (int) $valid,
        ];
        if ($valid) {
            $recovery_codes = generateTwoFactorRecoveryCodes(5);
            $data['recovery_codes'] = $recovery_codes;
            $user->two_factor_recovery_codes = json_encode($recovery_codes);
            $user->two_factor_enabled = 1;
            $user->save();
        }

        return response()->json($data);
    }

    /**
     * Generate and display a QR code for setting up two-factor authentication.
     */
    public function enable(): JsonResponse
    {
        $user = Auth::user();
        $google2fa = new Google2FA();
        $secret_key = $google2fa->generateSecretKey(32);
        $otpAuthUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret_key
        );
        $user->two_factor_secret = $secret_key;
        $user->save();
        $options = new QROptions([
            'version' => Version::AUTO,
            'outputType' => 'png',
            'imageTransparent' => true,
            'quietzoneSize' => 0,
            'scale' => 8,
            'drawCircularModules' => true,
            'drawCircleRadius' => 0.45,
            'keepAsSquare' => [
                QRMatrix::M_FINDER_DOT,
            ],
            'logoSpaceHeight' => 14,
        ]);
        $qrcode = new QRCode($options);
        $qrCodePngData = $qrcode->render($otpAuthUrl);

        return response()->json([
            'qr_png' => $qrCodePngData,
        ]);
    }

    /**
     * Disable two-factor authentication on the user's account.
     */
    public function disable(): JsonResponse
    {
        $user = Auth::user();
        $code = request()->input('code');
        $valid = $this->validateAttempt($user->two_factor_secret, $code);
        if ($valid) {
            $user->two_factor_enabled = 0;
            $user->two_factor_secret = null;
            $user->two_factor_recovery_codes = null;

            return response()->json([
                'disabled_2fa' => (int) $user->save(),
            ]);
        }

        return response()->json([
            'disabled_2fa' => 0,
        ]);
    }
}
