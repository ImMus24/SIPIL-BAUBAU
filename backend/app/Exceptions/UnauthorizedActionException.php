<?php

namespace App\Exceptions;

use Symfony\Component\HttpFoundation\Response;

class UnauthorizedActionException extends BaseException
{
    public function __construct(string $action = '')
    {
        $message = $action
            ? "Anda tidak memiliki izin untuk {$action}."
            : 'Anda tidak memiliki izin untuk melakukan aksi ini.';
        parent::__construct($message, $message, Response::HTTP_FORBIDDEN);
    }
}
