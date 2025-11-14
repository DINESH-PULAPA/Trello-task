# Webhook Setup Script
# Run this after starting ngrok

Write-Host "🔧 Trello Webhook Setup Script" -ForegroundColor Cyan
Write-Host ""

# Get ngrok URL
$ngrokUrl = Read-Host "Enter your ngrok HTTPS URL (e.g., https://abc123.ngrok.io)"

# Get board ID
Write-Host ""
Write-Host "📋 Fetching your boards..." -ForegroundColor Yellow
$boards = Invoke-RestMethod -Uri "http://localhost:5000/api/boards" -Method GET

Write-Host ""
Write-Host "Available Boards:" -ForegroundColor Green
for ($i = 0; $i -lt $boards.Count; $i++) {
    Write-Host "  $($i + 1). $($boards[$i].name) - ID: $($boards[$i].id)"
}

Write-Host ""
$selection = Read-Host "Select board number (1-$($boards.Count))"
$boardId = $boards[$selection - 1].id

Write-Host ""
Write-Host "📡 Registering webhook..." -ForegroundColor Yellow

# Create webhook
$body = @{
    boardId = $boardId
    callbackURL = "$ngrokUrl/webhook"
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/webhooks/create" -Method POST -Body $body -ContentType "application/json"
    
    Write-Host ""
    Write-Host "✅ Webhook registered successfully!" -ForegroundColor Green
    Write-Host "   Webhook ID: $($result.webhook.id)" -ForegroundColor Cyan
    Write-Host "   Callback URL: $($result.webhook.callbackURL)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎉 Your Trello board is now connected for real-time updates!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "❌ Error creating webhook:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host ""
Read-Host "Press Enter to exit"
