
<?php

require __DIR__ . '/config.php';
$dsn = 'mysql:host=localhost;dbname=catalogue;charset=utf8mb4';
$user = 'comp2245';

try {
   
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_EMULATE_PREPARES => false
    ]);

} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'Could not connect to the database.'
    ]);

    exit;
}
