<?php
// asistan-backend.php
header('Content-Type: application/json');

// Gelen veriyi oku
$input = json_decode(file_get_contents('php://input'), true);
$userMessage = $input['message'] ?? '';

if (!$userMessage) {
    echo json_encode(['error' => 'Mesaj bulunamadı']);
    exit;
}

// Senin API Anahtarın
$apiKey = "AIzaSyAYM1CUjNj-uXhsLGEtb6Qfhh-Nwhs5_hs"; 
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

// Gemini'ye gidecek paket
$data = [
    "contents" => [[
        "parts" => [["text" => "Sen takimatik.com.tr sitesinin uzman asistanısın. Türkiye düğün gelenekleri ve altın piyasası hakkında konuşuyorsun. Soru şu: " . $userMessage]]
    ]]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(['error' => 'API Hatası: ' . $httpCode]);
} else {
    echo $response;
}
?>

