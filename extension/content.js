console.log("Algo Mentor Loaded");

const sidebar = document.createElement("div");

sidebar.id = "algo-mentor-sidebar";

sidebar.innerHTML = `
    <div class="mentor-header">
        <h2>🧠 Algo Mentor</h2>
        <p>Learn. Think. Solve.</p>
    </div>

    <div id="chat-container"></div>

    <div class="hint-buttons">
    <button id="nudge-btn">💡 Nudge Me</button>
    <button id="guide-btn">🧭 Guide Me</button>
    <button id="approach-btn">🧠 Explain Approach</button>
    </div>

    <textarea
        id="user-input"
        placeholder="Ask your mentor..."
    ></textarea>

    <button id="send-btn">
        Send
    </button>
`;

document.body.appendChild(sidebar);

const toggleButton = document.createElement("div");
toggleButton.id = "algo-mentor-toggle";
toggleButton.innerText = "🧠";

document.body.appendChild(toggleButton);
let isOpen = false;
toggleButton.addEventListener("click", () => {
  isOpen = !isOpen;
  sidebar.classList.toggle("open", isOpen);
});
const sendButton = document.getElementById("send-btn");
const input = document.getElementById("user-input");
const chatContainer = document.getElementById("chat-container");

let conversation = [];

function getProblemData() {
  const title =
    document.querySelector('[data-cy="question-title"]')?.innerText ||
    document.querySelector(".text-title-large")?.innerText ||
    "";

  const description =
    document.querySelector('[data-track-load="description_content"]')
      ?.innerText || "";

  return {
    title,
    description,
  };
}

function addMessage(sender, text) {
  const div = document.createElement("div");

  div.className = sender === "You" ? "user-message" : "mentor-message";

  div.innerHTML = `
        <strong>${sender}</strong><br>
        ${text}
    `;

  chatContainer.appendChild(div);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  return div;
}

async function sendMessage(
  hintLevel = 1,
  predefinedMessage = null,
  displayMessage = null,
) {
  const message = predefinedMessage ?? input.value.trim();

  if (!message) return;

  const problem = getProblemData();

  conversation.push({
    role: "user",
    content: message,
  });

  addMessage("You", displayMessage || message);

  if (!predefinedMessage) {
    input.value = "";
  }

  sendButton.disabled = true;

  const loadingMessage = addMessage("Mentor", "Thinking...");

  try {
    const response = await fetch("http://localhost:3000/api/v1/mentor/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problem: `${problem.title}\n\n${problem.description}`,
        conversation,
        userMessage: message,
        hintLevel,
      }),
    });

    const data = await response.json();

    const reply = data?.data?.reply || "Something went wrong.";

    conversation.push({
      role: "assistant",
      content: reply,
    });

    loadingMessage.innerHTML = `
            <strong>Mentor</strong><br>
            ${reply}
        `;
  } catch (error) {
    console.error(error);

    loadingMessage.innerHTML = `
            <strong>Mentor</strong><br>
            Unable to reach backend.
        `;
  } finally {
    sendButton.disabled = false;

    input.focus();
  }
}

sendButton.addEventListener("click", () => {
  sendMessage();
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();

    sendMessage();
  }
});

document
  .getElementById("nudge-btn")
  .addEventListener("click", () =>
    sendMessage(
      1,
      "Give me the first conceptual hint without revealing the algorithm.",
      "💡 Nudge Me",
    ),
  );

document
  .getElementById("guide-btn")
  .addEventListener("click", () =>
    sendMessage(
      2,
      "Guide me toward the correct algorithm or data structure without giving away the implementation.",
      "🧭 Guide Me",
    ),
  );

document
  .getElementById("approach-btn")
  .addEventListener("click", () =>
    sendMessage(
      3,
      "Explain the complete approach, important observations, and edge cases without writing code.",
      "🧠 Explain Approach",
    ),
  );
