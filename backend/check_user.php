<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$u = User::where('email', 'warga@gmail.com')->first();
if ($u) {
    echo "ID: " . $u->id . PHP_EOL;
    echo "Name: " . $u->name . PHP_EOL;
    echo "Email: " . $u->email . PHP_EOL;
    echo "Role: " . $u->role->value . PHP_EOL;
    echo "Password hash: " . $u->password . PHP_EOL;
    echo "Hash check: " . (Hash::check('password123', $u->password) ? 'TRUE' : 'FALSE') . PHP_EOL;
} else {
    echo "USER NOT FOUND" . PHP_EOL;
    echo "Total users: " . User::count() . PHP_EOL;
    $allUsers = User::all(['id', 'name', 'email', 'role']);
    foreach ($allUsers as $user) {
        echo "  - {$user->id}: {$user->name} ({$user->email}) role={$user->role}" . PHP_EOL;
    }
}
