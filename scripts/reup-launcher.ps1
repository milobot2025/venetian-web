$env:STRAPI_URL = 'https://strapi-backend-production-35d0.up.railway.app'
$env:STRAPI_API_TOKEN = (Get-Content -Raw "$env:TEMP\..\..\Programs\Git\tmp\railway_api_token.txt" -ErrorAction SilentlyContinue)
if (-not $env:STRAPI_API_TOKEN) {
  $env:STRAPI_API_TOKEN = (Get-Content -Raw "C:\Users\User\AppData\Local\Temp\railway_api_token.txt" -ErrorAction SilentlyContinue)
}
Set-Location 'C:\Users\User\milobot\web-marca'
node scripts/upload-all-photos.js *>&1 | Tee-Object -FilePath 'C:\Users\User\milobot\web-marca\prod-reup8.log'
