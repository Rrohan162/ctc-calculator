# How to Deploy to Netlify (Automatic Method)

Since you have your code on GitHub, the best way to deploy is to **connect Netlify to your GitHub repository**.

**Why?**
Because once you do this, **every time you run that "git push" command, Netlify will automatically update your live website.** You don't have to do anything else!

### Steps to Setup

1.  **Log in to Netlify**: Go to [app.netlify.com](https://app.netlify.com) and log in.
2.  **Add New Site**: Click **"Add new site"** > **"Import from an existing project"**.
3.  **Connect to GitHub**: Click the **GitHub** button.
    *   *If asked, authorize Netlify to access your GitHub account.*
4.  **Pick Your Repo**: Search for and select **`ctc-calculator`**.
5.  **Configure Build** (Netlify usually detects this automatically):
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
6.  **Deploy**: Click **"Deploy Site"**.

---

### That's it!
Netlify will take about a minute to build your site and give you a live URL (e.g., `random-name-123.netlify.app`).

### How to Update in the Future?
Just run your magic command in the terminal:
```bash
git add . && git commit -m "Update" && git push
```
**Netlify sees the change on GitHub and updates your website automatically.**
