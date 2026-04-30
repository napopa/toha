// Priority+ navigation: when the navbar is in expanded mode (≥xl breakpoint),
// progressively move overflowing nav items into a "More" dropdown until
// everything fits, and restore them when space allows.

const setup = () => {
  const nav = document.getElementById('primary-nav');
  const overflow = document.getElementById('nav-overflow');
  const overflowMenu = document.getElementById('nav-overflow-menu');
  const navbar = document.getElementById('top-navbar');
  if (!nav || !overflow || !overflowMenu || !navbar) return;

  const isCollapsed = () => {
    // Bootstrap toggles the .navbar-toggler visibility based on expand breakpoint.
    // When the toggler is visible, we're in mobile/hamburger mode and priority+ should not run.
    const toggler = document.getElementById('navbar-toggler');
    if (!toggler) return false;
    return window.getComputedStyle(toggler).display !== 'none';
  };

  const collapseOne = () => {
    // Move the last *real* nav item (excluding the overflow li itself) into the dropdown,
    // at the *top* of the menu so order reads naturally.
    const items = Array.from(nav.children).filter(
      (el) => el !== overflow && !el.classList.contains('nav-overflow'),
    );
    if (items.length <= 1) return false; // keep at least Home visible
    const last = items[items.length - 1];
    const link = last.querySelector('a.nav-link');
    if (!link) return false;
    const dropdownItem = document.createElement('a');
    dropdownItem.className = 'dropdown-item';
    dropdownItem.href = link.getAttribute('href');
    dropdownItem.textContent = link.textContent.trim();
    dropdownItem.dataset.fromNav = 'true';
    overflowMenu.insertBefore(dropdownItem, overflowMenu.firstChild);
    last.dataset.collapsedHref = link.getAttribute('href');
    last.dataset.collapsedText = link.textContent.trim();
    last.remove();
    return true;
  };

  const restoreOne = () => {
    const first = overflowMenu.firstElementChild;
    if (!first) return false;
    const li = document.createElement('li');
    li.className = 'nav-item';
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = first.getAttribute('href');
    a.textContent = first.textContent.trim();
    li.appendChild(a);
    nav.insertBefore(li, overflow);
    first.remove();
    return true;
  };

  const apply = () => {
    if (isCollapsed()) {
      // Mobile: restore everything so the hamburger panel shows the full list.
      while (restoreOne()) {}
      overflow.hidden = true;
      return;
    }

    // Reveal the overflow toggle so width measurements are honest.
    overflow.hidden = overflowMenu.children.length === 0;

    const containerRight = navbar.querySelector('.container').getBoundingClientRect().right;
    let safety = 50;

    // Collapse while the nav extends past the container.
    while (safety-- > 0 && nav.getBoundingClientRect().right > containerRight + 1) {
      if (!collapseOne()) break;
      overflow.hidden = false;
    }

    // Try to restore items if there's room.
    safety = 50;
    while (safety-- > 0 && overflowMenu.children.length > 0) {
      // Tentatively restore and re-measure.
      if (!restoreOne()) break;
      if (nav.getBoundingClientRect().right > containerRight + 1) {
        // Overshot; collapse one back and stop.
        collapseOne();
        break;
      }
    }

    overflow.hidden = overflowMenu.children.length === 0;
  };

  // Run after layout settles; rAF avoids fighting font-loading reflow.
  let raf = 0;
  const schedule = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(apply);
  };

  schedule();
  window.addEventListener('resize', schedule);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(schedule).catch(() => {});
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}
