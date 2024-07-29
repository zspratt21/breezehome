<?php

use App\Models\User;
use chillerlan\QRCode\QRCode;
use Illuminate\Support\Facades\Redis;
use PragmaRX\Google2FA\Google2FA;

function setup2fa(): void
{
    $google2fa = new Google2FA();
    test()->user->two_factor_secret = $google2fa->generateSecretKey();
    test()->user->save();
}

function enable2fa(): void
{
    setup2fa();
    test()->user->two_factor_enabled = 1;
    test()->user->two_factor_recovery_codes = json_encode(['123456']);
    test()->user->save();
}

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('2fa check page can be rendered', function () {
    enable2fa();
    $response = $this->post(route('login'), [
        'email' => $this->user->email,
        'password' => 'password',
    ]);
    $response->assertStatus(302);
    $response->assertRedirect(route('2fa.check'));
});

test('users can log in with correct otp', function () {
    Redis::shouldReceive('get')->andReturn($this->user->email);
    enable2fa();
    $google2fa = new Google2FA();
    $response = $this->post(route('2fa.check'), [
        'code' => $google2fa->getCurrentOtp($this->user->two_factor_secret),
    ]);
    $response->assertStatus(302);
    $response->assertRedirect(route('dashboard'));
});

test('users cannot log in with invalid otp', function () {
    Redis::shouldReceive('get')->andReturn($this->user->email);
    enable2fa();
    $response = $this->post(route('2fa.check'), [
        'code' => '123456',
    ]);
    $response->assertStatus(302);
    $response->assertRedirect(route('2fa.check'));
});

test('users can log in with valid recovery code', function () {
    Redis::shouldReceive('get')->andReturn($this->user->email);
    enable2fa();
    $response = $this->post(route('2fa.check'), [
        'code' => 123456,
        'isRecovery' => true,
    ]);
    $response->assertStatus(302);
    $response->assertRedirect(route('dashboard'));
});

test('users cannot log in with invalid recovery code', function () {
    Redis::shouldReceive('get')->andReturn($this->user->email);
    enable2fa();
    $response = $this->post(route('2fa.check'), [
        'code' => 123457,
        'isRecovery' => true,
    ]);
    $response->assertStatus(302);
    $response->assertRedirect(route('2fa.check'));
});

test('2fa check redirects to log in if there is no session token', function () {
    $this->get(route('2fa.check'))->assertRedirect(route('login'));
});

test('enable callback provides valid qr code and secret', function () {
    $response = $this->actingAs($this->user)->post(route('2fa.enable'));
    $response->assertStatus(200);
    $response->assertJsonStructure([
        'qr_png' => [],
    ]);
    $qr_png_data = $response->json('qr_png');
    $qr_image = base64_decode(str_replace('data:image/png;base64,', '', $qr_png_data));
    $qr_code = (new QRCode())->readFromBlob($qr_image);
    $url_components = parse_url((string) $qr_code);
    $query_string = $url_components['query'] ?? '';
    parse_str($query_string, $params);
    expect($params['issuer'])->toBe(config('app.name'))
        ->and($params['algorithm'])->toBe('SHA1')
        ->and((int) $params['digits'])->toBe(6)
        ->and((int) $params['period'])->toBe(30);
    $secret = $params['secret'] ?? null;
    expect($secret)->not->toBeNull()
        ->and($secret)->toBe($this->user->two_factor_secret);
    $google2fa = new Google2FA();
    $otp = $google2fa->getCurrentOtp($secret);
    expect($otp)->not->toBeNull();
});

test('users can enable 2fa', function () {
    setup2fa();
    $google2fa = new Google2FA();
    $otp = $google2fa->getCurrentOtp($this->user->two_factor_secret);
    $response = $this->actingas($this->user)->post(route('2fa.enable.check'), [
        'code' => $otp,
    ]);
    $response->assertStatus(200);
    $response->assertJsonStructure([
        'recovery_codes' => [],
    ]);
    $this->user->refresh();
    expect($this->user->two_factor_enabled)->toBe(1);
});

test('users cannot enable 2fa with invalid otp', function () {
    setup2fa();
    $response = $this->actingas($this->user)->post(route('2fa.enable.check'), [
        'code' => '123456',
    ]);
    $response->assertStatus(200);
    $response->assertJsonFragment([
        'valid' => 0,
    ]);
    $this->user->refresh();
    expect($this->user->two_factor_enabled)->toBe(0);
});

test('users can disable 2fa', function () {
    enable2fa();
    $google2fa = new Google2FA();
    $otp = $google2fa->getCurrentOtp($this->user->two_factor_secret);
    $response = $this->actingas($this->user)->post(route('2fa.disable'), [
        'code' => $otp,
    ]);
    $response->assertStatus(200);
    $response->assertJsonFragment([
        'disabled_2fa' => 1,
    ]);
    $this->user->refresh();
    expect($this->user->two_factor_enabled)->toBe(0);
});

test('users cannot disable 2fa with invalid otp', function () {
    enable2fa();
    $response = $this->actingas($this->user)->post(route('2fa.disable'), [
        'code' => '123456',
    ]);
    $response->assertStatus(200);
    $response->assertJsonFragment([
        'disabled_2fa' => 0,
    ]);
    $this->user->refresh();
    expect($this->user->two_factor_enabled)->toBe(1);
});
