# ScoutVision AWS EC2 Deployment Guide

This guide walks you through deploying ScoutVision to an AWS EC2 instance using Docker Compose and GitHub Actions CI/CD.

---

## 1. Launch AWS EC2 Instance

1. Go to [AWS Management Console](https://console.aws.amazon.com/ec2).
2. Click **Launch Instance**.
3. **Name**: `ScoutVision-Server`
4. **OS Image**: **Ubuntu Server 24.04 LTS (or 22.04 LTS)** (64-bit x86).
5. **Instance Type**:
   - `t3.small` (2 vCPU, 2 GB RAM) - **Recommended** for building Next.js and running MongoDB smoothly.
   - `t2.micro` (1 vCPU, 1 GB RAM) - Free tier eligible (if using t2.micro, enable a 2GB swap space).
6. **Key pair**: Create or select an existing key pair (e.g. `scoutvision-key.pem`). Download and keep this file safe!
7. **Network settings (Security Group)**:
   Ensure these inbound rules are allowed:
   | Type | Port Range | Source | Purpose |
   |---|---|---|---|
   | SSH | 22 | My IP (or 0.0.0.0/0) | SSH Access / GitHub Actions |
   | HTTP | 80 | 0.0.0.0/0 | Web Traffic |
   | Custom TCP | 3000 | 0.0.0.0/0 | ScoutVision Frontend |
   | Custom TCP | 5000 | 0.0.0.0/0 | ScoutVision Backend API |
   | Custom TCP | 8081 | 0.0.0.0/0 | Mongo Express Dashboard (Optional) |
8. **Storage**: 20 GB gp3 (Recommended).
9. Click **Launch Instance**.

---

## 2. One-Time Setup on EC2 (Install Docker)

Connect to your EC2 instance via SSH:
```bash
ssh -i /path/to/scoutvision-key.pem ubuntu@<YOUR-EC2-PUBLIC-IP>
```

Run these commands to install Docker and Git:
```bash
# 1. Update packages
sudo apt update && sudo apt upgrade -y

# 2. Install Docker & Docker Compose plugin
sudo apt install -y docker.io docker-compose-v2 git

# 3. Add ubuntu user to docker group (so docker can run without sudo)
sudo usermod -aG docker ubuntu
newgrp docker

# 4. (Optional for t2.micro) Add 2GB Swap space to prevent out-of-memory during builds:
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 5. Verify Docker works:
docker --version
docker compose version
```

---

## 3. Configure GitHub Repository Secrets

To enable automated deployment on every `git push`, add your EC2 details to GitHub:

1. Open your repository: **https://github.com/omkar0501/ScoutVision**
2. Go to **Settings** > **Secrets and variables** > **Actions**.
3. Click **New repository secret** and add the following 3 secrets:

| Secret Name | Value |
|---|---|
| `EC2_HOST` | Your EC2 Public IPv4 address (e.g. `13.233.15.72` or Public DNS) |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | The entire content of your downloaded `.pem` private key file (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`) |

---

## 4. How the CI/CD Pipeline Works

Every time you push code to GitHub:
```bash
git add .
git commit -m "feat: your new feature"
git push origin main
```

1. **Continuous Integration (CI)**:
   - GitHub Actions automatically spins up an Ubuntu environment.
   - Installs dependencies and verifies `npm run build` for both **Frontend** and **Backend**.
2. **Continuous Deployment (CD)**:
   - If build tests pass, GitHub Actions connects securely to your EC2 instance via SSH.
   - Pulls the newest code from `main`.
   - Runs `docker compose up --build -d` without downtime.
   - Cleans up old Docker images.
3. Your application is immediately updated live at:
   - **Frontend**: `http://<YOUR-EC2-PUBLIC-IP>:3000`
   - **Backend API**: `http://<YOUR-EC2-PUBLIC-IP>:5000/api`
   - **Mongo Express**: `http://<YOUR-EC2-PUBLIC-IP>:8081`
