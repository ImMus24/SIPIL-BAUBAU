<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Add performance index on complaint_status_logs.complaint_id.
 *
 * foreignId()->constrained() creates a foreign key constraint but does NOT
 * guarantee a separate B-tree index on the column in all DB engines.
 * This migration adds an explicit index so dashboard timeline queries
 * (which filter/join on complaint_id) avoid full-table scans.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('complaint_status_logs', function (Blueprint $table) {
            // Guard: only add if the index does not already exist
            if (!$this->indexExists('complaint_status_logs', 'complaint_status_logs_complaint_id_index')) {
                $table->index('complaint_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('complaint_status_logs', function (Blueprint $table) {
            $table->dropIndex(['complaint_id']);
        });
    }

    private function indexExists(string $table, string $indexName): bool
    {
        $connection = Schema::getConnection();
        $prefix     = $connection->getTablePrefix();

        try {
            $indexes = $connection->getDoctrineSchemaManager()
                ->listTableIndexes($prefix . $table);
            return array_key_exists($indexName, $indexes);
        } catch (\Throwable) {
            return false;
        }
    }
};
