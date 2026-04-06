/**
 * Plain-O Brewing — Navigation
 *
 * This script does two things:
 *   1. Highlights the nav link for the page you're currently on.
 *   2. Powers the hamburger menu button on mobile screens.
 *
 * Everything runs inside a 'DOMContentLoaded' listener, which means it
 * waits until the browser has fully parsed the HTML before it tries to
 * find any elements. If we ran this code immediately, the nav links
 * might not exist yet and we'd get errors.
 */

// Highlight active nav link based on current page
document.addEventListener('DOMContentLoaded', () => {

  /**
   * ACTIVE NAV LINK
   *
   * Grab every <a> tag inside the <nav> and figure out which one
   * matches the current page. We determine the current page by looking
   * at the URL's last "path segment" (the filename part).
   *
   * window.location.pathname on the events page looks like:
   *   "/pages/events.html"
   * split('/') breaks that into ["", "pages", "events.html"]
   * pop() takes the last item: "events.html"
   * If it's empty (e.g. the root URL "/"), we fall back to "index.html".
   */
  const links = document.querySelectorAll('nav a');
  const current = window.location.pathname.split('/').pop() || 'index.html';

  // Loop through every nav link and add 'active' class if its href matches
  links.forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    }
  });

  /**
   * HAMBURGER MENU (mobile only)
   *
   * On small screens the nav links are hidden by default. The hamburger
   * button (#nav-toggle) toggles a 'nav-open' class on the <header>,
   * which CSS uses to show/hide the nav dropdown.
   *
   * We also track whether the menu is open via the aria-expanded attribute.
   * This is an accessibility feature — screen readers use it to announce
   * whether the menu is currently open or closed.
   */
  const toggle = document.getElementById('nav-toggle');
  const header = document.querySelector('header');

  // Only set up the hamburger behavior if both elements actually exist on the page
  if (toggle && header) {

    // When the hamburger button is clicked, flip the menu open/closed
    toggle.addEventListener('click', () => {
      // classList.toggle adds the class if missing, removes it if present
      // It returns true if the class is now ON, false if now OFF
      const open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open); // tell screen readers the new state
    });

    // Close the menu automatically when the user taps a nav link
    // (otherwise the menu would stay open after navigating to a new page)
    document.querySelectorAll('nav a').forEach(a => {
      a.addEventListener('click', () => {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    /**
     * Close the menu when the user taps anywhere outside the header.
     * e.target is the element that was actually clicked.
     * header.contains(e.target) checks if that element is inside the header.
     * If it's NOT inside the header, the user clicked somewhere else — close the menu.
     */
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
