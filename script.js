/* ========================================
   PORTFOLIO - SAMY ALBISSER
   Script interactif
   ======================================== */

// ===== TOGGLE AP ACCORDION (accessible) =====
function toggleAP(header) {
  const card = header.parentElement;
  const isOpen = card.classList.toggle("open");
  header.setAttribute("aria-expanded", isOpen);
}

// ===== THEME TOGGLE (before DOMContentLoaded for no-flash) =====
(function () {
  const saved = localStorage.getItem("portfolio-theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  function updateThemeIcon() {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light") {
      themeIcon.className = "fas fa-moon";
    } else {
      themeIcon.className = "fas fa-sun";
    }
  }

  updateThemeIcon();

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
    updateThemeIcon();
  });

  // ===== CV MODAL =====
  const cvModal = document.getElementById("cvModal");
  const cvIframe = document.getElementById("cvIframe");
  const cvPath =
    "assets/Informations%20Samy%20ALBISSER/CV%20Albisser%20Samy%202026%202.pdf";

  function openCvModal() {
    cvIframe.src = cvPath;
    cvModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeCvModal() {
    cvModal.classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(() => {
      cvIframe.src = "";
    }, 300);
  }

  // Hero CV button
  const heroCvBtn = document.getElementById("openCvModal");
  if (heroCvBtn) heroCvBtn.addEventListener("click", openCvModal);

  // Contact section CV buttons
  document.querySelectorAll(".open-cv-modal").forEach((btn) => {
    btn.addEventListener("click", openCvModal);
  });

  // Close modal
  document
    .getElementById("cvModalClose")
    .addEventListener("click", closeCvModal);

  cvModal.addEventListener("click", (e) => {
    if (e.target === cvModal) closeCvModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cvModal.classList.contains("active")) {
      closeCvModal();
    }
  });
  // ===== TYPING EFFECT =====
  const typedEl = document.getElementById("typedText");
  const titles = [
    "Technicien Poste de Travail",
    "Alternant CARSAT Alsace-Moselle",
    "Étudiant BTS SIO — SISR",
    "Passionné Systèmes & Réseaux",
  ];
  let titleIndex = 0;
  let charIndex = titles[0].length; // Start from the end of the default text
  let isDeleting = true; // Start by deleting the default text
  let typingSpeed = 2000; // Pause before starting to delete

  function typeEffect() {
    const current = titles[titleIndex];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === current.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll(".section, #hero");

  window.addEventListener("scroll", () => {
    // Navbar background
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active link
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("data-section") === current) {
        link.classList.add("active");
      }
    });
  });

  // ===== MOBILE NAV =====
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.querySelector(".nav-links");

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("open");
    // Empêcher le scroll quand le menu est ouvert
    document.body.style.overflow = navMenu.classList.contains("open")
      ? "hidden"
      : "";
  });

  // Close on link click
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  // Close menu on scroll (mobile)
  window.addEventListener(
    "scroll",
    () => {
      if (navMenu.classList.contains("open")) {
        navToggle.classList.remove("active");
        navMenu.classList.remove("open");
        document.body.style.overflow = "";
      }
    },
    { passive: true },
  );

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll(".stat-number");
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    const heroStats = document.querySelector(".hero-stats");
    if (!heroStats) return;

    const rect = heroStats.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      countersAnimated = true;
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target"));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
      });
    }
  }

  window.addEventListener("scroll", animateCounters);
  animateCounters(); // Check on load

  // ===== SKILL BARS ANIMATION (with stagger) =====
  const skillFills = document.querySelectorAll(".skill-fill");
  let skillsAnimated = false;

  function animateSkills() {
    if (skillsAnimated) return;

    const skillsSection = document.getElementById("competences");
    if (!skillsSection) return;

    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      skillsAnimated = true;
      skillFills.forEach((fill, index) => {
        const width = fill.getAttribute("data-width");
        setTimeout(() => {
          fill.style.width = width + "%";
        }, index * 80);
      });
    }
  }

  window.addEventListener("scroll", animateSkills);

  // ===== FADE IN ON SCROLL =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add fade-in class to elements
  const fadeElements = document.querySelectorAll(
    ".info-card, .timeline-item, .exp-card, .exp-card-group, .skill-category, " +
      ".ap-card, .procedure-card, .competence-card, .veille-card, " +
      ".e5-description, .doc-card, .method-step, .veille-intro-text, " +
      ".veille-evolution, .learned-item, .career-goal, .career-option, .career-current, " +
      ".e5-synthese, .link-card, .tech-item, " +
      ".testimonial-card, .why-me-item, .testimonial-note, " +
      ".contact-form-card, .contact-alert, .contact-direct, .contact-docs",
  );

  fadeElements.forEach((el, index) => {
    el.classList.add("fade-in");
    el.style.transitionDelay = `${(index % 6) * 0.1}s`;
    fadeObserver.observe(el);
  });

  // ===== FILTER PROCEDURES =====
  const filterBtns = document.querySelectorAll(".filter-btn");
  const procedureCards = document.querySelectorAll(".procedure-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Active state
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      procedureCards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.classList.remove("hidden");
          card.style.animation = "none";
          card.offsetHeight; // trigger reflow
          card.style.animation = "fadeInUp 0.4s ease both";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS (with deep AP linking) =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      const target = document.querySelector(href);
      const apToOpen = this.getAttribute("data-open-ap");

      if (target) {
        target.scrollIntoView({ behavior: "smooth" });

        // Auto-open the specified AP accordion after scrolling
        if (apToOpen) {
          setTimeout(() => {
            const apCard = document.querySelector(
              `.ap-card[data-ap="${apToOpen}"]`,
            );
            if (apCard && !apCard.classList.contains("open")) {
              const header = apCard.querySelector(".ap-header");
              if (header) toggleAP(header);
            }
          }, 600);
        }
      }
    });
  });

  // ===== EVOLUTION TRACK BARS ANIMATION =====
  const trackProgressBars = document.querySelectorAll(".track-progress");
  let tracksAnimated = false;

  function animateTracks() {
    if (tracksAnimated) return;

    const evolutionSection = document.querySelector(".veille-evolution");
    if (!evolutionSection) return;

    const rect = evolutionSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      tracksAnimated = true;
      trackProgressBars.forEach((bar, index) => {
        setTimeout(() => {
          bar.classList.add("animated");
        }, index * 300);
      });
    }
  }

  window.addEventListener("scroll", animateTracks);
  animateTracks();

  // ===== SCROLL PROGRESS BAR =====
  const scrollProgress = document.getElementById("scrollProgress");

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = progress + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });

  // ===== SIDE NAV DOTS =====
  const sideNav = document.getElementById("sideNav");
  const sideDots = document.querySelectorAll(".side-dot");
  const sideNavSections = document.querySelectorAll(
    "#hero, #about, #formation, #experience, #competences, #projets, #procedures, #epreuve-e5, #veille, #contact",
  );

  function updateSideNav() {
    const scrollY = window.scrollY;

    // Show/hide side nav after hero
    if (scrollY > 400) {
      sideNav.classList.add("visible");
    } else {
      sideNav.classList.remove("visible");
    }

    // Active dot
    let currentId = "hero";
    sideNavSections.forEach((section) => {
      if (scrollY >= section.offsetTop - 200) {
        currentId = section.id;
      }
    });

    sideDots.forEach((dot) => {
      dot.classList.remove("active");
      if (dot.getAttribute("href") === "#" + currentId) {
        dot.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateSideNav, { passive: true });
  updateSideNav();

  // ===== BACK TO TOP BUTTON =====
  const backToTop = document.getElementById("backToTop");

  function updateBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", updateBackToTop, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ===== AP KPI COUNTER ANIMATION =====
  const apResultValues = document.querySelectorAll(".result-value");

  const kpiObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();

          // Extract numeric part
          const numMatch = text.match(/[\d\s]+/);
          if (numMatch) {
            const numStr = numMatch[0].replace(/\s/g, "");
            const target = parseInt(numStr);
            if (isNaN(target)) return;

            const prefix = text.substring(0, text.indexOf(numMatch[0]));
            const suffix = text.substring(
              text.indexOf(numMatch[0]) + numMatch[0].length,
            );

            let current = 0;
            const duration = 1500;
            const step = target / (duration / 16);

            function countUp() {
              current += step;
              if (current < target) {
                el.textContent = prefix + Math.floor(current) + suffix;
                requestAnimationFrame(countUp);
              } else {
                // Restore original formatting
                el.textContent = text;
              }
            }

            el.textContent = prefix + "0" + suffix;
            setTimeout(countUp, 200);
          }

          kpiObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  apResultValues.forEach((el) => kpiObserver.observe(el));

  // ===== AP CARD GLOW EFFECT =====
  document.querySelectorAll(".ap-header").forEach((header) => {
    const glow = document.createElement("div");
    glow.classList.add("ap-glow");
    header.appendChild(glow);

    header.addEventListener("mousemove", (e) => {
      const rect = header.getBoundingClientRect();
      glow.style.left = e.clientX - rect.left + "px";
      glow.style.top = e.clientY - rect.top + "px";
    });
  });

  // ===== LEGAL MODALS (Mentions légales & CGU) =====
  function openLegalModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeLegalModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // Open modal links
  document.querySelectorAll("[data-open-modal]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openLegalModal(link.getAttribute("data-open-modal"));
    });
  });

  // Close buttons
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeLegalModal(btn.getAttribute("data-close-modal"));
    });
  });

  // Close on overlay click
  document.querySelectorAll(".legal-modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeLegalModal(overlay.id);
      }
    });
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document
        .querySelectorAll(".legal-modal-overlay.active")
        .forEach((modal) => {
          closeLegalModal(modal.id);
        });
    }
  });

  // ===== CONTACT FORM HANDLER =====
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector(".contact-submit");
      const originalText = submitBtn.innerHTML;

      // Loading state
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
      submitBtn.disabled = true;

      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            submitBtn.innerHTML =
              '<i class="fas fa-check"></i> Message envoyé !';
            submitBtn.style.background = "#10b981";
            contactForm.reset();
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.style.background = "";
              submitBtn.disabled = false;
            }, 3000);
          } else {
            throw new Error("Erreur");
          }
        })
        .catch(() => {
          submitBtn.innerHTML =
            '<i class="fas fa-exclamation-triangle"></i> Erreur, réessayez';
          submitBtn.style.background = "#ef4444";
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = "";
            submitBtn.disabled = false;
          }, 3000);
        });
    });
  }
});
