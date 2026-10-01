async function loadPartial(selector, url) {
  const target = document.querySelector(selector);

  if (!target) return;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`No se pudo cargar ${url}`);
    }

    target.innerHTML = await response.text();

  } catch (error) {
    console.error(error);
  }
}


function marcarEnlaceActivo() {
  const rutaActual =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-links a").forEach((link) => {

    const href = link.getAttribute("href")?.split("/").pop();

    if (href === rutaActual) {
      link.classList.add("active-link");
    }

  });
}


document.addEventListener("DOMContentLoaded", async () => {

  await Promise.all([
    loadPartial("#site-header", "/components/header.html"),
    loadPartial("#site-footer", "/components/footer.html"),
  ]);

  marcarEnlaceActivo();

  // Avisamos a otros scripts que el header y footer ya existen
  document.dispatchEvent(new CustomEvent("partialsListos"));

});