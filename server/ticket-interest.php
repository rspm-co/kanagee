<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'message' => 'Method not allowed.']);
}
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) {
    respond(415, ['ok' => false, 'message' => 'JSON required.']);
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 2048) {
    respond(413, ['ok' => false, 'message' => 'Request too large.']);
}

try {
    // Deployed at public_html/api/ticket-interest.php.
    $configPath = dirname(__DIR__, 2) . '/kanagee-config.php';
    if (!is_file($configPath)) {
        respond(503, ['ok' => false, 'message' => 'Registration is not configured yet.']);
    }
    $config = require $configPath;
    if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] !== $config['origin']) {
        respond(403, ['ok' => false, 'message' => 'Origin not allowed.']);
    }
    $raw = file_get_contents('php://input', false, null, 0, 2049);
    if ($raw === false || strlen($raw) > 2048) {
        respond(413, ['ok' => false, 'message' => 'Request too large.']);
    }
    $input = json_decode($raw, true);
    if (!is_array($input) || ($input['consent'] ?? null) !== true || ($input['purpose'] ?? '') !== 'ticket-launch') {
        respond(422, ['ok' => false, 'message' => 'Ticket alert consent is required.']);
    }
    $mobile = $input['mobile'] ?? '';
    if (!is_string($mobile) || !preg_match('/^\+91[6-9][0-9]{9}$/D', $mobile)) {
        respond(422, ['ok' => false, 'message' => 'Enter a valid Indian mobile number.']);
    }
    $pdo = new PDO(
        'mysql:host=' . $config['host'] . ';dbname=' . $config['database'] . ';charset=utf8mb4',
        $config['username'], $config['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
    );
    $pdo->exec("SET time_zone = '+00:00'");
    // Duplicate submissions succeed without adding another contact or resetting delivery status.
    $statement = $pdo->prepare(
        "INSERT INTO ticket_interests (mobile, purpose, consent_at)
         VALUES (:mobile, 'ticket-launch', UTC_TIMESTAMP())
         ON DUPLICATE KEY UPDATE id = id"
    );
    $statement->execute(['mobile' => $mobile]);
    respond(200, ['ok' => true]);
} catch (Throwable $error) {
    // Keep database details and submitted numbers out of public responses and logs.
    error_log('KANAGEE ticket interest registration failed.');
    respond(503, ['ok' => false, 'message' => 'Unable to save right now. Please try again.']);
}
