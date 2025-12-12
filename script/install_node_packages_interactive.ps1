# Ask for project folder
$PROJECT_FOLDER = Read-Host "Enter project folder name (default: my-ecommerce-api)"
if ([string]::IsNullOrWhiteSpace($PROJECT_FOLDER)) { $PROJECT_FOLDER = "my-ecommerce-api" }

# Navigate to project folder
if (-Not (Test-Path $PROJECT_FOLDER)) {
    Write-Host "❌ Project folder '$PROJECT_FOLDER' does not exist."
    exit
}
Set-Location $PROJECT_FOLDER

# Ask if using npm or yarn
Write-Host "Select package manager:"
Write-Host "1) npm"
Write-Host "2) yarn"
$PM_CHOICE = Read-Host "Enter choice [1-2] (default: 1)"
if ([string]::IsNullOrWhiteSpace($PM_CHOICE)) { $PM_CHOICE = "1" }

switch ($PM_CHOICE) {
    "1" { $PM = "npm" }
    "2" { $PM = "yarn" }
    default { $PM = "npm" }
}

# List of common packages
$commonPackages = @(
    "express", "cors", "dotenv", "bcryptjs", "jsonwebtoken", 
    "mongoose", "prisma", "zod", "axios", "nodemailer"
)

Write-Host "`nSelect packages to install (comma-separated numbers):"
for ($i=0; $i -lt $commonPackages.Count; $i++) {
    Write-Host "$($i+1)) $($commonPackages[$i])"
}
$selection = Read-Host "Enter choices (e.g., 1,2,4) or leave empty to skip"
$selectedPackages = @()

if (-Not [string]::IsNullOrWhiteSpace($selection)) {
    $indices = $selection -split "," | ForEach-Object { ($_ -as [int]) - 1 }
    foreach ($i in $indices) {
        if ($i -ge 0 -and $i -lt $commonPackages.Count) {
            $selectedPackages += $commonPackages[$i]
        }
    }
}

# Ask for custom packages
$customPackages = Read-Host "Enter any additional packages separated by space (optional)"
if (-Not [string]::IsNullOrWhiteSpace($customPackages)) {
    $selectedPackages += $customPackages -split "\s+"
}

if ($selectedPackages.Count -eq 0) {
    Write-Host "No packages selected. Exiting."
    exit
}

# Ask if they are devDependencies
$devChoice = Read-Host "Install as devDependencies? (y/n, default: n)"
$devChoice = if ([string]::IsNullOrWhiteSpace($devChoice)) { "n" } else { $devChoice.ToLower() }
$isDev = $devChoice -eq "y"

# Install packages
Write-Host "`nInstalling packages..."
if ($PM -eq "npm") {
    if ($isDev) {
        npm install -D $selectedPackages
    } else {
        npm install $selectedPackages
    }
} else {
    if ($isDev) {
        yarn add -D $selectedPackages
    } else {
        yarn add $selectedPackages
    }
}

Write-Host "✅ Selected packages installed successfully!"
