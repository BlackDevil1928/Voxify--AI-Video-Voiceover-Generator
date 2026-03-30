# Voxify - AI Video Voiceover Generator

![Voxify Logo Placeholder](https://via.placeholder.com/800x200/18181B/14b8a6?text=Voxify+-+AI+Video+Voiceover+Generator)

Voxify is a production-ready, full-stack web application that allows users to seamlessly upload a video and automatically generate a professional, perfectly-timed AI voiceover synchronized with the visual content.

By combining the power of Hugging Face for dynamic script generation and Murf AI for ultra-realistic speech synthesis, Voxify delivers studio-quality voiceovers without the need for manual scriptwriting, recording, or audio engineering.

---

## ✨ Features

- **Upload & Preview**: Drag-and-drop interface for MP4 video uploads with instant preview.
- **Smart Context Generation**: Provide a brief topic, and the AI automatically writes a punchy, perfectly timed script using **Hugging Face** models.
- **Customizable Tones**: Select from various script tones including Professional, Excited, Storytelling, YouTube, Ad, or Documentary.
- **Multi-lingual Voice Synthesis**: Powered by **Murf AI**, choose from high-quality English (US/UK) and Hindi neural voices (Male/Female).
- **Automated Audio Merging**: Bundled `ffmpeg-static` automatically processes the video on the backend, accurately overlaying the generated audio track onto the video.
- **Before/After Comparison**: Side-by-side interactive UI to compare the original video with the newly generated AI voiceover.
- **Dark-mode Modern UI**: Built with React, Vite, and Tailwind CSS using a sleek, glassmorphic aesthetic.

---

## 🛠️ Tech Stack

**Frontend**
- React.js + Vite
- Tailwind CSS
- Axios

**Backend**
- Node.js + Express.js
- `fluent-ffmpeg` + `ffmpeg-static` + `ffprobe-static`
- Multer (File Uploads)
- `@huggingface/inference` (Script Generation)
- Murf AI API (Voice Generation)

---

## 🚀 Local Development Setup

Follow these steps to get Voxify running on your local machine.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- API Keys:
  - **Hugging Face Token**: Get one at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens). Ensure it has the "Make calls to Inference Providers" permission enabled.
  - **Murf AI Key**: Get your API key from [murf.ai/resources/api](https://murf.ai/resources/api).

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/voxify.git
cd voxify
```

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory based on the `.env.example`:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
HUGGINGFACE_API_TOKEN=your_hf_token_here
MURF_API_KEY=your_murf_api_key_here
```

Start the backend development server:
```bash
npm run dev
```

### 4. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (if needed):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

### 5. Access the App
Open your browser and navigate to `http://localhost:5173`. You can now drag and drop a video to generate your first AI voiceover!

---

## 📖 Deployment

Ready to take Voxify live? See the comprehensive [Deployment Guide](DEPLOYMENT.md) for step-by-step instructions on hosting the frontend on Vercel and the backend on Render.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
