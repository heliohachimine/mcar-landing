const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const form = document.querySelector(".contact-form");
const errorBox = document.querySelector("#form-error");

const onScroll = () => {
  header.classList.toggle("is-stuck", window.scrollY > 8);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

let lockedScroll = 0;

const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);

  if (open) {
    lockedScroll = window.scrollY;
    document.body.style.top = `-${lockedScroll}px`;
    document.body.classList.add("menu-open");
    return;
  }

  document.body.classList.remove("menu-open");
  document.body.style.top = "";
  window.scrollTo(0, lockedScroll);
};

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    setMenu(false);
    toggle.focus();
  }
});

const whatsappUrl = ({ nome, veiculo, relato }) => {
  const lines = [
    `Olá, Matheus. Sou ${nome}.`,
    `Veículo: ${veiculo || "não informado"}.`,
    `O que aconteceu: ${relato}`,
  ];
  return `https://wa.me/5511981517742?text=${encodeURIComponent(lines.join("\n"))}`;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const nome = String(data.get("nome") || "").trim();
  const veiculo = String(data.get("veiculo") || "").trim();
  const relato = String(data.get("relato") || "").trim();

  if (nome.length < 2 || relato.length < 8) {
    errorBox.hidden = false;
    errorBox.textContent = "Informe seu nome e descreva a falha com um pouco mais de detalhe.";
    return;
  }

  errorBox.hidden = true;
  const url = whatsappUrl({ nome, veiculo, relato });
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) window.location.href = url;
});
