const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const enter = document.getElementById('sign-in-btn');
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

document.querySelector(".sign-in-form .btn.solid").addEventListener("click", (event) => {
  event.preventDefault(); // Previne o comportamento padrão de envio do formulário
  window.location.href = "home.html"; // Redireciona para a página home.html
});
