// DARK MODE TOGGLE
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function setDarkMode(enabled) {
  if (enabled) {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  } else {
    body.classList.remove('dark-mode');
    themeToggle.textContent = '🌙';
  }
}

const darkModePref = localStorage.getItem('darkMode') === 'true';
setDarkMode(darkModePref);

themeToggle.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark-mode');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('darkMode', isDark);
});

// SECTION FADE-IN
const sections = document.querySelectorAll('section');
function revealSections() {
  const trigger = window.innerHeight * 0.85;
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < trigger) {
      section.classList.add('show');
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
      section.classList.remove('show');
    }
  });
}
window.addEventListener('scroll', revealSections);
window.addEventListener('DOMContentLoaded', () => {
  sections.forEach(s => s.classList.add('hidden'));
  revealSections();
});

// CONTACT FORM HANDLING
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const [name, email, message] = contactForm.querySelectorAll('input, textarea');
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    alert('Thank you for reaching out! (Demo only)');
    contactForm.reset();
  });
}

// 🔮 CHATBOT FUNCTIONALITY

document.addEventListener('DOMContentLoaded', function() {
  const chatBubble = document.getElementById("chat-bubble");
  const chatOverlay = document.getElementById("chat-overlay");
  const closeChat = document.getElementById("close-chat");
  const chatInput = document.querySelector(".chat-input");
  const sendBtn = document.querySelector(".send-icon-btn");
  const chatBody = document.querySelector(".chat-body");

  const myFullName = "Udit Prasad";
  const myDescription = "I'm Udit, a CSE student at Sister Nivedita University, passionate about full-stack web development, building interactive projects like ExcelViz and BlogLife, and continuously improving my DSA and OOPS skills.";

  const API_KEY = "AIzaSyDJMwDioH7O7T5OAIvW83vcBbMcTVbz-wY"; // Replace with your actual key

  // Toggle chat UI
  chatBubble.onclick = () => {
    chatOverlay.style.display = "flex";
    chatBody.innerHTML = '';
    addMessage(`Hi I am ${myFullName}, what do u want to know about me?`, 'left', true);
  };
  closeChat.onclick = () => {
    chatOverlay.style.display = "none";
  };

  // Send message on button click
  sendBtn.addEventListener("click", async () => {
    await sendChatMessage();
  });

  // Send message on Enter key (but allow Shift+Enter for newline)
  chatInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await sendChatMessage();
    }
  });

  function addMessage(text, side = 'left', isInit = false) {
    const messageDiv = document.createElement('div');
    messageDiv.style.textAlign = side;
    const span = document.createElement('span');
    span.textContent = text;
    messageDiv.appendChild(span);
    messageDiv.className = isInit ? 'init-msg' : '';
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addTypingAnimation() {
    const typingDiv = document.createElement('div');
    typingDiv.style.textAlign = 'left';
    typingDiv.className = 'loading-msg';
    typingDiv.id = 'typing-indicator';
    const span = document.createElement('span');
    span.textContent = 'Typing...';
    typingDiv.appendChild(span);
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingAnimation() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) typingDiv.remove();
  }

  async function fetchGeminiResponse(userMessage) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const portfolioData = `About: I'm Udit Prasad, a B.Tech Computer Science & Engineering student at Sister Nivedita University, passionate about building impactful full-stack applications and exploring innovative tech solutions. With hands-on experience in React.js, Node.js, and MongoDB, I specialize in creating data-driven, scalable, and interactive web applications. Currently, I’m deepening my core programming knowledge by learning Data Structures & Algorithms in C and Object-Oriented Programming in Java. I enjoy solving real-world problems through technology and have contributed to open-source projects, participated in hackathons, and delivered presentations on trending software development topics.\n\nSkills: HTML5, CSS3, JavaScript, React, Node.js, MongoDB, Java, C, Python, Git\n\nExperience: \n- Full Stack Development Intern, Zidio Development (June 2025 – Present): Developed ExcelViz (React.js, Redux Toolkit, Chart.js, Three.js), BlogLife (MERN stack), etc.\n- B.Tech in Computer Science & Engineering, Sister Nivedita University (2024-2028), CGPA: 7.5/10\n\nProjects: ExcelViz, BlogLife, Atmoscan`;

    const prompt = `${portfolioData}\n\nNow answer the following question based only on the above portfolio data. If the answer is not present, say 'Sorry, I don't have that information in my portfolio.'\nReply as if you are Udit Prasad himself, in the first person, friendly and concise.\n\nQuestion: ${userMessage}`;

    const payload = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
    } catch (err) {
      console.error('Gemini error:', err);
      return "Oops! Something went wrong.";
    }
  }

  async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    addMessage(message, 'right');
    chatInput.value = "";
    addTypingAnimation();
    const responseText = await fetchGeminiResponse(message);
    removeTypingAnimation();
    addMessage(responseText, 'left');
  }
});
