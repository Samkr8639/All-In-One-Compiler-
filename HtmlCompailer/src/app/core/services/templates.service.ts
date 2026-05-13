import { Injectable } from '@angular/core';
import { Template } from '../../shared/models/editor-state.model';

@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private templates: Template[] = [
    {
      slug: 'hello-world',
      name: 'Hello World',
      description: 'A simple Hello World starter template to get you started with HTML.',
      category: 'Basics',
      html: '<div class="container">\n  <h1>Hello, World! 🌍</h1>\n  <p>Welcome to CodeCanvas — your free online HTML compiler.</p>\n  <button id="btn">Click Me</button>\n  <p id="output"></p>\n</div>',
      css: '* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: "Inter", sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; }\n.container { text-align: center; padding: 2rem; }\nh1 { font-size: 3rem; margin-bottom: 1rem; }\np { font-size: 1.2rem; margin-bottom: 1.5rem; }\nbutton { padding: 12px 32px; font-size: 1rem; border: none; border-radius: 8px; background: #fff; color: #764ba2; cursor: pointer; font-weight: 600; transition: transform 0.2s; }\nbutton:hover { transform: scale(1.05); }',
      js: 'document.getElementById("btn").addEventListener("click", function() {\n  document.getElementById("output").textContent = "You clicked the button! 🎉";\n});'
    },
    {
      slug: 'flexbox-layout',
      name: 'Flexbox Layout',
      description: 'Learn CSS Flexbox with this interactive layout demo.',
      category: 'CSS',
      html: '<div class="flex-container">\n  <div class="box">1</div>\n  <div class="box">2</div>\n  <div class="box">3</div>\n  <div class="box">4</div>\n  <div class="box">5</div>\n</div>',
      css: 'body { font-family: "Inter", sans-serif; background: #0f0f23; padding: 2rem; }\n.flex-container { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; padding: 2rem; }\n.box { width: 120px; height: 120px; background: linear-gradient(135deg, #f093fb, #f5576c); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; color: #fff; transition: transform 0.3s, box-shadow 0.3s; cursor: pointer; }\n.box:hover { transform: translateY(-8px) scale(1.05); box-shadow: 0 20px 40px rgba(245,87,108,0.3); }',
      js: 'document.querySelectorAll(".box").forEach(function(box) {\n  box.addEventListener("click", function() {\n    this.style.background = "linear-gradient(135deg, #4facfe, #00f2fe)";\n  });\n});'
    },
    {
      slug: 'css-animation',
      name: 'CSS Animation',
      description: 'Beautiful CSS animations with keyframes and transitions.',
      category: 'CSS',
      html: '<div class="scene">\n  <div class="cube">\n    <div class="face front">▶</div>\n    <div class="face back">◀</div>\n    <div class="face top">▲</div>\n    <div class="face bottom">▼</div>\n  </div>\n  <p class="label">CSS 3D Cube Animation</p>\n</div>',
      css: 'body { background: #1a1a2e; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: "Inter", sans-serif; }\n.scene { perspective: 600px; text-align: center; }\n.cube { width: 100px; height: 100px; position: relative; transform-style: preserve-3d; animation: spin 4s infinite linear; margin: 40px auto; }\n.face { position: absolute; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #fff; border: 2px solid rgba(255,255,255,0.2); border-radius: 8px; }\n.front { background: rgba(102,126,234,0.8); transform: translateZ(50px); }\n.back { background: rgba(118,75,162,0.8); transform: rotateY(180deg) translateZ(50px); }\n.top { background: rgba(240,147,251,0.8); transform: rotateX(90deg) translateZ(50px); }\n.bottom { background: rgba(245,87,108,0.8); transform: rotateX(-90deg) translateZ(50px); }\n@keyframes spin { to { transform: rotateX(360deg) rotateY(360deg); } }\n.label { color: #aaa; margin-top: 2rem; font-size: 1.1rem; }',
      js: 'console.log("CSS 3D Cube Animation loaded!");'
    },
    {
      slug: 'form-validation',
      name: 'Form with Validation',
      description: 'HTML form with real-time JavaScript validation.',
      category: 'Forms',
      html: '<div class="form-card">\n  <h2>Sign Up</h2>\n  <form id="signup">\n    <div class="field">\n      <label>Name</label>\n      <input type="text" id="name" placeholder="John Doe">\n      <span class="error" id="nameErr"></span>\n    </div>\n    <div class="field">\n      <label>Email</label>\n      <input type="email" id="email" placeholder="john@example.com">\n      <span class="error" id="emailErr"></span>\n    </div>\n    <div class="field">\n      <label>Password</label>\n      <input type="password" id="pass" placeholder="Min 6 characters">\n      <span class="error" id="passErr"></span>\n    </div>\n    <button type="submit">Create Account</button>\n  </form>\n</div>',
      css: 'body { font-family: "Inter", sans-serif; background: #0f172a; display: flex; justify-content: center; align-items: center; min-height: 100vh; }\n.form-card { background: #1e293b; padding: 2.5rem; border-radius: 16px; width: 380px; box-shadow: 0 25px 50px rgba(0,0,0,0.3); }\nh2 { color: #f1f5f9; margin-bottom: 1.5rem; font-size: 1.5rem; }\n.field { margin-bottom: 1.2rem; }\nlabel { display: block; color: #94a3b8; margin-bottom: 0.4rem; font-size: 0.9rem; }\ninput { width: 100%; padding: 10px 14px; border: 2px solid #334155; border-radius: 8px; background: #0f172a; color: #f1f5f9; font-size: 1rem; outline: none; transition: border-color 0.3s; }\ninput:focus { border-color: #6366f1; }\n.error { color: #f87171; font-size: 0.8rem; margin-top: 4px; display: block; min-height: 1.2em; }\nbutton { width: 100%; padding: 12px; border: none; border-radius: 8px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-size: 1rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }\nbutton:hover { opacity: 0.9; }',
      js: 'document.getElementById("signup").addEventListener("submit", function(e) {\n  e.preventDefault();\n  let valid = true;\n  const name = document.getElementById("name");\n  const email = document.getElementById("email");\n  const pass = document.getElementById("pass");\n  document.getElementById("nameErr").textContent = "";\n  document.getElementById("emailErr").textContent = "";\n  document.getElementById("passErr").textContent = "";\n  if (!name.value.trim()) { document.getElementById("nameErr").textContent = "Name is required"; valid = false; }\n  if (!/^[^@]+@[^@]+\\.[^@]+$/.test(email.value)) { document.getElementById("emailErr").textContent = "Invalid email"; valid = false; }\n  if (pass.value.length < 6) { document.getElementById("passErr").textContent = "Min 6 characters"; valid = false; }\n  if (valid) { alert("Account created successfully! 🎉"); }\n});'
    },
    {
      slug: 'fetch-api',
      name: 'Fetch API Demo',
      description: 'Fetch data from an API and display it dynamically.',
      category: 'JavaScript',
      html: '<div class="app">\n  <h1>🐶 Random Dog</h1>\n  <button id="fetchBtn">Get Dog Image</button>\n  <div id="result" class="result"></div>\n</div>',
      css: 'body { font-family: "Inter", sans-serif; background: #0c0c1d; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; }\n.app { text-align: center; padding: 2rem; }\nh1 { font-size: 2rem; margin-bottom: 1rem; }\nbutton { padding: 12px 32px; border: none; border-radius: 8px; background: linear-gradient(135deg, #f093fb, #f5576c); color: #fff; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s; }\nbutton:hover { transform: scale(1.05); }\n.result { margin-top: 1.5rem; }\n.result img { max-width: 300px; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }',
      js: 'document.getElementById("fetchBtn").addEventListener("click", async function() {\n  try {\n    const res = await fetch("https://dog.ceo/api/breeds/image/random");\n    const data = await res.json();\n    document.getElementById("result").innerHTML = \'<img src="\' + data.message + \'" alt="Random Dog">\';\n    console.log("Fetched:", data.message);\n  } catch(err) {\n    console.error("Fetch failed:", err.message);\n  }\n});'
    },
    {
      slug: 'css-grid',
      name: 'CSS Grid Layout',
      description: 'Master CSS Grid with this visual layout demo.',
      category: 'CSS',
      html: '<div class="grid">\n  <div class="item header">Header</div>\n  <div class="item sidebar">Sidebar</div>\n  <div class="item main">Main Content</div>\n  <div class="item widget">Widget</div>\n  <div class="item footer">Footer</div>\n</div>',
      css: 'body { font-family: "Inter", sans-serif; background: #0d1117; padding: 2rem; }\n.grid { display: grid; grid-template-columns: 200px 1fr 200px; grid-template-rows: auto 1fr auto; gap: 1rem; min-height: 80vh; }\n.item { padding: 1.5rem; border-radius: 12px; color: #fff; font-weight: 600; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }\n.header { grid-column: 1 / -1; background: linear-gradient(135deg, #667eea, #764ba2); }\n.sidebar { background: rgba(99,102,241,0.3); border: 1px solid rgba(99,102,241,0.5); }\n.main { background: rgba(139,92,246,0.2); border: 1px solid rgba(139,92,246,0.4); }\n.widget { background: rgba(236,72,153,0.3); border: 1px solid rgba(236,72,153,0.5); }\n.footer { grid-column: 1 / -1; background: linear-gradient(135deg, #f093fb, #f5576c); }',
      js: 'console.log("CSS Grid Layout loaded!");'
    },
    {
      slug: 'todo-app',
      name: 'Todo App',
      description: 'A simple interactive Todo application with add and delete.',
      category: 'JavaScript',
      html: '<div class="todo-app">\n  <h1>📝 Todo List</h1>\n  <div class="input-row">\n    <input type="text" id="todoInput" placeholder="Add a task...">\n    <button id="addBtn">Add</button>\n  </div>\n  <ul id="todoList"></ul>\n</div>',
      css: 'body { font-family: "Inter", sans-serif; background: #0f172a; display: flex; justify-content: center; align-items: flex-start; padding-top: 3rem; min-height: 100vh; }\n.todo-app { background: #1e293b; padding: 2rem; border-radius: 16px; width: 400px; box-shadow: 0 25px 50px rgba(0,0,0,0.3); }\nh1 { color: #f1f5f9; margin-bottom: 1.5rem; }\n.input-row { display: flex; gap: 0.5rem; margin-bottom: 1rem; }\ninput { flex: 1; padding: 10px 14px; border: 2px solid #334155; border-radius: 8px; background: #0f172a; color: #f1f5f9; font-size: 1rem; outline: none; }\ninput:focus { border-color: #6366f1; }\n.input-row button { padding: 10px 20px; border: none; border-radius: 8px; background: #6366f1; color: #fff; font-weight: 600; cursor: pointer; }\nul { list-style: none; padding: 0; }\nli { display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 8px; background: #0f172a; border-radius: 8px; color: #e2e8f0; }\nli .del { background: none; border: none; color: #f87171; cursor: pointer; font-size: 1.2rem; }',
      js: 'const input = document.getElementById("todoInput");\nconst list = document.getElementById("todoList");\ndocument.getElementById("addBtn").addEventListener("click", addTodo);\ninput.addEventListener("keypress", function(e) { if(e.key === "Enter") addTodo(); });\nfunction addTodo() {\n  const text = input.value.trim();\n  if (!text) return;\n  const li = document.createElement("li");\n  li.innerHTML = \'<span>\' + text + \'</span><button class="del">✕</button>\';\n  li.querySelector(".del").addEventListener("click", function() { li.remove(); });\n  list.appendChild(li);\n  input.value = "";\n  console.log("Added:", text);\n}'
    },
    {
      slug: 'dark-mode',
      name: 'Dark Mode Toggle',
      description: 'Implement a dark/light mode toggle with CSS variables.',
      category: 'CSS',
      html: '<div class="card">\n  <h1>🌗 Theme Toggle</h1>\n  <p>Click the button to switch themes.</p>\n  <button id="themeBtn">Toggle Theme</button>\n</div>',
      css: ':root { --bg: #0f172a; --card-bg: #1e293b; --text: #f1f5f9; --accent: #6366f1; }\n.light { --bg: #f8fafc; --card-bg: #ffffff; --text: #0f172a; --accent: #6366f1; }\nbody { font-family: "Inter", sans-serif; background: var(--bg); display: flex; justify-content: center; align-items: center; min-height: 100vh; transition: background 0.3s; }\n.card { background: var(--card-bg); color: var(--text); padding: 3rem; border-radius: 16px; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.15); transition: all 0.3s; }\nh1 { margin-bottom: 1rem; }\np { margin-bottom: 1.5rem; }\nbutton { padding: 12px 32px; border: none; border-radius: 8px; background: var(--accent); color: #fff; font-size: 1rem; font-weight: 600; cursor: pointer; }',
      js: 'document.getElementById("themeBtn").addEventListener("click", function() {\n  document.body.classList.toggle("light");\n  console.log("Theme toggled!");\n});'
    },
    {
      slug: 'countdown-timer',
      name: 'Countdown Timer',
      description: 'A beautiful countdown timer with start/stop functionality.',
      category: 'JavaScript',
      html: '<div class="timer-app">\n  <h1>⏱️ Countdown</h1>\n  <div class="display" id="display">00:30</div>\n  <div class="controls">\n    <button id="startBtn">Start</button>\n    <button id="resetBtn">Reset</button>\n  </div>\n</div>',
      css: 'body { font-family: "Inter", sans-serif; background: #0c0c1d; display: flex; justify-content: center; align-items: center; min-height: 100vh; }\n.timer-app { text-align: center; }\nh1 { color: #fff; margin-bottom: 2rem; font-size: 2rem; }\n.display { font-size: 5rem; font-weight: 700; color: #6366f1; margin-bottom: 2rem; font-variant-numeric: tabular-nums; text-shadow: 0 0 40px rgba(99,102,241,0.4); }\n.controls { display: flex; gap: 1rem; justify-content: center; }\nbutton { padding: 12px 32px; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s; }\n#startBtn { background: #6366f1; color: #fff; }\n#resetBtn { background: #334155; color: #e2e8f0; }\nbutton:hover { transform: scale(1.05); }',
      js: 'let time = 30, interval = null, running = false;\nconst display = document.getElementById("display");\nconst startBtn = document.getElementById("startBtn");\nfunction update() { const m = String(Math.floor(time/60)).padStart(2,"0"); const s = String(time%60).padStart(2,"0"); display.textContent = m+":"+s; }\nstartBtn.addEventListener("click", function() {\n  if (running) { clearInterval(interval); startBtn.textContent = "Start"; running = false; }\n  else { interval = setInterval(function() { if(time>0){time--;update();}else{clearInterval(interval);running=false;startBtn.textContent="Start";console.log("Time is up!");} }, 1000); startBtn.textContent = "Pause"; running = true; }\n});\ndocument.getElementById("resetBtn").addEventListener("click", function() { clearInterval(interval); running = false; time = 30; update(); startBtn.textContent = "Start"; });'
    },
    {
      slug: 'landing-page',
      name: 'Landing Page',
      description: 'A modern landing page template with hero section.',
      category: 'Layout',
      html: '<nav>\n  <div class="logo">Brand</div>\n  <div class="nav-links"><a href="#">Home</a><a href="#">About</a><a href="#">Contact</a></div>\n</nav>\n<section class="hero">\n  <h1>Build Amazing Things</h1>\n  <p>The all-in-one platform for modern developers.</p>\n  <button>Get Started Free</button>\n</section>',
      css: '* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: "Inter", sans-serif; background: #0f172a; color: #f1f5f9; }\nnav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 3rem; }\n.logo { font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }\n.nav-links a { color: #94a3b8; text-decoration: none; margin-left: 2rem; transition: color 0.3s; }\n.nav-links a:hover { color: #fff; }\n.hero { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 80vh; padding: 2rem; }\n.hero h1 { font-size: 4rem; font-weight: 800; margin-bottom: 1rem; background: linear-gradient(135deg, #6366f1, #ec4899, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }\n.hero p { font-size: 1.3rem; color: #94a3b8; margin-bottom: 2rem; max-width: 500px; }\n.hero button { padding: 14px 40px; border: none; border-radius: 10px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }\n.hero button:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(99,102,241,0.3); }',
      js: 'console.log("Landing page loaded!");'
    }
  ];

  getAll(): Template[] {
    return this.templates;
  }

  getBySlug(slug: string): Template | undefined {
    return this.templates.find(t => t.slug === slug);
  }

  getCategories(): string[] {
    return [...new Set(this.templates.map(t => t.category))];
  }
}
