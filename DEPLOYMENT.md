# 🚀 Serverless Deployment Guide for Voxify

Deploying Voxify requires hosting the React frontend and the Express Node.js backend separately. We recommend **Vercel** for the frontend and **Render** for the backend, as they offer excellent free tiers and seamless CI/CD integration.

---

## 1. Deploying the Backend on Render

The backend handles file uploads, video processing with FFmpeg, and API calls to Hugging Face and Murf AI. It requires a Node.js environment.

### Prerequisites
- A GitHub account.
- A free account on [Render](https://render.com/).

### Steps
1. Push your entire `voxify` codebase (both `frontend` and `backend` folders) to a GitHub repository.
2. Log into your Render dashboard and click **New+** -> **Web Service**.
3. Connect your GitHub account and select your `voxify` repository.
4. Configure the Web Service:
   - **Name**: `voxify-backend`
   - **Root Directory**: `backend` (This is crucial!)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Scroll down to **Environment Variables** and add the following:
   - `HUGGINGFACE_API_TOKEN` = `your_hf_token_here`
   - `MURF_API_KEY` = `your_murf_key_here`
   - `NODE_ENV` = `production`
   - *(Optional)* Set `FRONTEND_URL` to your future Vercel domain later to restrict CORS.
6. Click **Create Web Service**.
7. Wait typically 2-3 minutes for the build to finish. Once live, copy your backend URL (e.g., `https://voxify-backend.onrender.com`).

> **Note on Free Tiers**: Render's free tier spins down the server after 15 minutes of inactivity. When a user uploads a video after a period of inactivity, the first request might take 30-50 seconds as the server wakes up.

---

## 2. Deploying the Frontend on Vercel

The frontend is a lightweight React + Vite + Tailwind application.

### Prerequisites
- A free account on [Vercel](https://vercel.com/).
- The backend URL you just obtained from Render.

### Steps
1. Log into Vercel and click **Add New** -> **Project**.
2. Import your `voxify` GitHub repository.
3. Configure the Project:
   - **Project Name**: `voxify`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and change it to `frontend`.
4. Open the **Environment Variables** tab and add:
   - `VITE_API_URL` = `https://voxify-backend.onrender.com/api` (Replace with your actual Render URL)
5. Click **Deploy**.
6. Vercel will install dependencies, build the React app, and deploy it globally to their CDN.
7. Once finished, Vercel will provide your live URL (e.g., `https://voxify.vercel.app`).

### Post-Deployment Step
Head back to your **Render** dashboard, go to your `voxify-backend` service, and update the `FRONTEND_URL` environment variable to match your new Vercel domain. This secures your backend so it only accepts requests from your frontend.

---

## 3. (Optional) Enabling Firebase Storage

By default, Voxify stores processed videos directly on the backend server's local filesystem (`backend/uploads`).
On services like Render, the local disk is wiped upon every new deployment or restart. If you want persistent video storage, you should enable Firebase.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Firebase Storage** in the Build menu.
3. Go to **Project Settings** -> **Service accounts** and generate a new private key. This downloads a `.json` file.
4. Convert the contents of that JSON file into environment variables, or upload the `serviceAccountKey.json` securely to your server.
5. In your backend `.env` (or Render dashboard), configure the Firebase variables:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_STORAGE_BUCKET` (e.g., `your-project.appspot.com`)
6. Restart the backend server. The `videoController.js` will automatically detect the bucket and upload final videos to Firebase, returning a permanent cloud URL to the user!

---

🎉 **Congratulations! Voxify is now live and accessible to users worldwide.**
