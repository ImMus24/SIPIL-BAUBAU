<?php

namespace App\ValueObjects;

use App\Models\Complaint;
use InvalidArgumentException;

class TicketCode implements \JsonSerializable
{
    private const PREFIX = 'SPL';
    private const SEPARATOR = '-';
    private const SEQUENCE_LENGTH = 6;

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
        $last = Complaint::whereYear('created_at', $year)
            ->where('ticket_code', 'like', self::PREFIX . self::SEPARATOR . $year . self::SEPARATOR . '%')
            ->orderBy('id', 'desc')
            ->first();

        $sequence = 1;
        if ($last) {
            $parts = explode(self::SEPARATOR, $last->ticket_code);
            $lastSeq = isset($parts[2]) ? (int) $parts[2] : 0;
            $sequence = $lastSeq + 1;
        }

        $code = sprintf(
            '%s%s%s%s%0' . self::SEQUENCE_LENGTH . 'd',
            self::PREFIX,
            self::SEPARATOR,
            $year,
            self::SEPARATOR,
            $sequence
        );

        return new self($code);
    }

    public static function fromString(string $code): self
    {
        return new self(strtoupper(trim($code)));
    }

    public function isValid(): bool
    {
        $pattern = '/^' . self::PREFIX . self::SEPARATOR . '\d{4}' . self::SEPARATOR . '\d{' . self::SEQUENCE_LENGTH . '}$/';
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

    public function sequenceNumber(): string
    {
        $parts = explode(self::SEPARATOR, $this->code);
        return $parts[2] ?? '0';
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
