import Filterizr from 'filterizr'
import { insertScript } from '../core'

document.addEventListener('DOMContentLoaded', () => {
  // ================== Project cards =====================

  // setup project filter buttons for all project sections
  const projectContainers = document.querySelectorAll('.filtr-projects')
  projectContainers.forEach((container) => {
    const sectionId = container.getAttribute('data-section')
    const cardHolder = document.getElementById(`project-card-holder-${sectionId}`)
    if (cardHolder != null && cardHolder.children.length !== 0) {
      // Create a unique selector for this section's controls
      const controlsSelector = `.project-filtr-control[data-section="${sectionId}"]`
      // eslint-disable-next-line no-new
      new Filterizr(container, {
        layout: 'sameWidth',
        controlsSelector
      })
    }
  })
})

// Dynamically insert the GitHub buttons script, but only when the page
// actually renders a star button.
//
// This used to run unconditionally at module scope, so every page fetched
// buttons.github.io even on sites with no projects section at all: a
// third-party request, and a visitor-facing privacy leak, for markup that was
// never on the page. Guarding it also keeps the default Content-Security-Policy
// tight, since no external script origin needs allowing when no button exists.
if (document.querySelector('.github-button') !== null) {
  insertScript('github-buttons', 'https://buttons.github.io/buttons.js')
}
