<?php

namespace App\ValueObjects;

use InvalidArgumentException;

class Coordinate implements \JsonSerializable
{
    private const LAT_MIN = -90.0;
    private const LAT_MAX = 90.0;
    private const LNG_MIN = -180.0;
    private const LNG_MAX = 180.0;

    private const BAUBAU_DEFAULT_LAT = -5.4642000;
    private const BAUBAU_DEFAULT_LNG = 122.6035000;

    public function __construct(
        private readonly ?float $latitude,
        private readonly ?float $longitude,
    ) {
        if ($this->latitude !== null) {
            $this->validateLatitude();
        }
        if ($this->longitude !== null) {
            $this->validateLongitude();
        }
    }

    private function validateLatitude(): void
    {
        if ($this->latitude < self::LAT_MIN || $this->latitude > self::LAT_MAX) {
            throw new InvalidArgumentException(
                "Latitude harus antara " . self::LAT_MIN . " dan " . self::LAT_MAX . "."
            );
        }
    }

    private function validateLongitude(): void
    {
        if ($this->longitude < self::LNG_MIN || $this->longitude > self::LNG_MAX) {
            throw new InvalidArgumentException(
                "Longitude harus antara " . self::LNG_MIN . " dan " . self::LNG_MAX . "."
            );
        }
    }

    public static function from(?float $latitude, ?float $longitude): self
    {
        return new self($latitude, $longitude);
    }

    public static function baubauDefault(): self
    {
        return new self(self::BAUBAU_DEFAULT_LAT, self::BAUBAU_DEFAULT_LNG);
    }

    public function hasValid(): bool
    {
        return $this->latitude !== null && $this->longitude !== null;
    }

    public function latitude(): ?float
    {
        return $this->latitude;
    }

    public function longitude(): ?float
    {
        return $this->longitude;
    }

    public function toArray(): array
    {
        return [
            'latitude' => $this->hasValid() ? $this->latitude : null,
            'longitude' => $this->hasValid() ? $this->longitude : null,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
