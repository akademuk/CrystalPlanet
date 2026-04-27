<?php
// ─── Crystal Planet — contact form handler ──────────────────────────────────
// Receives POST from contacts form, sends email, redirects to thanks.html

// === SETTINGS ===============================================================
$TO_EMAIL    = 'akademuk24@gmail.com';   // where to receive applications
$FROM_EMAIL  = 'no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost'); // sender
$SUBJECT     = 'New application — Crystal Planet';
$THANKS_URL  = 'thanks.html';
$BACK_URL    = 'index.html#contacts-heading';
// ============================================================================

header('Content-Type: text/html; charset=utf-8');

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . $BACK_URL);
    exit;
}

// Honeypot anti-spam (hidden field "website" — bots fill it, humans don't)
if (!empty($_POST['website'])) {
    header('Location: ' . $THANKS_URL);
    exit;
}

// Sanitize helpers
function clean($v) {
    $v = is_string($v) ? trim($v) : '';
    $v = strip_tags($v);
    return mb_substr($v, 0, 500);
}

$name       = clean($_POST['name']        ?? '');
$jobTitle   = clean($_POST['job-title']   ?? '');
$phone      = clean($_POST['phone']       ?? '');
$socialLink = clean($_POST['social-link'] ?? '');

// Basic validation — all fields required
if ($name === '' || $jobTitle === '' || $phone === '' || $socialLink === '') {
    http_response_code(400);
    echo 'All fields are required. <a href="' . htmlspecialchars($BACK_URL) . '">Go back</a>';
    exit;
}

// Block header-injection
foreach ([$name, $jobTitle, $phone, $socialLink] as $val) {
    if (preg_match('/[\r\n]/', $val)) {
        http_response_code(400);
        echo 'Invalid input.';
        exit;
    }
}

// Build email body
$body  = "New application from the website\n";
$body .= "----------------------------------------\n";
$body .= "Name:        $name\n";
$body .= "Job title:   " . ($jobTitle  ?: '—') . "\n";
$body .= "Phone:       " . ($phone     ?: '—') . "\n";
$body .= "Social link: " . ($socialLink ?: '—') . "\n";
$body .= "----------------------------------------\n";
$body .= "IP:   " . ($_SERVER['REMOTE_ADDR'] ?? '—') . "\n";
$body .= "Date: " . date('Y-m-d H:i:s') . "\n";

$headers  = "From: Crystal Planet <$FROM_EMAIL>\r\n";
$headers .= "Reply-To: $FROM_EMAIL\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = @mail($TO_EMAIL, '=?UTF-8?B?' . base64_encode($SUBJECT) . '?=', $body, $headers);

// Optional: log to file as backup
$log = date('Y-m-d H:i:s') . " | name=$name | phone=$phone | social=$socialLink\n";
@file_put_contents(__DIR__ . '/applications.log', $log, FILE_APPEND | LOCK_EX);

// Redirect — even if mail() failed (we have the log)
header('Location: ' . $THANKS_URL);
exit;
