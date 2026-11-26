/* ==========================================================================
   UKINDU TOUR & SAFARI — LUXURY HOMEPAGE INTERACTIONS
   Sticky Glassmorphism Navbar, AOS Init, Count-Up Stats, Tour Filters,
   Testimonials Swipe Slider, Lightbox, Cinema Reel, Quote Modal & Back-To-Top
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var WA_NUMBER = "255712868079";
  var EMAIL = "info@ukindutour.co.tz";

  /* ---------- 1. Initialize AOS (Animate On Scroll) ---------- */
  if (window.AOS) {
    window.AOS.init({
      duration: 750,
      easing: "ease-out-cubic",
      once: true,
      offset: 60
    });
  }

  /* ---------- 2. Sticky Glassmorphism Navbar & Back-To-Top ---------- */
  var header = document.getElementById("siteHeader") || document.querySelector(".site-header");
  var backToTop = document.getElementById("backToTop");
  var parallaxEl = document.querySelector("[data-parallax]");
  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 40);
    if (backToTop) backToTop.classList.toggle("is-visible", y > 420);

    if (parallaxEl && !prefersReducedMotion && y < window.innerHeight * 1.2) {
      var speed = parseFloat(parallaxEl.getAttribute("data-parallax")) || 0.2;
      parallaxEl.style.transform = "translate3d(0, " + (y * speed).toFixed(1) + "px, 0)";
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 3. Desktop Dropdowns & Mobile Drawer ---------- */
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

  var body = document.body;
  var drawer = document.getElementById("drawer");
  function openDrawer() {
    body.classList.add("drawer-open");
    if (drawer) {
      drawer.setAttribute("aria-hidden", "false");
      var first = drawer.querySelector("button, a");
      if (first) first.focus();
    }
  }
  function closeDrawer() {
    body.classList.remove("drawer-open");
    if (drawer) drawer.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll("[data-drawer-open]").forEach(function (b) {
    b.addEventListener("click", openDrawer);
  });
  document.querySelectorAll("[data-drawer-close]").forEach(function (b) {
    b.addEventListener("click", closeDrawer);
  });
  document.querySelectorAll(".drawer a").forEach(function (a) {
    a.addEventListener("click", closeDrawer);
  });
  document.querySelectorAll(".drawer .sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.parentElement.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------- 4. Animated Statistics Count-Up ---------- */
  var counters = document.querySelectorAll(".counter[data-target]");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var duration = 1600;
    var start = performance.now();

    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(tick);
  }

  if (counters.length && "IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute("data-target"); });
  }

  /* ---------- 5. Popular Tours Category Filter ---------- */
  var filterBtns = document.querySelectorAll(".filter-pill[data-filter]");
  var tourCards = document.querySelectorAll(".lux-tour-card[data-category]");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");

      tourCards.forEach(function (card) {
        var cat = card.getAttribute("data-category");
        var show = filter === "all" || cat === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---------- 6. Testimonials Auto-Sliding & Swipe Slider ---------- */
  var track = document.getElementById("testimonialsTrack");
  var viewport = document.getElementById("testimonialsViewport");
  var prevBtn = document.getElementById("testPrev");
  var nextBtn = document.getElementById("testNext");
  var dotsWrap = document.getElementById("testDots");

  if (track && viewport) {
    var slides = Array.prototype.slice.call(track.children);
    var currentIndex = 0;
    var autoTimer = null;

    function getVisibleCount() {
      if (window.innerWidth <= 767) return 1;
      if (window.innerWidth <= 1200) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, slides.length - getVisibleCount());
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      var total = getMaxIndex() + 1;
      for (var i = 0; i < total; i++) {
        (function (idx) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "slider-dot" + (idx === currentIndex ? " is-active" : "");
          dot.setAttribute("aria-label", "Go to testimonial " + (idx + 1));
          dot.addEventListener("click", function () {
            goToSlide(idx);
            restartAuto();
          });
          dotsWrap.appendChild(dot);
        })(i);
      }
    }

    function goToSlide(index) {
      var max = getMaxIndex();
      if (index > max) index = 0;
      if (index < 0) index = max;
      currentIndex = index;

      var cardWidth = slides[0].getBoundingClientRect().width;
      var gap = 24;
      track.style.transform = "translate3d(-" + (currentIndex * (cardWidth + gap)) + "px, 0, 0)";

      if (dotsWrap) {
        Array.prototype.slice.call(dotsWrap.children).forEach(function (d, i) {
          d.classList.toggle("is-active", i === currentIndex);
        });
      }
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(function () {
        goToSlide(currentIndex + 1);
      }, 5000);
    }

    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function restartAuto() {
      stopAuto();
      startAuto();
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goToSlide(currentIndex - 1);
        restartAuto();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goToSlide(currentIndex + 1);
        restartAuto();
      });
    }

    /* Touch / Swipe Support */
    var touchStartX = 0;
    viewport.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAuto();
    }, { passive: true });

    viewport.addEventListener("touchend", function (e) {
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 45) {
        goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
      }
      startAuto();
    }, { passive: true });

    viewport.addEventListener("mouseenter", stopAuto);
    viewport.addEventListener("mouseleave", startAuto);

    window.addEventListener("resize", function () {
      buildDots();
      goToSlide(Math.min(currentIndex, getMaxIndex()));
    });

    buildDots();
    goToSlide(0);
    startAuto();
  }

  /* ---------- 7. Modal Helpers ---------- */
  var isScrollLocked = false;
  var lockedScrollY = 0;

  function lockPageScroll() {
    if (isScrollLocked) return;
    isScrollLocked = true;
    lockedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    var scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.classList.add("modal-scroll-lock");
    body.classList.add("modal-scroll-lock");
    body.style.top = -lockedScrollY + "px";
    if (scrollbarGap > 0) {
      body.style.paddingRight = scrollbarGap + "px";
    }
  }

  function unlockPageScroll() {
    if (!isScrollLocked) return;
    isScrollLocked = false;
    var prevBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    document.documentElement.classList.remove("modal-scroll-lock");
    body.classList.remove("modal-scroll-lock");
    body.style.top = "";
    body.style.paddingRight = "";
    window.scrollTo(0, lockedScrollY);
    document.documentElement.style.scrollBehavior = prevBehavior;
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    lockPageScroll();
  }

  function closeAllModals() {
    document.querySelectorAll(".lux-modal.is-open").forEach(function (m) {
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden", "true");
    });
    unlockPageScroll();
    stopCinemaReel();
  }

  document.querySelectorAll(".lux-modal__backdrop").forEach(function (backdrop) {
    backdrop.addEventListener("wheel", function (e) { e.preventDefault(); }, { passive: false });
    backdrop.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });
  });

  document.querySelectorAll("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", closeAllModals);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeDrawer();
      closeAllModals();
    }
  });

  /* ---------- 8. Instagram Gallery Lightbox ---------- */
  var lightboxModal = document.getElementById("lightboxModal");
  var lbImage = document.getElementById("lbImage");
  var lbCaption = document.getElementById("lbCaption");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var galleryBtns = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox-src]"));
  var lbIndex = 0;

  function showLightboxImage(idx) {
    if (!galleryBtns.length) return;
    lbIndex = (idx + galleryBtns.length) % galleryBtns.length;
    var btn = galleryBtns[lbIndex];
    lbImage.src = btn.getAttribute("data-lightbox-src");
    lbImage.alt = btn.getAttribute("data-lightbox-caption") || "Zanzibar gallery photo";
    lbCaption.textContent = btn.getAttribute("data-lightbox-caption") || "";
  }

  galleryBtns.forEach(function (btn, index) {
    btn.addEventListener("click", function () {
      showLightboxImage(index);
      openModal(lightboxModal);
    });
  });

  if (lbPrev) lbPrev.addEventListener("click", function () { showLightboxImage(lbIndex - 1); });
  if (lbNext) lbNext.addEventListener("click", function () { showLightboxImage(lbIndex + 1); });

  document.addEventListener("keydown", function (e) {
    if (!lightboxModal || !lightboxModal.classList.contains("is-open")) return;
    if (e.key === "ArrowLeft") showLightboxImage(lbIndex - 1);
    if (e.key === "ArrowRight") showLightboxImage(lbIndex + 1);
  });

  /* ---------- 9. Cinema Video Showcase Modal ---------- */
  var videoModal = document.getElementById("videoModal");
  var openVideoTriggers = document.querySelectorAll("[data-open-video], #openVideoModal");
  var zanzibarVideoFrame = document.getElementById("zanzibarVideoFrame");

  function startCinemaReel() {
    if (zanzibarVideoFrame) {
      var videoSrc = zanzibarVideoFrame.getAttribute("data-src");
      if (videoSrc) zanzibarVideoFrame.setAttribute("src", videoSrc);
    }
  }

  function stopCinemaReel() {
    if (zanzibarVideoFrame) {
      zanzibarVideoFrame.setAttribute("src", "");
    }
  }

  if (openVideoTriggers.length && videoModal) {
    openVideoTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openModal(videoModal);
        startCinemaReel();
      });
    });
  }

  /* ---------- 10. Request Quote Modal ---------- */
  var quoteModal = document.getElementById("quoteModal");
  var quoteForm = document.getElementById("quoteForm");
  var qError = document.getElementById("qError");
  var sendQuoteEmail = document.getElementById("sendQuoteEmail");

  document.querySelectorAll("[data-open-quote]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      closeDrawer();
      openModal(quoteModal);
    });
  });

  function buildQuoteMessage() {
    var name = (document.getElementById("q-name").value || "").trim();
    var email = (document.getElementById("q-email").value || "").trim();
    var dates = (document.getElementById("q-dates").value || "").trim() || "Flexible";
    var guests = document.getElementById("q-guests").value || "2";
    var interest = document.getElementById("q-interest").value || "Zanzibar Island Tours";
    var notes = (document.getElementById("q-notes").value || "").trim();

    if (!name || !email || email.indexOf("@") === -1) {
      if (qError) qError.textContent = "Please enter your name and a valid email address.";
      return null;
    }
    if (qError) qError.textContent = "";

    return "Hello Ukindu Tour & Safari!\n" +
      "Name: " + name + "\n" +
      "Email: " + email + "\n" +
      "Travel Dates: " + dates + "\n" +
      "Travelers: " + guests + "\n" +
      "Interest: " + interest +
      (notes ? "\nNotes: " + notes : "");
  }

  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = buildQuoteMessage();
      if (!msg) return;
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
      closeAllModals();
    });
  }

  if (sendQuoteEmail) {
    sendQuoteEmail.addEventListener("click", function () {
      var msg = buildQuoteMessage();
      if (!msg) return;
      window.open("mailto:" + EMAIL + "?subject=" + encodeURIComponent("Zanzibar Tour Quote Request") + "&body=" + encodeURIComponent(msg), "_blank", "noopener");
      closeAllModals();
    });
  }

  /* ---------- 11. Legal Modals (Privacy Policy / Terms) ---------- */
  var legalModal = document.getElementById("legalModal");
  var legalTitle = document.getElementById("legalModalTitle");
  var legalBody = document.getElementById("legalModalBody");

  var legalContent = {
    privacy: {
      title: "Privacy Policy",
      html: "<p>Ukindu Tour &amp; Safari respects your privacy and protects your personal information.</p>" +
        "<h4>Information We Collect</h4><p>We only collect details you voluntarily share when requesting a tour quote or transfer booking—such as your name, email, WhatsApp number, hotel pickup location, and travel dates.</p>" +
        "<h4>How We Use It</h4><p>Your information is used solely to coordinate your Zanzibar tours, Tanzania safaris, and airport transfers. We never sell or share your personal data with third-party marketers.</p>"
    },
    terms: {
      title: "Terms & Conditions",
      html: "<p>All private Zanzibar tours, transfers, and Tanzania safaris are operated by Ukindu Tour &amp; Safari based in Marumbi, Zanzibar.</p>" +
        "<h4>Bookings &amp; Flexibility</h4><p>Tour reservations can be confirmed via WhatsApp or email. Free date adjustments are available when requested at least 24 hours in advance, subject to park or boat availability.</p>" +
        "<h4>Weather &amp; Marine Safety</h4><p>For ocean excursions such as Mnemba Atoll and Safari Blue, routes and timing may be adjusted by our licensed captains to ensure guest safety and comfort.</p>"
    }
  };

  document.querySelectorAll("[data-legal-modal]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var key = link.getAttribute("data-legal-modal");
      var data = legalContent[key];
      if (!data) return;
      legalTitle.textContent = data.title;
      legalBody.innerHTML = data.html;
      openModal(legalModal);
    });
  });

  /* ---------- 12. Hero Featured Tour Slider (3 Half Day, 3 Full Day, 3 Safari) ---------- */
  var hsTrack = document.getElementById("hsTrack");
  var hsViewport = document.getElementById("hsViewport");
  var hsPrev = document.getElementById("hsPrev");
  var hsNext = document.getElementById("hsNext");
  var hsCount = document.getElementById("hsCount");
  var hsTabs = document.querySelectorAll(".hs-tab[data-hs-group]");

  if (hsTrack && hsViewport) {
    var hsSlides = Array.prototype.slice.call(hsTrack.children);
    var hsIndex = 0;
    var hsTimer = null;

    function updateHeroSlider(idx) {
      hsIndex = (idx + hsSlides.length) % hsSlides.length;
      hsTrack.style.transform = "translate3d(-" + (hsIndex * 100) + "%, 0, 0)";
      if (hsCount) hsCount.textContent = (hsIndex + 1) + " / " + hsSlides.length;

      var activeGroup = hsSlides[hsIndex].getAttribute("data-group");
      hsTabs.forEach(function (tab) {
        tab.classList.toggle("is-active", tab.getAttribute("data-hs-group") === activeGroup);
      });
    }

    function startHsAuto() {
      stopHsAuto();
      hsTimer = setInterval(function () {
        updateHeroSlider(hsIndex + 1);
      }, 4500);
    }

    function stopHsAuto() {
      if (hsTimer) {
        clearInterval(hsTimer);
        hsTimer = null;
      }
    }

    hsTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var group = tab.getAttribute("data-hs-group");
        var firstIdx = hsSlides.findIndex(function (s) {
          return s.getAttribute("data-group") === group;
        });
        if (firstIdx !== -1) {
          updateHeroSlider(firstIdx);
          startHsAuto();
        }
      });
    });

    if (hsPrev) {
      hsPrev.addEventListener("click", function () {
        updateHeroSlider(hsIndex - 1);
        startHsAuto();
      });
    }
    if (hsNext) {
      hsNext.addEventListener("click", function () {
        updateHeroSlider(hsIndex + 1);
        startHsAuto();
      });
    }

    var hsStartX = 0;
    hsViewport.addEventListener("touchstart", function (e) {
      hsStartX = e.changedTouches[0].screenX;
      stopHsAuto();
    }, { passive: true });

    hsViewport.addEventListener("touchend", function (e) {
      var diff = hsStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 40) {
        updateHeroSlider(diff > 0 ? hsIndex + 1 : hsIndex - 1);
      }
      startHsAuto();
    }, { passive: true });

    var hsWrap = document.getElementById("heroTourSlider");
    if (hsWrap) {
      hsWrap.addEventListener("mouseenter", stopHsAuto);
      hsWrap.addEventListener("mouseleave", startHsAuto);
    }

    updateHeroSlider(0);
    startHsAuto();
  }

  /* ---------- 13. Fast-Loading Hero Background Video ---------- */
  var heroBgVideo = document.getElementById("heroBgVideo");
  if (heroBgVideo) {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var saveData = conn && conn.saveData;
    var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (saveData || prefersReduced) {
      heroBgVideo.pause();
      heroBgVideo.removeAttribute("autoplay");
    } else {
      heroBgVideo.muted = true;
      var tryPlayHero = function () {
        var playPromise = heroBgVideo.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      };

      tryPlayHero();
      heroBgVideo.addEventListener("canplay", tryPlayHero, { once: true });

      if ("IntersectionObserver" in window) {
        var heroSection = document.getElementById("hero") || heroBgVideo;
        var heroObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              tryPlayHero();
            } else {
              heroBgVideo.pause();
            }
          });
        }, { threshold: 0.05 });
        heroObserver.observe(heroSection);
      }
    }
  }

  /* ---------- 14. Dynamic Copyright Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
