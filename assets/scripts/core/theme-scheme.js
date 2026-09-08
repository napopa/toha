// Resolve the colour scheme before first paint.
//
// This file is inlined into <head> by index.html and baseof.html, so it runs
// ahead of any rendering and the correct theme is in place on the first frame.
// Do not defer it or move it into the bundle; either reintroduces a flash of
// the wrong theme.
//
// Default is 'system', which follows the OS setting. An explicit 'light' or
// 'dark' in localStorage still wins, so a stored preference from the theme
// switcher (when one is present) is respected.
let theme = localStorage.getItem('theme-scheme') || localStorage.getItem('darkmode:color-scheme') || 'system'
if (theme === 'system') {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = 'dark'
  } else {
    theme = 'light'
  }
}
document.documentElement.setAttribute('data-theme', theme)

// Follow the OS if it changes mid-session, but only while no explicit
// preference is stored.
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const stored = localStorage.getItem('theme-scheme') || localStorage.getItem('darkmode:color-scheme')
    if (stored && stored !== 'system') return
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
  })
}
