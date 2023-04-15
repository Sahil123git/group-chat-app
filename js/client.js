const socket = io("http://localhost:8000");

// Get DOM elements in respective Js variables
const form = document.getElementById("send-container");
const formOuter = document.querySelector(".send");
const messageContainer = document.querySelector(".container");
const messageInput = document.getElementById("messageInp");
const submit = document.querySelector("#btn");
const userInput = document.querySelector(".addHidden");

// Audio that will play on receiving messages
var audio = new Audio("ting.mp3");

// Function which will append event info to the contaner
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

// Ask new user for his/her name and let the server know

// If a new user joins, receive his/her name from the server
socket.on("user-joined", (name) => {
  if (name == null) {
  } else {
    append(`${name} joined the chat`, "right");
  }
});

// If server sends a message, receive it
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

// If a user leaves the chat, append the info to the container
socket.on("left", (name) => {
  if (name === null) {
  } else {
    append(`${name} left the chat`, "right");
  }
});

// If the form gets submitted, send server the message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});

submit.addEventListener("click", myFunction);

function myFunction() {
  console.log(document.querySelector("#fname").value, "here");
  let nameChk = document.querySelector("#fname").value;

  if (nameChk != null && nameChk.match(/^[A-Za-z\s]+$/)) {
    formOuter.classList.remove("hidden");
    messageContainer.classList.remove("hidden");
    userInput.classList.add("hidden");
    console.log("Correct Name");
    socket.emit("new-user-joined", nameChk);
  } else {
    console.log("Enter again");
  }
}
