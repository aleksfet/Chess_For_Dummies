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

/* =====================================================
   LEARNING BOARD — "Click a piece to see how it moves"
   Clicking a piece highlights the squares it could move
   to. This only DEMONSTRATES movement patterns (it ignores
   other pieces and does not actually move anything).
   ===================================================== */
const board = document.querySelector(".chessboard");

if (board) {
  // All 64 squares, in order (index 0 = top-left, index 63 = bottom-right)
  const squares = Array.from(board.querySelectorAll(".sq"));

  // Look up a square by its data-row / data-col, or null if it's off the board
  function squareAt(row, col) {
    if (row < 0 || row > 7 || col < 0 || col > 7) return null;
    return board.querySelector('.sq[data-row="' + row + '"][data-col="' + col + '"]');
  }

  // Remove all current highlights from the board
  function clearHints() {
    squares.forEach(function (sq) {
      sq.classList.remove("hint", "selected");
    });
  }

  // Work out which squares a piece can move to.
  // We ignore other pieces on purpose, so the full movement
  // pattern is shown for learning.
  function getMoveSquares(row, col, type, color) {
    const isWhite = color === "white";
    const targets = [];

    const straight = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const diagonal = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

    // Sliding pieces (rook, bishop, queen) travel until the board edge
    function slide(directions) {
      directions.forEach(function (d) {
        let r = row + d[0];
        let c = col + d[1];
        while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
          targets.push([r, c]);
          r += d[0];
          c += d[1];
        }
      });
    }

    // Stepping pieces (king, knight, pawn) move a fixed set of single steps
    function step(steps) {
      steps.forEach(function (d) {
        const r = row + d[0];
        const c = col + d[1];
        if (r >= 0 && r <= 7 && c >= 0 && c <= 7) targets.push([r, c]);
      });
    }

    if (type === "rook") {
      slide(straight);
    } else if (type === "bishop") {
      slide(diagonal);
    } else if (type === "queen") {
      slide(straight);
      slide(diagonal);
    } else if (type === "king") {
      step(straight.concat(diagonal));
    } else if (type === "knight") {
      step([[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]);
    } else if (type === "pawn") {
      // White pawns move up the board (toward row 0), black move down (toward row 7).
      // White start row is 6, black start row is 1.
      const dir = isWhite ? -1 : 1;
      const startRow = isWhite ? 6 : 1;
      step([[dir, 0]]);             // one square forward
      // From its starting square a pawn may also move forward two squares.
      if (row === startRow) step([[dir * 2, 0]]);
      step([[dir, -1], [dir, 1]]);  // the two diagonal capture-direction squares
    }

    return targets;
  }

  // Highlight the piece on a square plus all the squares it can reach
  function showHintsForSquare(sq) {
    const type = sq.dataset.piece;
    if (!type) return; // empty square — nothing to show

    const row = Number(sq.dataset.row);
    const col = Number(sq.dataset.col);
    const color = sq.dataset.color;

    clearHints();
    sq.classList.add("selected");

    getMoveSquares(row, col, type, color).forEach(function (pos) {
      const target = squareAt(pos[0], pos[1]);
      if (target) target.classList.add("hint");
    });
  }

  squares.forEach(function (sq) {
    // Give piece squares a pointer cursor so they look clickable
    if (sq.dataset.piece) sq.classList.add("clickable");

    sq.addEventListener("click", function () {
      if (sq.dataset.piece) {
        showHintsForSquare(sq); // clicked a piece → show its moves
      } else {
        clearHints();           // clicked an empty square → clear
      }
    });
  });

  // Clicking anywhere outside the board clears the hints too
  document.addEventListener("click", function (event) {
    if (!board.contains(event.target)) clearHints();
  });
}
