# How to Update Your Code on GitHub

Whenever you make changes to your code (edit files, fix bugs, add features), follow these 3 simple steps to update your GitHub repository:

### 1. Add your changes
This tells Git to track the new modifications.
```bash
git add .
```

### 2. Commit your changes
This saves a "snapshot" of your changes with a message describing what you did.
```bash
git commit -m "Describe your changes here"
```
*Example: `git commit -m "Updated tax logic for bonus"`*

### 3. Push to GitHub
This uploads your saved snapshot to the cloud.
```bash
git push
```

---

### Summary Command
You can run all three in one go:
```bash
git add . && git commit -m "Update code" && git push
```
