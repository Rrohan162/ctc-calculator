# How to Upload to GitHub

## Prerequisites
1.  **Git Installed**: Ensure you have Git installed. Run `git --version` in your terminal. If it asks to install Command Line Tools, say yes.
2.  **GitHub Account**: You need an account on [github.com](https://github.com).

## Steps

### 1. Create a Repository on GitHub
1.  Log in to GitHub.
2.  Click the **+** icon in the top-right corner and select **New repository**.
3.  Name your repository (e.g., `ctc-calculator`).
4.  Choose **Public** or **Private**.
5.  **Do not** check "Initialize this repository with a README/gitignore/license" (since you already have code).
6.  Click **Create repository**.

### 2. Upload Your Code
Open your terminal and run the following commands one by one:

```bash
# Navigate to your project folder
cd "/Users/rohan/Desktop/AntiGravity/CTC Calculator"

# Initialize Git (if not already done)
git init

# Add all files to staging
git add .

# Commit your changes
git commit -m "Initial commit"

# Rename the branch to main
git branch -M main

# Link to your GitHub repository
# REPLACE <YOUR_REPO_URL> with the URL from the GitHub page (e.g., https://github.com/username/ctc-calculator.git)
git remote add origin https://github.com/Rrohan162/ctc-calculator.git

# Push your code
git push -u origin main
```

### 3. Done!
Refresh your GitHub repository page, and you should see your code.
