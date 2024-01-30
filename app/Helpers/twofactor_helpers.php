<?php

/**
 * Generate an array of two-factor recovery codes.
 *
 * @param  int  $quantity The number of codes to generate.
 * @return array<string>
 */
function generateTwoFactorRecoveryCodes(int $quantity): array
{
    $codes = [];
    for ($i = 0; $i < $quantity; $i++) {
        $codes[] = strtoupper(bin2hex(random_bytes(8)));
    }

    return $codes;
}
