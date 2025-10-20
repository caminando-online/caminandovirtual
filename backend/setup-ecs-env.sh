#!/bin/bash

# ECS Environment Variables Setup Script
# Securely store environment variables in AWS Parameter Store

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_NAME="caminando-online-backend"
REGION="us-east-1"

echo -e "${BLUE}🔐 Setting up secure environment variables for ECS${NC}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found. Please create it with your production credentials.${NC}"
    echo -e "${YELLOW}💡 Copy .env.example to .env and fill in your values.${NC}"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}📝 Storing environment variables in Parameter Store...${NC}"

# Read .env file and store each variable in Parameter Store
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    [[ -z "$key" || "$key" =~ ^[[:space:]]*# ]] && continue

    # Remove quotes from value if present
    value=$(echo "$value" | sed 's/^"\(.*\)"$/\1/' | sed "s/^'\(.*\)'$/\1/")

    # Skip empty values
    [[ -z "$value" ]] && continue

    param_name="/${APP_NAME}/${key}"

    echo -e "${GREEN}  Storing ${key}...${NC}"

    # Store as SecureString for sensitive data, String for others
    if [[ "$key" =~ (SECRET|PASSWORD|KEY|TOKEN) ]]; then
        aws ssm put-parameter \
            --name "$param_name" \
            --value "$value" \
            --type "SecureString" \
            --overwrite \
            --region "$REGION"
    else
        aws ssm put-parameter \
            --name "$param_name" \
            --value "$value" \
            --type "String" \
            --overwrite \
            --region "$REGION"
    fi

done < .env

echo -e "${GREEN}✅ Environment variables stored securely!${NC}"
echo ""
echo -e "${BLUE}📋 Parameter Store paths created:${NC}"
echo "  /${APP_NAME}/NODE_ENV"
echo "  /${APP_NAME}/PORT"
echo "  /${APP_NAME}/MONGO_*"
echo "  /${APP_NAME}/JWT_SECRET"
echo "  ... and all other variables"
echo ""
echo -e "${YELLOW}⚠️  Next steps:${NC}"
echo "1. Update your ECS task definition to use these parameters"
echo "2. Grant the ECS task execution role permission to read from Parameter Store"
echo "3. The deploy-ecs.sh script will be updated to use these parameters"