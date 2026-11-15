/* Ukindu Tour & Safari — Premium homepage interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.remove("no-js");

  var WA_NUMBER = "255712868079"; // Company WhatsApp number (international format, digits only)
  var EMAIL = "info@ukindutour.co.tz";

  /* ---------- Sticky header ---------- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Desktop dropdowns (keyboard / touch) ---------- */
  document.querySelectorAll(".main-nav .nav-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var li = btn.parentElement;
      var open = li.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".main-nav li.is-open").forEach(function (li) {
      if (!li.contains(e.target)) {
        li.classList.remove("is-open");
        var b = li.querySelector(".nav-toggle");
        if (b) b.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ---------- Mobile drawer ---------- */
  var body = document.body;
  var openDrawer = function () {
    body.classList.add("drawer-open");
    var d = document.getElementById("drawer");
    if (d) {
      d.setAttribute("aria-hidden", "false");
      var f = d.querySelector("button, a");
      if (f) f.focus();
    }
  };
  var closeDrawer = function () {
    body.classList.remove("drawer-open");
    var d = document.getElementById("drawer");
    if (d) d.setAttribute("aria-hidden", "true");
  };
  document.querySelectorAll("[data-drawer-open]").forEach(function (b) {
    b.addEventListener("click", openDrawer);
  });
  document.querySelectorAll("[data-drawer-close]").forEach(function (b) {
    b.addEventListener("click", closeDrawer);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });
  document.querySelectorAll('.drawer a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", closeDrawer);
  });
  document.querySelectorAll(".drawer .sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.parentElement.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".faq-item");
      var open = item.classList.toggle("is-open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Subtle hero parallax ---------- */
  var heroMedia = document.querySelector(".hero-media");
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile and tablet card carousels ---------- */
  var carouselMedia = window.matchMedia("(max-width: 1023px)");
  var carouselTracks = document.querySelectorAll(
    ".discover-grid.swipe, .tour-grid.swipe, .more-grid.swipe, .reviews-track.swipe, .guide-grid.swipe",
  );
  var carousels = [];

  carouselTracks.forEach(function (track) {
    var controls = track.nextElementSibling;
    if (!controls || !controls.classList.contains("carousel-controls")) return;

    var cards = Array.prototype.slice.call(track.children);
    var previous = controls.querySelector("[data-carousel-prev]");
    var next = controls.querySelector("[data-carousel-next]");
    var timer = null;
    var paused = false;
    var inView = !("IntersectionObserver" in window);
    var styles = window.getComputedStyle(track);
    var inset =
      track.clientLeft + (parseFloat(styles.paddingLeft) || 0);

    track.setAttribute("role", "region");
    track.setAttribute("tabindex", "0");
    track.setAttribute("aria-label", controls.getAttribute("aria-label"));

    var currentIndex = function () {
      var edge = track.getBoundingClientRect().left + inset;
      var closest = 0;
      var distance = Infinity;
      cards.forEach(function (card, index) {
        var nextDistance = Math.abs(card.getBoundingClientRect().left - edge);
        if (nextDistance < distance) {
          closest = index;
          distance = nextDistance;
        }
      });
      return closest;
    };

    var canAutoAdvance = function () {
      return (
        carouselMedia.matches &&
        !reduce &&
        !paused &&
        inView &&
        document.visibilityState === "visible" &&
        track.scrollWidth > track.clientWidth + 4
      );
    };

    var schedule = function (delay) {
      window.clearTimeout(timer);
      if (!canAutoAdvance()) return;
      timer = window.setTimeout(function () {
        move(1, 5000);
      }, delay || 5000);
    };

    var move = function (direction, delay) {
      if (!cards.length) return;
      var targetIndex =
        (currentIndex() + direction + cards.length) % cards.length;
      var card = cards[targetIndex];
      var target =
        track.scrollLeft +
        card.getBoundingClientRect().left -
        track.getBoundingClientRect().left -
        inset;
      if (track.scrollTo) {
        track.scrollTo({
          left: target,
          behavior: reduce ? "auto" : "smooth",
        });
      } else {
        track.scrollLeft = target;
      }
      schedule(delay || 6500);
    };

    if (previous) {
      previous.addEventListener("click", function () {
        move(-1, 6500);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        move(1, 6500);
      });
    }

    track.addEventListener("mouseenter", function () {
      paused = true;
      window.clearTimeout(timer);
    });
    track.addEventListener("mouseleave", function () {
      paused = false;
      schedule();
    });
    track.addEventListener("focusin", function () {
      paused = true;
      window.clearTimeout(timer);
    });
    track.addEventListener("focusout", function (event) {
      if (!track.contains(event.relatedTarget)) {
        paused = false;
        schedule();
      }
    });
    track.addEventListener("pointerdown", function () {
      paused = true;
      window.clearTimeout(timer);
    });
    track.addEventListener("pointerup", function () {
      paused = false;
      schedule(3000);
    });
    track.addEventListener("pointercancel", function () {
      paused = false;
      schedule(3000);
    });

    if ("IntersectionObserver" in window) {
      var carouselObserver = new IntersectionObserver(
        function (entries) {
          inView = entries[0].isIntersecting;
          if (inView) schedule();
          else window.clearTimeout(timer);
        },
        { threshold: 0.15 },
      );
      carouselObserver.observe(track);
    }

    carousels.push({
      refresh: function () {
        paused = false;
        schedule();
      },
    });
    schedule();
  });

  var refreshCarousels = function () {
    carousels.forEach(function (carousel) {
      carousel.refresh();
    });
  };
  if (carouselMedia.addEventListener) {
    carouselMedia.addEventListener("change", refreshCarousels);
  } else if (carouselMedia.addListener) {
    carouselMedia.addListener(refreshCarousels);
  }
  document.addEventListener("visibilitychange", refreshCarousels);

  if (heroMedia && !reduce && window.innerWidth > 1023) {
    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var y = Math.min(window.scrollY, window.innerHeight);
          heroMedia.style.transform = "translate3d(0," + y * 0.18 + "px,0)";
          ticking = false;
        });
      },
      { passive: true },
    );
  }

  /* ---------- Pre-select interest from CTA links (e.g. #plan-trip with data-interest) ---------- */
  document.querySelectorAll("[data-interest]").forEach(function (a) {
    a.addEventListener("click", function () {
      var val = a.getAttribute("data-interest");
      var input = document.querySelector(
        '.plan-form input[name="interest"][value="' + val + '"]',
      );
      if (input) input.checked = true;
    });
  });

  /* ---------- Plan My Trip form -> WhatsApp / Email ---------- */
  var form = document.getElementById("plan-form");
  if (form) {
    var err = form.querySelector(".form-error");

    var collect = function () {
      var fd = new FormData(form);
      var interests = fd.getAll("interest");
      var lines = [
        "Hello Ukindu Tour & Safari, I would like to plan a trip.",
        "",
        "Name: " + (fd.get("name") || ""),
        "Email: " + (fd.get("email") || ""),
        "WhatsApp: " + (fd.get("whatsapp") || "-"),
        "Country: " + (fd.get("country") || "-"),
        "Travel dates: " + (fd.get("dates") || "-"),
        "Travelers: " + (fd.get("travelers") || "-"),
        "Interested in: " +
          (interests.length ? interests.join(", ") : "Not sure"),
        "Travel style: " + (fd.get("style") || "Not sure"),
        "Estimated budget (per person): " + (fd.get("budget") || "Not sure"),
        "",
        "My dream trip: " + (fd.get("message") || "-"),
      ];
      return lines.join("\n");
    };

    var valid = function () {
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var ok = name.length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (err) err.classList.toggle("show", !ok);
      if (!ok) {
        (name.length > 1 ? form.elements.email : form.elements.name).focus();
      }
      return ok;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!valid()) return;
      var url =
        "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(collect());
      if (window.dataLayer)
        window.dataLayer.push({
          event: "plan_trip_submit",
          method: "whatsapp",
        });
      window.open(url, "_blank", "noopener");
    });

    var emailBtn = document.getElementById("plan-email");
    if (emailBtn) {
      emailBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (!valid()) return;
        if (window.dataLayer)
          window.dataLayer.push({ event: "plan_trip_submit", method: "email" });
        window.location.href =
          "mailto:" +
          EMAIL +
          "?subject=" +
          encodeURIComponent(
            "Trip enquiry - " + form.elements.name.value.trim(),
          ) +
          "&body=" +
          encodeURIComponent(collect());
      });
    }
  }

  /* ---------- Footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
