#!/bin/bash
set -e

echo "🚀 Healthcare Pro - Full Deployment Script"
echo "==========================================="

# Check required tools
for tool in git node railway vercel; do
    if ! command -v $tool &>/dev/null; then
        echo "❌ '$tool' not found. Installing..."
        if [ "$tool" = "railway" ]; then npm install -g @railway/cli; fi
        if [ "$tool" = "vercel" ]; then npm install -g vercel; fi
    fi
done

# Step 1: GitHub
echo ""
echo "📦 Step 1: Pushing to GitHub..."
if ! git remote get-url origin &>/dev/null; then
    echo "Enter your GitHub username:"
    read GITHUB_USER
    REPO_NAME="healthcare-pro"

    # Create repo via API
    echo "Enter your GitHub Personal Access Token (github.com → Settings → Developer Settings → Tokens):"
    read -s GITHUB_TOKEN

    curl -s -X POST https://api.github.com/user/repos \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"$REPO_NAME\",\"private\":false}" > /dev/null

    git remote add origin "https://$GITHUB_USER:$GITHUB_TOKEN@github.com/$GITHUB_USER/$REPO_NAME.git"
fi

git config user.email "agentlab9@gmail.com"
git config user.name "Healthcare Pro"
git add -A
git commit -m "Initial commit: Healthcare Pro full-stack app" 2>/dev/null || true
git branch -M main
git push -u origin main
echo "✅ Code pushed to GitHub!"

# Step 2: Railway Backend
echo ""
echo "🚂 Step 2: Deploying backend to Railway..."
echo "Opening Railway login (browser will open)..."
railway login

cd server
railway init --name healthcare-pro-api 2>/dev/null || true
railway add --plugin postgresql
echo ""
echo "⏳ Waiting for PostgreSQL to provision (30s)..."
sleep 30

railway up --detach
BACKEND_URL=$(railway domain 2>/dev/null || echo "")
if [ -z "$BACKEND_URL" ]; then
    railway domain
    BACKEND_URL=$(railway domain)
fi
echo "✅ Backend deployed at: https://$BACKEND_URL"
cd ..

# Step 3: Vercel Frontend
echo ""
echo "▲ Step 3: Deploying frontend to Vercel..."
echo "Opening Vercel login (browser will open)..."
vercel login

vercel --yes \
    --env VITE_API_URL="https://$BACKEND_URL/api" \
    --build-env VITE_API_URL="https://$BACKEND_URL/api"

FRONTEND_URL=$(vercel --prod 2>&1 | grep "https://" | tail -1)
echo ""
echo "🎉 ============================================"
echo "   DEPLOYMENT COMPLETE!"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend:  https://$BACKEND_URL"
echo "   ============================================"
echo ""
echo "   Login credentials:"
echo "   Admin:   admin@healthcare.com / password123"
echo "   Doctor:  sara@sop.com / password123"
echo "   Patient: ahmed@sop.com / password123"
