/* Accessible FAQ accordion + instant live search across all topics */
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

  function openItem(item) {
    var button = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    if (!button || !answer) return;
    button.setAttribute("aria-expanded", "true");
    answer.hidden = false;
    item.classList.add("is-open");
  }

  document.querySelectorAll(".faq-question").forEach(function (button) {
    button.addEventListener("click", function () {
      var item = button.closest("[data-faq-item]");
      if (!item) return;
      var shouldOpen = button.getAttribute("aria-expanded") !== "true";
      var group = item.closest(".faq-section");
      if (shouldOpen && group) {
        group.querySelectorAll("[data-faq-item].is-open").forEach(function (other) {
          if (other !== item) closeItem(other);
        });
      }
      if (shouldOpen) {
        openItem(item);
      } else {
        closeItem(item);
      }
    });
  });

  /* Live Instant Search */
  var searchInput = document.getElementById("faqSearchInput");
  var clearBtn = document.getElementById("faqSearchClear");
  var statusEl = document.getElementById("faqSearchStatus");
  var emptyEl = document.getElementById("faqEmptyState");
  var resetBtn = document.getElementById("faqResetSearch");
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-faq-section]"));

  function runSearch() {
    if (!searchInput) return;
    var q = searchInput.value.trim().toLowerCase();
    if (clearBtn) clearBtn.classList.toggle("is-visible", q.length > 0);

    var totalMatches = 0;
    sections.forEach(function (sec) {
      var items = Array.prototype.slice.call(sec.querySelectorAll("[data-faq-item]"));
      var secMatches = 0;
      items.forEach(function (item) {
        var haystack = ((item.getAttribute("data-search") || "") + " " + item.textContent).toLowerCase();
        var match = !q || haystack.indexOf(q) !== -1;
        item.hidden = !match;
        if (match) {
          secMatches++;
          totalMatches++;
        } else {
          closeItem(item);
        }
      });
      sec.hidden = secMatches === 0;
    });

    if (emptyEl) emptyEl.hidden = totalMatches > 0;
    if (statusEl) {
      statusEl.textContent = q
        ? (totalMatches === 1 ? "Showing 1 matching answer" : "Showing " + totalMatches + " matching answers")
        : "";
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", runSearch);
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      searchInput.value = "";
      runSearch();
      searchInput.focus();
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      searchInput.value = "";
      runSearch();
      searchInput.focus();
    });
  }
})();
