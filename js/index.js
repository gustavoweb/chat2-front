const personagens = [
  { id: 1, name: "Robot", src: "./assets/personagens/robot1.png" },
  { id: 2, name: "Pikachu", src: "./assets/personagens/pikachu1.png" },
  { id: 3, name: "Mario", src: "./assets/personagens/mario1.png" },
];

const salas = [
  { id: 1, name: "Deserto", src: "./assets/salas/deserto.png" },
  { id: 2, name: "Cyber", src: "./assets/salas/cyber.png" },
];

let selectedPersonagem = null;
let selectedSala = null;

// Render personagens
const personagensContainer = document.getElementById("personagens");
personagens.forEach((personagem) => {
  const img = document.createElement("img");
  img.src = personagem.src;
  img.alt = personagem.name;
  img.addEventListener("click", () => {
    selectedPersonagem = personagem.id;
    console.log("Personagem selecionado:", personagem.name); // Debug
    document
      .querySelectorAll("#personagens img")
      .forEach((el) => el.classList.remove("selected"));
    img.classList.add("selected");
  });
  personagensContainer.appendChild(img);
});

// Render salas
const salasContainer = document.getElementById("salas");
salas.forEach((sala) => {
  const img = document.createElement("img");
  img.src = sala.src;
  img.alt = sala.name;
  img.addEventListener("click", () => {
    selectedSala = sala.id;
    console.log("Sala selecionada:", sala.name); // Debug
    document
      .querySelectorAll("#salas img")
      .forEach((el) => el.classList.remove("selected"));
    img.classList.add("selected");
  });
  salasContainer.appendChild(img);
});

// Botão entrar
document.getElementById("entrar").addEventListener("click", () => {
  const nickname = document.getElementById("nickname").value.trim();
  if (!selectedPersonagem || !selectedSala) {
    alert("Escolha um personagem e uma sala!");
    return;
  }
  if (nickname) {
    // Salvar no localStorage
    localStorage.setItem("personagem", selectedPersonagem);
    localStorage.setItem("sala", selectedSala);
    localStorage.setItem("nickname", nickname);

    console.log("Personagem e sala salvos no localStorage:");
    console.log("Personagem:", localStorage.getItem("personagem"));
    console.log("Sala:", localStorage.getItem("sala"));

    // Redirecionar para sala.html
    window.location.href = "sala.html";
  } else {
    alert("Por favor, insira um nickname.");
  }
});
