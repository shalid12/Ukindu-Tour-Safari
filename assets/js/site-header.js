/* Shared luxury header, mobile drawer & back-to-top interactions for all pages */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var body = document.body;
  var drawer = document.getElementById("drawer");
  var openButtons = document.querySelectorAll("[data-drawer-open]");

  /* Inject Back-To-Top button if not already present */
  var backToTop = document.getElementById("backToTop");
  if (!backToTop) {
    backToTop = document.createElement("button");
    backToTop.id = "backToTop";
    backToTop.type = "button";
    backToTop.className = "back-to-top";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(backToTop);
  }
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function updateHeader() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 40);
    if (backToTop) backToTop.classList.toggle("is-visible", y > 400);
  }

  function closeDrawer() {
    body.classList.remove("drawer-open");
    if (drawer) drawer.setAttribute("aria-hidden", "true");
    openButtons.forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
    });
  }

  function openDrawer() {
    body.classList.add("drawer-open");
    if (drawer) {
      drawer.setAttribute("aria-hidden", "false");
      var firstControl = drawer.querySelector("button, a");
      if (firstControl) firstControl.focus();
    }
    openButtons.forEach(function (button) {
      button.setAttribute("aria-expanded", "true");
    });
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.querySelectorAll(".main-nav .nav-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      var item = button.parentElement;
      var isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  document.addEventListener("click", function (event) {
    document.querySelectorAll(".main-nav li.is-open").forEach(function (item) {
      if (!item.contains(event.target)) {
        item.classList.remove("is-open");
        var button = item.querySelector(".nav-toggle");
        if (button) button.setAttribute("aria-expanded", "false");
      }
    });
  });

  openButtons.forEach(function (button) {
    button.addEventListener("click", openDrawer);
  });
  document.querySelectorAll("[data-drawer-close]").forEach(function (element) {
    element.addEventListener("click", closeDrawer);
  });
  document.querySelectorAll(".drawer a").forEach(function (link) {
    link.addEventListener("click", closeDrawer);
  });
  document.querySelectorAll(".drawer .sub-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      var isOpen = button.parentElement.classList.toggle("is-open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeDrawer();
  });
})();
