<?php

namespace App\ValueObjects;

use InvalidArgumentException;

class TicketCode implements \JsonSerializable
{
    private const PREFIX = 'SIPIL';
    private const SEPARATOR = '-';
    private const RANDOM_LENGTH = 4;

    public function __construct(
        private readonly string $code
    ) {
        if (!$this->isValid()) {
            throw new InvalidArgumentException("Format kode tiket tidak valid: {$code}");
        }
    }

    public static function generate(): self
    {
        $year = date('Y');
        $random = strtoupper(substr(bin2hex(random_bytes(2)), 0, self::RANDOM_LENGTH));
        return new self(self::PREFIX . self::SEPARATOR . $year . self::SEPARATOR . $random);
    }

    public static function fromString(string $code): self
    {
        return new self(strtoupper(trim($code)));
    }

    public function isValid(): bool
    {
        $pattern = '/^' . self::PREFIX . self::SEPARATOR . '\d{4}' . self::SEPARATOR . '[A-Z0-9]{' . self::RANDOM_LENGTH . '}$/';
        return (bool) preg_match($pattern, $this->code);
    }

    public function value(): string
    {
        return $this->code;
    }

    public function year(): string
    {
        $parts = explode(self::SEPARATOR, $this->code);
        return $parts[1] ?? '';
    }

    public function jsonSerialize(): string
    {
        return $this->code;
    }

    public function __toString(): string
    {
        return $this->code;
    }
}
