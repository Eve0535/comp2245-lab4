<?php
header('Content-Type: application/json; charset=UTF-8');

require __DIR__ . '/db.php';
$search = $_GET['q'] ?? '';

if (!is_string($search)) {
    $search = '';
}
$search = trim($search);
$pattern = '%' . $search . '%';
$subject = filter_input(INPUT_GET, 'subject', FILTER_VALIDATE_INT);

$available = $_GET['available'] ?? '';

$sql = '
    SELECT
        books.title AS title,
        books.author AS author,
        books.year AS year,
        subjects.name AS subject,
        books.copies AS copies,
        (books.copies - books.on_loan) AS available
    FROM books
    JOIN subjects ON books.subject_id = subjects.id
    WHERE (books.title LIKE :title OR books.author LIKE :author)
';

$params = [':title' => $pattern, ':author' => $pattern];

if (is_int($subject) && $subject >= 1) {
    $sql .= ' AND books.subject_id = :subject';
    $params[':subject'] = $subject;
}

if ($available === '1') {
    $sql .= ' AND books.copies > books.on_loan';
}

$sql .= ' ORDER BY books.title';
$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$books = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($books);
