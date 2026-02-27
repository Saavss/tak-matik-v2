
<?php
// asistan-backend.php
header('Content-Type: application/json');

// 1. API Anahtarını buraya gizle (Kimse göremez)
$apiKey = "AIzaSyAYM1CUjNj-uXhsLGEtb6Qfhh-Nwhs5_hs"; 
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

// 2. Gelen soruyu al
$input = json_decode(file_get_contents('php://input'), true);
$userMessage = $input['message'] ?? '';

if (!$userMessage) {
    echo json_encode(['error' => 'Mesaj boş olamaz']);
    exit;
}

// 3. Gemini'ye isteği sunucu üzerinden gönder
$data = [
    "contents" => [[
        "parts" => [["text" => "Sen takimatik.com.tr uzmanısın. Soru: " . $userMessage]]
    ]]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
curl_close($ch);

// 4. Cevabı siteye geri gönder
echo $response;
?>
