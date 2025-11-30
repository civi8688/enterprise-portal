$baseUrl = "http://localhost:8080"
$pages = @("index.html", "products.html", "news.html", "about.html")
$results = @()

foreach ($page in $pages) {
    $url = "$baseUrl/$page"
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            $status = "PASS"
            $content = $response.Content
            $details = "Status 200 OK"
            
            if ($content -match "EnterprisePro") {
                $details += ", Navbar Found"
            } else {
                $status = "FAIL"
                $details = "Navbar Missing"
            }
            
            if ($page -eq "products.html") {
                if ($content -match "card-body") { $details += ", Product Cards Found" }
                else { $status = "FAIL"; $details = "Product Cards Missing" }
            }
            if ($page -eq "news.html") {
                if ($content -match "news-day") { $details += ", News Items Found" }
                else { $status = "FAIL"; $details = "News Items Missing" }
            }
            if ($page -eq "about.html") {
                if ($content -match "CEO") { $details += ", Team Section Found" }
                else { $status = "FAIL"; $details = "Team Section Missing" }
            }
            
        } else {
            $status = "FAIL"
            $details = "Status Code: $($response.StatusCode)"
        }
    } catch {
        $status = "FAIL"
        $details = $_.Exception.Message
    }
    
    $results += [PSCustomObject]@{
        Page = $page
        Status = $status
        Details = $details
    }
}

$results | Format-Table -AutoSize
