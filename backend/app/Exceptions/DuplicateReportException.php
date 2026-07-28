<?php

namespace App\Exceptions;

use Symfony\Component\HttpFoundation\Response;

class DuplicateReportException extends BaseException
{
    public function __construct(string $identifier = '')
    {
        $message = $identifier
            ? "Laporan duplikat terdeteksi untuk {$identifier}."
            : 'Laporan serupa sudah pernah diajukan sebelumnya. Silakan periksa status laporan Anda.';
        parent::__construct($message, $message, Response::HTTP_CONFLICT);
    }
}
