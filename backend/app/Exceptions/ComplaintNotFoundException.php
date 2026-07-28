<?php

namespace App\Exceptions;

use Symfony\Component\HttpFoundation\Response;

class ComplaintNotFoundException extends BaseException
{
    public function __construct(string $ticketCode = '')
    {
        $message = $ticketCode
            ? "Pengaduan dengan kode tiket {$ticketCode} tidak ditemukan."
            : 'Pengaduan tidak ditemukan.';
        parent::__construct($message, $message, Response::HTTP_NOT_FOUND);
    }
}
