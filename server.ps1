# Simple PowerShell Static File Server
$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
Write-Output "Starting server on http://localhost:$port/ ..."
try {
    $listener.Start()
    Write-Output "Server successfully started. Press Ctrl+C in terminal or kill the task to stop."
} catch {
    Write-Error $_
    Exit
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Parse URL path
        $url = $request.RawUrl.Split('?')[0]
        if ($url -eq "" -or $url -eq "/") {
            $url = "/index.html"
        }
        
        # Translate to local path
        # Replace forward slashes with backslashes
        $cleanUrl = $url.Replace("/", "\")
        $localPath = Join-Path (Get-Location) $cleanUrl
        
        if (Test-Path $localPath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($localPath)
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            
            $contentType = "text/plain"
            if ($ext -eq ".html") { $contentType = "text/html; charset=utf-8" }
            elseif ($ext -eq ".css") { $contentType = "text/css; charset=utf-8" }
            elseif ($ext -eq ".js") { $contentType = "application/javascript; charset=utf-8" }
            elseif ($ext -eq ".png") { $contentType = "image/png" }
            elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $contentType = "image/jpeg" }
            elseif ($ext -eq ".gif") { $contentType = "image/gif" }
            elseif ($ext -eq ".ico") { $contentType = "image/x-icon" }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $url")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
    } catch {
        # Log error but keep listening
        Write-Output "Request handling error: $_"
    } finally {
        if ($response) {
            $response.Close()
        }
    }
}
