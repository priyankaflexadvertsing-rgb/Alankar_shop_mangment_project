#!/bin/bash

# Ask for project folder
read -p "Enter project folder name (default: my-ecommerce-api): " PROJECT_FOLDER
PROJECT_FOLDER=${PROJECT_FOLDER:-my-ecommerce-api}

if [ ! -d "$PROJECT_FOLDER" ]; then
    echo "❌ Project folder '$PROJECT_FOLDER' does not exist."
    exit 1
fi

cd "$PROJECT_FOLDER" || exit

# Ask for package manager
echo "Select package manager:"
echo "1) npm"
echo "2) yarn"
read -p "Enter choice [1-2] (default: 1): " PM_CHOICE
PM_CHOICE=${PM_CHOICE:-1}

if [ "$PM_CHOICE" -eq 2 ]; then
    PM="yarn"
else
    PM="npm"
fi

# Common packages list
COMMON_PACKAGES=("express" "cors" "dotenv" "bcryptjs" "jsonwebtoken" "mongoose" "prisma" "zod" "axios" "nodemailer")

echo ""
echo "Select packages to install (comma-separated numbers):"
for i in "${!COMMON_PACKAGES[@]}"; do
    printf "%d) %s\n" $((i+1)) "${COMMON_PACKAGES[$i]}"
done

read -p "Enter choices (e.g., 1,2,4) or leave empty to skip: " SELECTION

SELECTED_PACKAGES=()

if [ -n "$SELECTION" ]; then
    IFS=',' read -ra INDICES <<< "$SELECTION"
    for i in "${INDICES[@]}"; do
        index=$((i-1))
        if [ $index -ge 0 ] && [ $index -lt ${#COMMON_PACKAGES[@]} ]; then
            SELECTED_PACKAGES+=("${COMMON_PACKAGES[$index]}")
        fi
    done
fi

# Ask for custom packages
read -p "Enter any additional packages separated by space (optional): " CUSTOM_PACKAGES
if [ -n "$CUSTOM_PACKAGES" ]; then
    for pkg in $CUSTOM_PACKAGES; do
        SELECTED_PACKAGES+=("$pkg")
    done
fi

if [ ${#SELECTED_PACKAGES[@]} -eq 0 ]; then
    echo "No packages selected. Exiting."
    exit 0
fi

# Ask if devDependencies
read -p "Install as devDependencies? (y/n, default: n): " DEV_CHOICE
DEV_CHOICE=${DEV_CHOICE:-n}

echo ""
echo "Installing packages: ${SELECTED_PACKAGES[*]}"

if [ "$PM" = "npm" ]; then
    if [ "$DEV_CHOICE" = "y" ]; then
        npm install -D "${SELECTED_PACKAGES[@]}"
    else
        npm install "${SELECTED_PACKAGES[@]}"
    fi
else
    if [ "$DEV_CHOICE" = "y" ]; then
        yarn add -D "${SELECTED_PACKAGES[@]}"
    else
        yarn add "${SELECTED_PACKAGES[@]}"
    fi
fi

echo "✅ Selected packages installed successfully!"
