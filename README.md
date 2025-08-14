<div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
  <img src="app/src/assets/logo.png" alt="Code Collab Logo" width="120" style="margin-right: 20px;"/>
  <h1 style="margin: 0;">Code Collab</h1>
</div>

# 🚀 Code Collab - Real-time Collaborative Coding Platform

**Code Collab is Google Meet but for Code** - A powerful real-time collaborative development platform where teams can edit code, chat, and video call in shared project rooms.

---

## ✨ **Latest Updates & Improvements**

### 🎯 **Terminal & Code Execution**
- ✅ **Fully Functional Terminal** - Write and execute commands like VS Code
- ✅ **Run Button** - Execute JavaScript, Python, TypeScript code directly
- ✅ **Command History** - Navigate through previous commands with arrow keys
- ✅ **Auto-completion** - Tab completion for better productivity
- ✅ **Real-time Output** - See execution results instantly

### 🗂️ **File & Folder Management**
- ✅ **Folder Creation** - Create nested folder structures
- ✅ **File Operations** - Create, rename, delete files and folders
- ✅ **Terminal Integration** - Use `mkdir`, `touch`, `rm` commands
- ✅ **Visual File Explorer** - Intuitive file tree navigation

### 🎨 **UI/UX Enhancements**
- ✅ **Beautiful Login Form** - Glassmorphism design with animations
- ✅ **Glow Effects** - Professional hover animations on features
- ✅ **Modern Design** - Gradient backgrounds and smooth transitions
- ✅ **Responsive Layout** - Works perfectly on all devices

### ⚡ **Performance Optimizations**
- ✅ **Faster Loading** - Optimized bundle size and caching
- ✅ **Service Worker** - Offline capabilities and faster subsequent loads
- ✅ **PWA Support** - Install as native app on mobile/desktop
- ✅ **Resource Preloading** - Critical resources loaded first

---

## 🎯 **Key Features**

### 🔥 **Real-time Collaboration**
- **Live Code Editing** - See changes as they happen
- **Multi-cursor Support** - Multiple users can edit simultaneously
- **Cursor Tracking** - See where your teammates are working
- **Conflict Resolution** - Smart merging of concurrent changes

### 🎥 **Communication Tools**
- **Video Calls** - Built-in WebRTC video conferencing
- **Audio Calls** - Crystal clear voice communication
- **Live Chat** - Instant messaging with code snippets
- **Screen Sharing** - Share your screen with the team

### 🛠️ **Developer Experience**
- **VS Code-like Editor** - Familiar interface with syntax highlighting
- **Multiple Languages** - Support for JavaScript, TypeScript, Python, etc.
- **Terminal Integration** - Full command-line access
- **File Management** - Create, edit, and organize project files

### 🔒 **Security & Privacy**
- **End-to-End Encryption** - Secure data transmission
- **Room-based Access** - Control who can join your sessions
- **Authentication** - Secure login with NextAuth.js
- **Data Privacy** - Your code stays private

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- MongoDB
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/code-collab.git
cd code-collab
```

2. **Install dependencies**
```bash
cd app
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. **Start the development server**
```bash
npm run dev
```

5. **Start the socket server** (in a new terminal)
```bash
cd ../socket
npm install
npm start
```

Visit `http://localhost:3000` to start collaborating!

---

## 🎮 **How to Use**

### **1. Create a Room**
- Sign up/Login to your account
- Click "Create New Room" 
- Share the room link with your team

### **2. Start Coding**
- Create files using the file explorer
- Write code in the collaborative editor
- Use the terminal for commands like `npm install`

### **3. Run Code**
- Click the ▶️ "Run" button to execute JavaScript/Python
- Use the terminal for more complex commands
- See real-time output and results

### **4. Collaborate**
- Invite teammates via the room link
- Chat in real-time using the chat panel
- Start video calls for face-to-face communication

---

## 🛠️ **Tech Stack**

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, Shadcn UI |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | NextAuth.js |
| **Real-time** | Socket.IO, WebRTC |
| **Code Editor** | Monaco Editor (VS Code) |
| **Terminal** | xterm.js |
| **Performance** | Service Worker, PWA |

---

## 📱 **PWA Features**

- **Install as App** - Add to home screen on mobile/desktop
- **Offline Support** - Cache important resources
- **Push Notifications** - Get notified of room activities
- **Background Sync** - Sync changes when online

---

## 🔧 **Performance Optimizations**

### **Bundle Optimization**
- Tree shaking for unused code
- Code splitting by routes
- Optimized imports for large libraries
- Compression and minification

### **Caching Strategy**
- Service Worker for offline caching
- Static asset caching
- API response caching
- Browser-level optimizations

### **Loading Performance**
- Resource preloading
- Critical CSS inlining
- Image optimization
- Font optimization

---

## 🎨 **UI Components**

### **Modern Design System**
- Glassmorphism effects
- Gradient backgrounds
- Smooth animations
- Responsive layouts
- Dark theme optimized

### **Interactive Elements**
- Hover effects with glow
- Loading states
- Toast notifications
- Modal dialogs
- Custom buttons

---

## 🔒 **Security Features**

- **Authentication** - Secure user login
- **Authorization** - Room-based access control
- **Data Encryption** - End-to-end encryption
- **Input Validation** - Sanitized user inputs
- **Rate Limiting** - API protection

---

## 📊 **Monitoring & Analytics**

- **Performance Monitoring** - Page load times
- **Error Tracking** - Real-time error reporting
- **User Analytics** - Usage patterns
- **Server Monitoring** - Health checks

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Socket.IO](https://socket.io/) - Real-time communication
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - UI components

---

## 📞 **Support**

- **Documentation**: [docs.code-collab.com](https://docs.code-collab.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/code-collab/issues)
- **Discord**: [Join our community](https://discord.gg/code-collab)
- **Email**: support@code-collab.com

---

<div align="center">
  <p>Made with ❤️ by the Code Collab Team</p>
  <p>Star this repo if you found it helpful!</p>
</div>

