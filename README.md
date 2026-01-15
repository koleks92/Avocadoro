# 🥑 Avocadoro

**Avocadoro** is a Pomodoro-style productivity app built with **React**, **TypeScript**, **Electron**, and **Supabase**.  
It helps you focus on your study or learning sessions, track breaks, and visualize your progress over time.

---

## 🚀 Features


- ⏱️ **Pomodoro Timer** — Focus and break intervals based on the Pomodoro technique.  
- 📊 **Progress Tracking** — View total study time and completed sessions.  
- 💾 **Data Persistence** — All session data stored securely in **Supabase**.  
- 🖥️ **Cross-Platform App** — Built with **Electron** for desktop use.  
- 🎯 **Custom Goals** — Choose your learning topic and track progress per category.

---

## 🧩 Tech Stack

- **Frontend:** React + TypeScript
- **Backend / Auth / DB:** Supabase
- **Desktop Wrapper:** Electron
- **Testing:** WebdriverIO (WDIO)

---

## 🛠️ Installation & Setup

Follow these steps to get the project running locally:

### 1. Clone the repository
```bash
git clone [https://github.com/koleks92/Avocadoro.git](https://github.com/koleks92/Avocadoro.git)
cd Avocadoro
```

### 2. Install dependencies
```
npm install
```

### 3. Configure Environment Variables

Create a file named ``.env.local`` in the root directory and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here
```

### 4. Run the App
To start the application in development mode:
```
npm run start
```

---

## 🧪 Testing
The project uses WebdriverIO for end-to-end testing to ensure the timer and navigation logic work correctly.

To run the test suite:
```
npm run wdio
```

---

## 📦 Building for Production
To compile the application and create a distributable installer:
```
npm run make
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.