<?php

namespace App\Exceptions;

use Symfony\Component\HttpFoundation\Response;

class FileUploadException extends BaseException
{
    public function __construct(string $detail = '')
    {
        $message = $detail
            ? "Gagal mengunggah file: {$detail}"
            : 'Gagal mengunggah file. Periksa format dan ukuran file.';
        parent::__construct($message, $message, Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
