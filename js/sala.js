document.addEventListener("DOMContentLoaded", () => {
  const socket = io(
    window.location.origin.includes("onrender.com")
      ? "https://chat2-back-kpu2mfmpb-gustavowebs-projects.vercel.app"
      : "http://localhost:3000",
    { transports: ["websocket"] } // Força o uso de WebSocket
  );

  // Recupera IDs do personagem, sala e nickname do localStorage
  const personagemId = localStorage.getItem("personagem");
  const salaId = localStorage.getItem("sala");
  const nickname = localStorage.getItem("nickname");

  const chatInput = document.getElementById("chat");
  const sendBtn = document.getElementById("sendBtn");
  const salaContainer = document.getElementById("sala-container");

  // Verifica se os IDs estão definidos
  if (!personagemId || !salaId || !nickname) {
    alert("Erro ao carregar sala. Volte e selecione um personagem e uma sala.");
    window.location.href = "index.html";
    return;
  }

  // Dados de personagens e salas
  const personagens = [
    { id: 1, name: "Robot", src: "./assets/personagens/robot1.png" },
    { id: 2, name: "Pikachu", src: "./assets/personagens/pikachu1.png" },
    { id: 3, name: "Mario", src: "./assets/personagens/mario1.png" },
  ];

  const salas = [
    { id: 1, name: "Deserto", src: "./assets/salas/deserto.png" },
    { id: 2, name: "Cyber", src: "./assets/salas/cyber.png" },
  ];

  // Configuração inicial da sala e personagem
  const sala = salas.find((s) => s.id === parseInt(salaId));
  if (sala) {
    salaContainer.style.backgroundImage = `url("${sala.src}")`;
  } else {
    alert("Sala não encontrada!");
  }

  const personagemAtual = personagens.find((p) => p.id == personagemId);
  if (!personagemAtual) {
    alert("Personagem não encontrado!");
    return;
  }

  const personagemImg = document.createElement("img");
  personagemImg.src = personagemAtual.src;
  personagemImg.alt = personagemAtual.name;
  personagemImg.className = "personagem-img";
  salaContainer.appendChild(personagemImg);

  let personagemPos = { x: 50, y: 50 }; // Posição inicial
  personagemImg.style.left = `${personagemPos.x}%`;
  personagemImg.style.top = `${personagemPos.y}%`;

  const moveCharacter = (x, y) => {
    personagemPos = { x, y };
    personagemImg.style.left = `${x}%`;
    personagemImg.style.top = `${y}%`;

    socket.emit("move", { x, y, personagemId: personagemAtual.id, nickname });
  };

  // salaContainer.addEventListener("click", (e) => {
  //   const rect = salaContainer.getBoundingClientRect();
  //   const x = ((e.clientX - rect.left) / rect.width) * 100;
  //   const y = ((e.clientY - rect.top) / rect.height) * 100;

  //   personagemPos = { x, y };
  //   personagemImg.style.left = `${x}%`;
  //   personagemImg.style.top = `${y}%`;

  //   socket.emit("move", { x, y, personagemId: personagemAtual.id, nickname });
  // });

  // Evento de clique
  salaContainer.addEventListener("click", (e) => {
    const rect = salaContainer.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    moveCharacter(x, y);
  });

  // Evento de toque (suporte ao mobile)
  salaContainer.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const rect = salaContainer.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    moveCharacter(x, y);
  });

  socket.on("updateUsers", (users) => {
    salaContainer.innerHTML = ""; // Limpa a sala
    users.forEach((user) => {
      const userEl = document.createElement("div");
      userEl.className = "personagem-container";

      const img = document.createElement("img");
      img.src = `./assets/personagens/${user.personagem}`;
      img.alt = "Personagem";
      img.className = "personagem-img";

      const nomeEl = document.createElement("div");
      nomeEl.className = "personagem-texto";
      nomeEl.textContent = user.nickname;

      // Adiciona o balão de conversa
      const balaoEl = document.createElement("div");
      balaoEl.className = "balao-conversa";
      balaoEl.id = `balao-${user.id}`;
      balaoEl.style.display = "none"; // Inicialmente escondido

      userEl.appendChild(img);
      userEl.appendChild(nomeEl);
      userEl.appendChild(balaoEl);

      userEl.style.left = `${user.x}%`;
      userEl.style.top = `${user.y}%`;

      salaContainer.appendChild(userEl);
    });
  });

  // ** Configuração do chat **
  sendBtn.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (message) {
      socket.emit("chatMessage", { text: message });
      chatInput.value = ""; // Limpa o input
    }
  });

  // Recebe e exibe mensagens do chat
  socket.on("chatMessage", ({ id, nickname, message }) => {
    const balaoEl = document.getElementById(`balao-${id}`);
    if (balaoEl) {
      balaoEl.textContent = message;
      balaoEl.style.display = "block";

      // Esconde o balão após 5 segundos
      setTimeout(() => {
        balaoEl.style.display = "none";
      }, 5000);
    }
  });
});
