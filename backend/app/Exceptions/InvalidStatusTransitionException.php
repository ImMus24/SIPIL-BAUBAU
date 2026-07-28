<?php

namespace App\Exceptions;

use Symfony\Component\HttpFoundation\Response;

class InvalidStatusTransitionException extends BaseException
{
    public function __construct(string $from = '', string $to = '')
    {
        $message = $from && $to
            ? "Transisi status dari '{$from}' ke '{$to}' tidak diperbolehkan."
            : 'Transisi status yang diminta tidak diperbolehkan.';
        parent::__construct($message, $message, Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
