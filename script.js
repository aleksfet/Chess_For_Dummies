/* =====================================================
   CHESS FOR DUMMIES — SCRIPT
   Smooth scrolling for navigation links.
   (CSS already enables scroll-behavior: smooth; this is
   a small fallback to make sure every anchor link glides
   smoothly to its section.)
   ===================================================== */

// Find every link that points to a section on this page (starts with "#")
const navLinks = document.querySelectorAll('a[href^="#"]');

// When a link is clicked, scroll smoothly to its target section
navLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    const targetId = link.getAttribute("href");      // e.g. "#learn"
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      event.preventDefault();                         // stop the instant jump
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* =====================================================
   CHESS HISTORY MODAL
   Opens a simple popup explaining the history of chess.
   Closes via the X button, clicking outside, or Escape.
   ===================================================== */
const historyBtn = document.getElementById("historyBtn");
const historyModal = document.getElementById("historyModal");
const historyClose = document.getElementById("historyClose");

function openHistoryModal() {
  historyModal.hidden = false;
}

function closeHistoryModal() {
  historyModal.hidden = true;
}

if (historyBtn && historyModal && historyClose) {
  // Open when the Chess History button is clicked
  historyBtn.addEventListener("click", openHistoryModal);

  // Close with the X button
  historyClose.addEventListener("click", closeHistoryModal);

  // Close when clicking on the dim overlay (outside the popup card)
  historyModal.addEventListener("click", function (event) {
    if (event.target === historyModal) {
      closeHistoryModal();
    }
  });

  // Close when pressing the Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !historyModal.hidden) {
      closeHistoryModal();
    }
  });
}
