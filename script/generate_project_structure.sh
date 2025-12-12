#!/bin/bash

# Ask for project name
read -p "Enter project name (default: my-ecommerce-api): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-my-ecommerce-api}

# Ask for folder structure
echo "Select architecture type:"
echo "1) Modular (Feature / DDD)"
echo "2) Layered"
echo "3) Both"
read -p "Enter choice [1-3] (default: 1): " ARCH_CHOICE
ARCH_CHOICE=${ARCH_CHOICE:-1}

case $ARCH_CHOICE in
    1) ARCH_TYPE="modular";;
    2) ARCH_TYPE="layered";;
    3) ARCH_TYPE="both";;
    *) ARCH_TYPE="modular";;
esac

# Ask for API type (only affects modular structure)
echo "Select API type (only affects modular structure):"
echo "1) Web"
echo "2) App"
echo "3) Both"
read -p "Enter choice [1-3] (default: 3): " API_CHOICE
API_CHOICE=${API_CHOICE:-3}

case $API_CHOICE in
    1) API_TYPE="web";;
    2) API_TYPE="app";;
    3) API_TYPE="both";;
    *) API_TYPE="both";;
esac

echo "Creating project '$PROJECT_NAME' with architecture '$ARCH_TYPE' and API type '$API_TYPE'..."

# Create main folders
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME || exit
mkdir -p src
mkdir -p tests scripts
touch package.json tsconfig.json README.md

# Shared folders
mkdir -p src/shared/{middlewares,utils,types}
touch src/shared/middlewares/auth.middleware.ts
touch src/shared/middlewares/error.middleware.ts
touch src/shared/utils/logger.ts
touch src/shared/utils/email.ts
touch src/shared/utils/payment.ts
touch src/shared/types/user.type.ts
touch src/shared/types/product.type.ts
touch src/shared/types/order.type.ts

# Config files
mkdir -p src/config
touch src/config/database.ts
touch src/config/serverConfig.ts

# app.ts and server.ts
touch src/app.ts
touch src/server.ts

# .nvmrc and .env
echo "20" > .nvmrc
touch .env

# Function to create modular structure
create_modular() {
    echo "Creating modular (feature-based) structure..."
    mkdir -p src/modules
    MODULES=(auth user product order)

    for module in "${MODULES[@]}"; do
        if [[ "$API_TYPE" == "web" || "$API_TYPE" == "both" ]]; then
            MOD_PATH=src/modules/web_$module
            mkdir -p $MOD_PATH
            touch $MOD_PATH/$module.controller.ts
            touch $MOD_PATH/$module.service.ts
            touch $MOD_PATH/$module.routes.ts
            touch $MOD_PATH/$module.model.ts
            touch $MOD_PATH/$module.validator.ts
        fi
        if [[ "$API_TYPE" == "app" || "$API_TYPE" == "both" ]]; then
            MOD_PATH=src/modules/app_$module
            mkdir -p $MOD_PATH
            touch $MOD_PATH/$module.controller.ts
            touch $MOD_PATH/$module.service.ts
            touch $MOD_PATH/$module.routes.ts
            touch $MOD_PATH/$module.model.ts
            touch $MOD_PATH/$module.validator.ts
        fi
    done
}

# Function to create layered structure
create_layered() {
    echo "Creating layered architecture structure..."
    mkdir -p src/{controllers,routes,services,models,validators,middlewares,utils,types}
    touch src/controllers/{auth,user,product,order}.controller.ts
    touch src/routes/{auth,user,product,order}.routes.ts
    touch src/services/{auth,user,product,order}.service.ts
    touch src/models/{user,product,order}.model.ts
    touch src/validators/{auth,user,product}.validator.ts
}

# Generate structure based on choice
case "$ARCH_TYPE" in
    modular) create_modular ;;
    layered) create_layered ;;
    both) create_modular; create_layered ;;
esac

echo "✅ Project '$PROJECT_NAME' created successfully!"
