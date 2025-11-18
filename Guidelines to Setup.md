----------

# 🚀 EventsMap Frontend — OTAP Deployment Guide

### **(Next.js + GitHub Actions + GHCR + Podman on Managed VPS)**

This document explains the full **end-to-end setup** for secure OTAP deployment of the EventsMap frontend:

-   **O**nline (Dev)
    
-   **T**est
    
-   **A**cceptance (Stage)
    
-   **P**roduction (Master)
    

----------

# 📌 1. Overview

We deploy a Next.js 14/15/16 frontend using:

-   **GitHub Actions** → CI/CD
    
-   **GHCR (GitHub Container Registry)** → Docker image hosting
    
-   **Podman + podman-compose** → Container runtime on VPS
    
-   **Branch-based OTAP workflow**
    
-   **Manual approvals for stage + production**
    

----------

# 📁 2. Repository Branch Structure

Branch

Deployment

Approval Needed

**dev**

No deploy

❌

**test**

Auto deploy to Test

❌

**stage**

Deploy to Stage

✅ Manual Approval

**master**

Deploy to Production

✅ Manual Approval

GitHub Environments:

-   `test`
    
-   `stage`
    
-   `production`
    

Each environment has separate secrets.

----------

# 🏗️ 3. Server Setup (Managed VPS)

-   No root or sudo access
    
-   SSH user: `minaxi`
    
-   Podman + podman-compose installed by provider
    
-   GHCR login required
    

Create deployment directories:

```
/home/minaxi/eventsmap-test
/home/minaxi/eventsmap-stage
/home/minaxi/eventsmap-prod
```

----------

# ⚙️ 4. Podman Compose Files (One per Environment)

### **podman-compose.test.yml**

```yaml
version: "3.9"

services:
  frontend:
    image: ghcr.io/zerosoft-technologies/eventsmap-frontend:test
    container_name: eventsmap-test
    restart: unless-stopped
    environment:
      PORT: 3000
      HOST: 0.0.0.0
    ports:
      - "3001:3000"
    env_file:
      - .env
```

### **podman-compose.stage.yml**

```yaml
version: "3.9"

services:
  frontend:
    image: ghcr.io/zerosoft-technologies/eventsmap-frontend:stage
    container_name: eventsmap-stage
    restart: unless-stopped
    environment:
      PORT: 3000
      HOST: 0.0.0.0
    ports:
      - "3002:3000"
    env_file:
      - .env
```

### **podman-compose.prod.yml**

```yaml
version: "3.9"

services:
  frontend:
    image: ghcr.io/zerosoft-technologies/eventsmap-frontend:latest
    container_name: eventsmap-prod
    restart: unless-stopped
    environment:
      PORT: 3000
      HOST: 0.0.0.0
    ports:
      - "3000:3000"
    env_file:
      - .env
```

----------

# 🔐 5. Secret Handling

No `.env` file is committed.

GitHub Secrets used:

### Common Secrets

```
DEPLOY_SSH_PRIVATE_KEY
DEPLOY_USER
DEPLOY_SERVER
DEPLOY_PORT
SSH_KNOWN_HOSTS
GHCR_PAT
```

### Environment-Specific

Inside `Environment → Secrets`

#### TEST:

```
NEXT_PUBLIC_API_URL
NEXTAUTH_SECRET
```

#### STAGE:
```
NEXT_PUBLIC_API_URL
NEXTAUTH_SECRET
```

#### PRODUCTION:

```
NEXT_PUBLIC_API_URL
NEXTAUTH_SECRET
```

----------

# 🐳 6. Dockerfile (Final Clean Build)

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_SECRET

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app ./
EXPOSE 3000

CMD ["npm", "start"]
```

----------

# 🔁 7. GitHub Actions CI/CD Workflow

`.github/workflows/otap.yml`

```yaml
name: Frontend CI/CD (Secure OTAP)

on:
  push:
    branches:
      - dev
      - test
      - stage
      - master

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: zerosoft-technologies/eventsmap-frontend

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      env: ${{ steps.envname.outputs.env }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      # Determine deployment environment
      - name: Set environment name
        id: envname
        run: |
          BRANCH="${GITHUB_REF##*/}"
          if [[ "$BRANCH" == "dev" ]]; then echo "env=dev" >> $GITHUB_OUTPUT; fi
          if [[ "$BRANCH" == "test" ]]; then echo "env=test" >> $GITHUB_OUTPUT; fi
          if [[ "$BRANCH" == "stage" ]]; then echo "env=stage" >> $GITHUB_OUTPUT; fi
          if [[ "$BRANCH" == "master" ]]; then echo "env=production" >> $GITHUB_OUTPUT; fi

      # Install and build
      - name: Install dependencies
        run: npm ci

      - name: Build Project
        run: npm run build

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment: ${{ needs.build.outputs.env }}

    steps:
      - uses: actions/checkout@v4

      - name: Set image tag
        id: vars
        run: |
          BRANCH="${GITHUB_REF##*/}"
          if [[ "$BRANCH" == "dev" ]]; then echo "tag=dev" >> $GITHUB_OUTPUT; fi
          if [[ "$BRANCH" == "test" ]]; then echo "tag=test" >> $GITHUB_OUTPUT; fi
          if [[ "$BRANCH" == "stage" ]]; then echo "tag=stage" >> $GITHUB_OUTPUT; fi
          if [[ "$BRANCH" == "master" ]]; then echo "tag=latest" >> $GITHUB_OUTPUT; fi

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build & Push Image
        run: |
          IMAGE=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ steps.vars.outputs.tag }}

          docker build \
            --build-arg NEXT_PUBLIC_API_URL="${{ secrets.NEXT_PUBLIC_API_URL }}" \
            --build-arg NEXTAUTH_SECRET="${{ secrets.NEXTAUTH_SECRET }}" \
            -t $IMAGE .

          docker push $IMAGE

      - name: SSH Setup
        uses: shimataro/ssh-key-action@v2
        with:
          key: ${{ secrets.DEPLOY_SSH_PRIVATE_KEY }}
          known_hosts: ${{ secrets.SSH_KNOWN_HOSTS }}

      - name: Deploy to VPS
        run: |
          BRANCH="${GITHUB_REF##*/}"

          if [[ "$BRANCH" == "test" ]]; then
            TARGET_DIR="eventsmap-test"
            COMPOSE_FILE="podman-compose.test.yml"
            TAG="test"
          elif [[ "$BRANCH" == "stage" ]]; then
            TARGET_DIR="eventsmap-stage"
            COMPOSE_FILE="podman-compose.stage.yml"
            TAG="stage"
          elif [[ "$BRANCH" == "master" ]]; then
            TARGET_DIR="eventsmap-prod"
            COMPOSE_FILE="podman-compose.prod.yml"
            TAG="latest"
          else
            exit 0
          fi

          # Upload compose file
          scp -P ${{ secrets.DEPLOY_PORT }} $COMPOSE_FILE \
            ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_SERVER }}:/home/minaxi/$TARGET_DIR/

          # Upload .env
          ssh -p ${{ secrets.DEPLOY_PORT }} ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_SERVER }} "
            echo 'NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL }}' > /home/minaxi/$TARGET_DIR/.env &&
            echo 'NEXTAUTH_SECRET=${{ secrets.NEXTAUTH_SECRET }}' >> /home/minaxi/$TARGET_DIR/.env
          "

          # Login GHCR on server
          ssh -p ${{ secrets.DEPLOY_PORT }} \
            ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_SERVER }} "
              echo '${{ secrets.GHCR_PAT }}' | podman login ghcr.io \
                -u ${{ github.actor }} --password-stdin
            "

          # Run deployment
          ssh -p ${{ secrets.DEPLOY_PORT }} \
            ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_SERVER }} "
              cd /home/minaxi/$TARGET_DIR &&
              podman pull ghcr.io/${{ env.IMAGE_NAME }}:$TAG &&
              podman-compose -f $COMPOSE_FILE up -d --force-recreate
            "
```

----------

# 🧪 8. Testing the Deployment

### Test environment:

```
http://SERVER_IP:3001
```

### Stage environment:

```
http://SERVER_IP:3002
```

### Production environment:

```
http://SERVER_IP:3000
```

----------

# 🛠️ 9. Common Troubleshooting

### ❌ Port not opening

→ Check firewall or Podman bind address  
→ Ensure container logs: `podman logs <container>`

### ❌ GHCR pull denied

→ PAT must have scopes:

```
read:packages
write:packages
delete:packages
```

### ❌ Deployment not triggered

→ Check branch rules & GitHub Environment protection rules.

----------

#  10. Summary for Developers

1.  Push code to **dev** → no deployment
    
2.  Push code to **test** → automatic deployment
    
3.  Push code to **stage** → must approve in GitHub
    
4.  Push to **master** → must approve, then production updates
    
5.  No .env files in repo
    
6.  Podman automatically restarts containers
----------
