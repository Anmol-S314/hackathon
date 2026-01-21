# 🚀 Deployment Guide for VexStorm 26 (Render.com)

You can deploy both your **Frontend** and **Backend** on Render for free. I've added a `render.yaml` file to your project to make this as easy as possible.

## 🏗️ Deployment Steps

### 1. Push Code to GitHub
Ensure all your changes are committed and pushed to your GitHub repository.

### 2. Connect to Render
1.  Go to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **"New"** -> **"Blueprint"**.
3.  Connect your GitHub repository.
4.  Render will automatically detect the `render.yaml` file and prepare two services:
    -   `vexstorm-backend` (Web Service)
    -   `vexstorm-frontend` (Static Site)

### 3. Configure Environment Variables
Before clicking "Apply", you need to fill in the environment variables in the Render Dashboard (under the **Environment** tab of each service):

#### For `vexstorm-backend`:
-   `GOOGLE_SHEET_ID`
-   `GOOGLE_CLIENT_EMAIL`
-   `GOOGLE_PRIVATE_KEY` (Paste the whole key from `.env.local`)
-   `SUPABASE_URL`
-   `SUPABASE_SERVICE_ROLE_KEY`
-   `RESEND_API_KEY`
-   `CLIENT_URL`: Point this to your **Frontend URL** (you'll get this after the frontend deploys).

#### For `vexstorm-frontend`:
-   `VITE_API_URL`: Point this to your **Backend URL** (e.g., `https://vexstorm-backend.onrender.com`).

### 4. Apply & Deploy
1. Click **Apply**.
2. Render will build and deploy both services.
3. Once the **Backend** is live, copy its URL and paste it into the `VITE_API_URL` of the **Frontend** settings.
4. Once the **Frontend** is live, copy its URL and paste it into the `CLIENT_URL` of the **Backend** settings.

✅ **Done!** Your app is live on Render.

---

### 💡 Why Render?
-   **Free Tier**: Both Static Sites and Web Services have generous free tiers.
-   **Auto-Healing**: Render restarts your server if it crashes.
-   **Unified Dashboard**: Manage frontend and backend in one place.
-   **SSL**: HTTPS is provided automatically.

*Note: The free tier of the backend web service will "sleep" after 15 minutes of inactivity. The first request after a sleep period might take ~30 seconds to wake up.*
