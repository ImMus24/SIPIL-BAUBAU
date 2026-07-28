<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

abstract class BaseException extends Exception
{
    protected string $userMessage;
    protected array $context = [];
    protected string $severity = 'error';

    public function __construct(
        string $userMessage = 'Terjadi kesalahan.',
        string $logMessage = '',
        int $code = Response::HTTP_INTERNAL_SERVER_ERROR,
        ?\Throwable $previous = null
    ) {
        parent::__construct($logMessage ?: $userMessage, $code, $previous);
        $this->userMessage = $userMessage;
    }

    public function setContext(array $context): self
    {
        $this->context = $context;
        return $this;
    }

    public function getContext(): array
    {
        return $this->context;
    }

    public function getUserMessage(): string
    {
        return $this->userMessage;
    }

    public function getSeverity(): string
    {
        return $this->severity;
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->userMessage,
        ], $this->code);
    }
}
