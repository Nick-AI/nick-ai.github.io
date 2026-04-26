(function () {
  const CELL_SIZE = 12;
  const TICK_MS = 120;

  let canvas, ctx, cols, rows, grid, nextGrid;
  let lastTick = 0;
  let running = true;
  let animId;

  function init() {
    canvas = document.getElementById("gol-canvas");
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    resize();
    seed();
    loop(0);

    window.addEventListener("resize", debounce(resize, 200));

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        running = false;
      } else {
        running = true;
        lastTick = 0;
        loop(0);
      }
    });
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    cols = Math.floor(canvas.width / CELL_SIZE);
    rows = Math.floor(canvas.height / CELL_SIZE);
    seed();
  }

  function seed() {
    grid = new Uint8Array(cols * rows);
    nextGrid = new Uint8Array(cols * rows);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = Math.random() < 0.15 ? 1 : 0;
    }
  }

  function step() {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const neighbors = countNeighbors(x, y);
        const idx = y * cols + x;
        if (grid[idx]) {
          nextGrid[idx] = neighbors === 2 || neighbors === 3 ? 1 : 0;
        } else {
          nextGrid[idx] = neighbors === 3 ? 1 : 0;
        }
      }
    }
    [grid, nextGrid] = [nextGrid, grid];
  }

  function countNeighbors(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = (x + dx + cols) % cols;
        const ny = (y + dy + rows) % rows;
        count += grid[ny * cols + nx];
      }
    }
    return count;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const style = getComputedStyle(document.documentElement);
    const cellColor = style.getPropertyValue("--gol-cell").trim();

    ctx.fillStyle = cellColor;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y * cols + x]) {
          ctx.fillRect(
            x * CELL_SIZE + 1,
            y * CELL_SIZE + 1,
            CELL_SIZE - 2,
            CELL_SIZE - 2
          );
        }
      }
    }
  }

  function loop(timestamp) {
    if (!running) return;

    if (timestamp - lastTick >= TICK_MS) {
      step();
      lastTick = timestamp;
    }

    draw();
    animId = requestAnimationFrame(loop);
  }

  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
