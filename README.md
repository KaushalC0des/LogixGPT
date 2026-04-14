# Logix AI 🤖

A full-stack AI chat application built with the MERN stack, powered by Meta's LLaMA 3.3 70B model via NVIDIA API. Users can sign up, log in, and have intelligent conversations with persistent chat history.

🔗 **Live Demo:** [logix-gpt.vercel.app](https://logix-gpt.vercel.app)

---

## Screenshots

> Login Page | Chat Interface | Mobile View

---

## Features

- 🔐 **User Authentication** — Secure signup, login and logout with JWT
- 🤖 **AI Chat** — Powered by Meta LLaMA 3.3 70B via NVIDIA API
- 💾 **Persistent Chat History** — All conversations saved per user in MongoDB
- 🗂️ **Sidebar** — View, load and delete previous chats
- 🎤 **Voice Input** — Speak instead of type using Web Speech API
- 📜 **Auto Scroll** — Automatically scrolls to latest message
- ⚙️ **User Settings** — View logged-in user info from dropdown
- 📱 **Mobile Responsive** — Hamburger menu with slide-in sidebar
- ✍️ **Typing Animation** — AI responses appear word by word
- 🔒 **Protected Routes** — Unauthenticated users redirected to login

---

## Tech Stack

### Frontend
- React.js + Vite
- React Router DOM
- React Markdown + Rehype Highlight
- React Spinners
- Web Speech API (voice input)
- CSS (custom, fully responsive)

### Backend
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JSON Web Tokens (JWT)
- bcrypt (password hashing)
- NVIDIA API (LLaMA 3.3 70B)
- OpenAI SDK (NVIDIA-compatible)

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## Project Structure

```
LogixGPT/
├── Backend/
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── user.js               # User schema
│   │   └── Thread.js             # Chat thread schema
│   ├── routes/
│   │   ├── auth.js               # Signup, login, /me routes
│   │   └── chat.js               # Chat, thread CRUD routes
│   ├── utils/
│   │   └── ollama.js             # NVIDIA API integration
│   ├── .env                      # Environment variables (not pushed)
│   └── server.js                 # Express app entry point
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx          # Login page
        │   └── Signup.jsx         # Signup page
        ├── App.jsx                # Routes and context provider
        ├── MyContext.jsx          # Global state management
        ├── Sidebar.jsx            # Chat history sidebar
        ├── ChatWindow.jsx         # Main chat interface
        └── Chat.jsx               # Message rendering + typing animation
```

---

## How It Works

### Authentication
1. User signs up → password hashed with bcrypt → saved to MongoDB
2. JWT token created with `userId` → sent to frontend → stored in `localStorage`
3. Every API request sends token in `Authorization` header
4. `authMiddleware` verifies token → attaches `userId` to request
5. Expired/invalid token → redirected to login

### Chat Ownership
Every chat thread is saved with the user's `userId`:
```javascript
{ userId: req.user.userId, threadId, title, messages: [...] }
```
Fetching chats filters by `userId` so users only see their own conversations.

### AI Integration
User message → NVIDIA API (LLaMA 3.3 70B) → AI reply → saved to MongoDB → returned to frontend

---

## Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- NVIDIA API key from [integrate.api.nvidia.com](https://integrate.api.nvidia.com)

### 1. Clone the repository
```bash
git clone https://github.com/KaushalC0des/LogixGPT.git
cd LogixGPT
```

### 2. Setup Backend
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NVIDIA_API_KEY=your_nvidia_api_key
```

Start the backend:
```bash
nodemon server.js
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `NVIDIA_API_KEY` | NVIDIA API key for LLaMA model access |

---

## API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login existing user |
| GET | `/api/auth/me` | Get logged in user info |

### Chat Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message, get AI reply |
| GET | `/api/thread` | Get all threads for user |
| GET | `/api/thread/:threadId` | Get messages in a thread |
| DELETE | `/api/thread/:threadId` | Delete a thread |

---

## Deployment

### Backend (Render)
1. Connect GitHub repo on [render.com](https://render.com)
2. Set Root Directory to `Backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add environment variables in Render dashboard

### Frontend (Vercel)
1. Connect GitHub repo on [vercel.com](https://vercel.com)
2. Set Root Directory to `frontend`
3. Framework: Vite
4. Deploy!

---

## What I Learned

- Building and securing REST APIs with Express.js
- JWT authentication flow end to end
- Password hashing with bcrypt
- MongoDB schema design and querying
- Integrating third party AI APIs
- React state management with Context API
- Mobile responsive design with CSS
- Deploying full stack apps to production
- Debugging real production issues

---

## Author

**Kaushal Gadekar**
- GitHub: [@KaushalC0des](https://github.com/KaushalC0des)
- LinkedIn: https://www.linkedin.com/in/kaushal-gadekar/

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ If you found this project helpful, please give it a star!
