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
