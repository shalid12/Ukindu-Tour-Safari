/* Reusable Luxury Tour Detail Gallery Lightbox */
(function () {
  "use strict";

  var modal = document.getElementById("tdLightbox");
  var lbImg = document.getElementById("tdLbImage");
  var lbCap = document.getElementById("tdLbCaption");
  var lbPrev = document.getElementById("tdLbPrev");
  var lbNext = document.getElementById("tdLbNext");
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-td-photo]"));
  var current = 0;

  if (!modal || !triggers.length) return;

  function show(idx) {
    current = (idx + triggers.length) % triggers.length;
    var el = triggers[current];
    lbImg.src = el.getAttribute("data-td-photo");
    lbImg.alt = "Tour photo";
    if (lbCap) {
      lbCap.textContent = "";
      lbCap.style.display = "none";
    }
  }

  var isScrollLocked = false;
  var lockedScrollY = 0;

  function lockPageScroll() {
    if (isScrollLocked) return;
    isScrollLocked = true;
    lockedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    var scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.top = -lockedScrollY + "px";
    document.body.style.touchAction = "none";
    if (scrollbarGap > 0) {
      document.body.style.paddingRight = scrollbarGap + "px";
    }
  }

  function unlockPageScroll() {
    if (!isScrollLocked) return;
    isScrollLocked = false;
    var prevBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    document.documentElement.style.overflow = "";
    document.documentElement.style.overscrollBehavior = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.top = "";
    document.body.style.touchAction = "";
    document.body.style.paddingRight = "";
    window.scrollTo(0, lockedScrollY);
    document.documentElement.style.scrollBehavior = prevBehavior;
  }

  function open(idx) {
    show(idx);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    lockPageScroll();
  }

  function close() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    unlockPageScroll();
  }

  modal.addEventListener("wheel", function (e) { e.preventDefault(); }, { passive: false });
  modal.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });

  triggers.forEach(function (btn, i) {
    btn.addEventListener("click", function () { open(i); });
  });

  document.querySelectorAll("[data-td-open-gallery]").forEach(function (btn) {
    btn.addEventListener("click", function () { open(0); });
  });

  if (lbPrev) lbPrev.addEventListener("click", function () { show(current - 1); });
  if (lbNext) lbNext.addEventListener("click", function () { show(current + 1); });

  modal.querySelectorAll("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
})();
