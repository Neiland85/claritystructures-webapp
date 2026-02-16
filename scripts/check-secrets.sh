#!/bin/bash
set -e

echo "Security Audit - ClarityStructures WebApp"
echo "=========================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ISSUES_FOUND=0

# Common exclude flags (avoid brace expansion for portability)
EXCLUDE_DIRS="--exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next --exclude-dir=dist --exclude-dir=build --exclude-dir=generated --exclude-dir=coverage --exclude-dir=__tests__"

echo -e "\n${YELLOW}1. Checking for hardcoded secrets...${NC}"
if grep -r $EXCLUDE_DIRS --exclude="*.md" --include="*.ts" --include="*.tsx" -E "(password|secret|api_key|apikey|token|private_key).*=.*['\"][^'\"]{8,}['\"]" . 2>/dev/null; then
    echo -e "${RED}WARNING: Found potential hardcoded secrets!${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}OK: No hardcoded secrets found${NC}"
fi

echo -e "\n${YELLOW}2. Checking NEXT_PUBLIC_ variables...${NC}"
if grep -r $EXCLUDE_DIRS --include="*.ts" --include="*.tsx" --include="*.env*" -E "NEXT_PUBLIC_.*(SECRET|PASSWORD|TOKEN|PRIVATE)" . 2>/dev/null | grep -v "POSTHOG_KEY" | grep -v "^$"; then
    echo -e "${RED}WARNING: Found NEXT_PUBLIC_ with sensitive names!${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}OK: No sensitive NEXT_PUBLIC_ variables${NC}"
fi

echo -e "\n${YELLOW}3. Checking for .env in git...${NC}"
if git ls-files | grep -E "\.env$" 2>/dev/null; then
    echo -e "${RED}WARNING: .env file tracked by git!${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}OK: No .env files in git${NC}"
fi

echo -e "\n${YELLOW}4. Checking .gitignore...${NC}"
if ! grep -q "\.env\.local" .gitignore 2>/dev/null; then
    echo -e "${RED}WARNING: .env.local not in .gitignore!${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}OK: .env files properly ignored${NC}"
fi

echo -e "\n=========================================="
if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}PASSED: Security audit passed!${NC}"
    exit 0
else
    echo -e "${RED}FAILED: Found $ISSUES_FOUND security issues!${NC}"
    exit 1
fi
