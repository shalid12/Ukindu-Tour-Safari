/* Accessible FAQ accordion with one open answer per topic. */
(function () {
  "use strict";

  function closeItem(item) {
    var button = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    if (!button || !answer) return;
    button.setAttribute("aria-expanded", "false");
    answer.hidden = true;
    item.classList.remove("is-open");
  }

  document.querySelectorAll(".faq-question").forEach(function (button) {
    button.addEventListener("click", function () {
      var item = button.closest("[data-faq-item]");
      var answer = item && item.querySelector(".faq-answer");
      if (!item || !answer) return;
      var open = button.getAttribute("aria-expanded") !== "true";
      var group = item.closest(".faq-section");
      if (open && group) {
        group.querySelectorAll("[data-faq-item].is-open").forEach(function (other) {
          if (other !== item) closeItem(other);
        });
      }
      button.setAttribute("aria-expanded", open ? "true" : "false");
      answer.hidden = !open;
      item.classList.toggle("is-open", open);
    });
  });
})();
