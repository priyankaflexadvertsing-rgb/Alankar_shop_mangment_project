# Ask for project name
$PROJECT_NAME = Read-Host "Enter project name (default: my-ecommerce-api)"
if ([string]::IsNullOrWhiteSpace($PROJECT_NAME)) { $PROJECT_NAME = "my-ecommerce-api" }

# Ask for architecture type
Write-Host "Select architecture type:"
Write-Host "1) Modular (Feature / DDD)"
Write-Host "2) Layered"
Write-Host "3) Both"
$ARCH_CHOICE = Read-Host "Enter choice [1-3] (default: 1)"
if ([string]::IsNullOrWhiteSpace($ARCH_CHOICE)) { $ARCH_CHOICE = "1" }

switch ($ARCH_CHOICE) {
    "1" { $ARCH_TYPE = "modular" }
    "2" { $ARCH_TYPE = "layered" }
    "3" { $ARCH_TYPE = "both" }
    default { $ARCH_TYPE = "modular" }
}

# Ask for API type (only affects modular)
Write-Host "Select API type (only affects modular structure):"
Write-Host "1) Web"
Write-Host "2) App"
Write-Host "3) Both"
$API_CHOICE = Read-Host "Enter choice [1-3] (default: 3)"
if ([string]::IsNullOrWhiteSpace($API_CHOICE)) { $API_CHOICE = "3" }

switch ($API_CHOICE) {
    "1" { $API_TYPE = "web" }
    "2" { $API_TYPE = "app" }
    "3" { $API_TYPE = "both" }
    default { $API_TYPE = "both" }
}

Write-Host "Creating project '$PROJECT_NAME' with architecture '$ARCH_TYPE' and API type '$API_TYPE'..."

# Create main folders
New-Item -ItemType Directory -Path $PROJECT_NAME -Force | Out-Null
Set-Location $PROJECT_NAME
New-Item -ItemType Directory -Path src, tests, scripts -Force | Out-Null
New-Item -ItemType File -Path package.json, tsconfig.json, README.md -Force | Out-Null

# Shared folders
New-Item -ItemType Directory -Path "src\shared\middlewares","src\shared\utils","src\shared\types" -Force | Out-Null
New-Item -ItemType File -Path "src\shared\middlewares\auth.middleware.ts","src\shared\middlewares\error.middleware.ts" -Force | Out-Null
New-Item -ItemType File -Path "src\shared\utils\logger.ts","src\shared\utils\email.ts","src\shared\utils\payment.ts" -Force | Out-Null
New-Item -ItemType File -Path "src\shared\types\user.type.ts","src\shared\types\product.type.ts","src\shared\types\order.type.ts" -Force | Out-Null

# Config files
New-Item -ItemType Directory -Path "src\config" -Force | Out-Null
New-Item -ItemType File -Path "src\config\database.ts","src\config\serverConfig.ts" -Force | Out-Null

# app.ts and server.ts
New-Item -ItemType File -Path "src\app.ts","src\server.ts" -Force | Out-Null

# .nvmrc and .env
"20" | Out-File .nvmrc
New-Item -ItemType File -Path .env -Force | Out-Null

# Function to create modular structure
function Create-Modular {
    Write-Host "Creating modular (feature-based) structure..."
    $modules = @("auth","user","product","order")
    New-Item -ItemType Directory -Path "src\modules" -Force | Out-Null

    foreach ($module in $modules) {
        if ($API_TYPE -eq "web" -or $API_TYPE -eq "both") {
            $modPath = "src\modules\web_$module"
            New-Item -ItemType Directory -Path $modPath -Force | Out-Null
            New-Item -ItemType File -Path "$modPath\$module.controller.ts","$modPath\$module.service.ts","$modPath\$module.routes.ts","$modPath\$module.model.ts","$modPath\$module.validator.ts" -Force | Out-Null
        }
        if ($API_TYPE -eq "app" -or $API_TYPE -eq "both") {
            $modPath = "src\modules\app_$module"
            New-Item -ItemType Directory -Path $modPath -Force | Out-Null
            New-Item -ItemType File -Path "$modPath\$module.controller.ts","$modPath\$module.service.ts","$modPath\$module.routes.ts","$modPath\$module.model.ts","$modPath\$module.validator.ts" -Force | Out-Null
        }
    }
}

# Function to create layered structure
function Create-Layered {
    Write-Host "Creating layered architecture structure..."
    $folders = @("controllers","routes","services","models","validators","middlewares","utils","types")
    foreach ($f in $folders) {
        New-Item -ItemType Directory -Path "src\$f" -Force | Out-Null
    }

    New-Item -ItemType File -Path "src\controllers\auth.controller.ts","src\controllers\user.controller.ts","src\controllers\product.controller.ts","src\controllers\order.controller.ts" -Force | Out-Null
    New-Item -ItemType File -Path "src\routes\auth.routes.ts","src\routes\user.routes.ts","src\routes\product.routes.ts","src\routes\order.routes.ts" -Force | Out-Null
    New-Item -ItemType File -Path "src\services\auth.service.ts","src\services\user.service.ts","src\services\product.service.ts","src\services\order.service.ts" -Force | Out-Null
    New-Item -ItemType File -Path "src\models\user.model.ts","src\models\product.model.ts","src\models\order.model.ts" -Force | Out-Null
    New-Item -ItemType File -Path "src\validators\auth.validator.ts","src\validators\user.validator.ts","src\validators\product.validator.ts" -Force | Out-Null
}

# Generate structure based on choice
switch ($ARCH_TYPE) {
    "modular" { Create-Modular }
    "layered" { Create-Layered }
    "both" { Create-Modular; Create-Layered }
}

Write-Host "✅ Project '$PROJECT_NAME' created successfully!"
