document.addEventListener("DOMContentLoaded", () => {
  const contentField = document.getElementById("content");

  if (contentField) {
    contentField.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();

        const start = contentField.selectionStart;
        const end = contentField.selectionEnd;
        const value = contentField.value;

        contentField.value =
          value.substring(0, start) +
          "  " +
          value.substring(end);

        contentField.selectionStart =
          contentField.selectionEnd =
          start + 2;
      }
    });
  }

  // --- Carrusel de publicaciones (horizontal, derecha -> izquierda) ---
  class Carousel {
    constructor(el) {
      this.el = el;
      this.track = el.querySelector(".carousel-track");
      this.slides = Array.from(this.track.children);
      this.prevBtn = el.querySelector(".carousel-prev");
      this.nextBtn = el.querySelector(".carousel-next");
      this.dotsWrap = el.querySelector(".carousel-dots");
      this.autoplayDelay = parseInt(el.dataset.autoplay, 10) || 5000;
      this.index = 0;
      this.timer = null;

      if (!this.slides.length) return;

      this.buildDots();
      this.bindEvents();
      this.update();
      this.play();
    }

    slidesPerView() {
      const w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 900) return 2;
      return 3;
    }

    maxIndex() {
      return Math.max(0, this.slides.length - this.slidesPerView());
    }

    buildDots() {
      this.dotsWrap.innerHTML = "";
      const pages = this.maxIndex() + 1;
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement("button");
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Ir a la tarjeta ${i + 1}`);
        dot.addEventListener("click", () => this.goTo(i));
        this.dotsWrap.appendChild(dot);
      }
    }

    update() {
      const slideWidth = this.slides[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(this.track).gap) || 0;
      const offset = this.index * (slideWidth + gap);

      // Negativo = mueve el track hacia la izquierda,
      // lo que hace que el contenido nuevo entre desde la derecha.
      this.track.style.transform = `translateX(-${offset}px)`;

      Array.from(this.dotsWrap.children).forEach((dot, i) => {
        dot.classList.toggle("is-active", i === this.index);
      });
    }

    goTo(i) {
      this.index = Math.min(Math.max(i, 0), this.maxIndex());
      this.update();
      this.restart();
    }

    next() {
      this.index = this.index >= this.maxIndex() ? 0 : this.index + 1;
      this.update();
    }

    prev() {
      this.index = this.index <= 0 ? this.maxIndex() : this.index - 1;
      this.update();
    }

    play() {
      this.stop();
      this.timer = setInterval(() => this.next(), this.autoplayDelay);
    }

    stop() {
      if (this.timer) clearInterval(this.timer);
    }

    restart() {
      this.play();
    }

    bindEvents() {
      this.nextBtn.addEventListener("click", () => { this.next(); this.restart(); });
      this.prevBtn.addEventListener("click", () => { this.prev(); this.restart(); });
      this.el.addEventListener("mouseenter", () => this.stop());
      this.el.addEventListener("mouseleave", () => this.play());
      this.el.addEventListener("focusin", () => this.stop());
      this.el.addEventListener("focusout", () => this.play());
      window.addEventListener("resize", () => {
        this.buildDots();
        this.index = Math.min(this.index, this.maxIndex());
        this.update();
      });
    }
  }

  document.querySelectorAll(".carousel").forEach((el) => new Carousel(el));
});

// --- Tema claro/oscuro (ahora vive en el header inyectado por loadpartials.js) ---
document.addEventListener("partialsListos", () => {
  const themeSwitch = document.getElementById("themeSwitch");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (themeSwitch) themeSwitch.checked = true;
  }

  if (themeSwitch) {
    themeSwitch.addEventListener("change", () => {
      if (themeSwitch.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      }
    });
  }
});





/*inicio*/

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

const portfolioDropdown = document.getElementById("portfolioDropdown");
const portfolioToggle = document.getElementById("portfolioToggle");

if (portfolioDropdown && portfolioToggle) {
  portfolioToggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    portfolioDropdown.classList.toggle("open");

    const expanded = portfolioDropdown.classList.contains("open");
    portfolioToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  });

  document.addEventListener("click", (event) => {
    if (!portfolioDropdown.contains(event.target)) {
      portfolioDropdown.classList.remove("open");
      portfolioToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ROTADOR DE FRASES HERO
const phrases = [
  "Soluciones tecnológicas integrales para empresas que necesitan resultados.",
  "Infraestructura, automatización e integración para tu negocio.",
  "Impulsamos la eficiencia operativa con tecnología.",
  "Transformamos procesos en resultados medibles.",
  "Tecnología confiable para operaciones críticas."
];

const heroText = document.getElementById("hero-rotator");

if (heroText) {
  let index = 0;

  setInterval(() => {
    index = (index + 1) % phrases.length;

    // efecto fade
    heroText.style.opacity = 0;

    setTimeout(() => {
      heroText.textContent = phrases[index];
      heroText.style.opacity = 1;
    }, 300);

  }, 4000);
}

/* =========================================================
   CARRUSEL BLOG - AVANCE AUTOMÁTICO INFINITO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("blog-carousel");
    const previousButton = document.querySelector(".blog-carousel-prev");
    const nextButton = document.querySelector(".blog-carousel-next");

    if (!track || !previousButton || !nextButton) {
        return;
    }

    const originalCards = Array.from(
        track.querySelectorAll(".blog-carousel-card")
    );

    if (originalCards.length <= 1) {
        previousButton.style.display = "none";
        nextButton.style.display = "none";
        return;
    }

    /*
      Duplicamos las tarjetas para que el carrusel tenga recorrido
      aunque existan pocas publicaciones.
    */
    originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
    });

    const getScrollAmount = () => {
        const card = track.querySelector(".blog-carousel-card");

        if (!card) {
            return track.clientWidth;
        }

        const styles = window.getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap || "0");

        return card.getBoundingClientRect().width + gap;
    };

    const getResetPoint = () => {
        return track.scrollWidth / 2;
    };

    const normalizeForward = () => {
        const resetPoint = getResetPoint();

        if (track.scrollLeft >= resetPoint - 5) {
            track.scrollTo({
                left: 0,
                behavior: "auto"
            });
        }
    };

    const normalizeBackward = () => {
        if (track.scrollLeft <= 5) {
            track.scrollTo({
                left: getResetPoint(),
                behavior: "auto"
            });
        }
    };

    const goNext = () => {
        normalizeForward();

        track.scrollBy({
            left: getScrollAmount(),
            behavior: "smooth"
        });

        window.setTimeout(normalizeForward, 650);
    };

    const goPrevious = () => {
        normalizeBackward();

        track.scrollBy({
            left: -getScrollAmount(),
            behavior: "smooth"
        });
    };

    let autoplay = null;

    const stopAutoplay = () => {
        if (autoplay) {
            window.clearInterval(autoplay);
            autoplay = null;
        }
    };

    const startAutoplay = () => {
        stopAutoplay();
        autoplay = window.setInterval(goNext, 3500);
    };

    const restartAutoplay = () => {
        stopAutoplay();
        startAutoplay();
    };

    nextButton.addEventListener("click", () => {
        goNext();
        restartAutoplay();
    });

    previousButton.addEventListener("click", () => {
        goPrevious();
        restartAutoplay();
    });

    track.addEventListener("mouseenter", stopAutoplay);
    track.addEventListener("mouseleave", startAutoplay);

    previousButton.addEventListener("mouseenter", stopAutoplay);
    previousButton.addEventListener("mouseleave", startAutoplay);

    nextButton.addEventListener("mouseenter", stopAutoplay);
    nextButton.addEventListener("mouseleave", startAutoplay);

    startAutoplay();
});

