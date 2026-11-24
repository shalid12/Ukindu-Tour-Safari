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

  function open(idx) {
    show(idx);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

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
