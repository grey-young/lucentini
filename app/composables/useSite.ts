// Shared UI state for the site chrome.

/**
 * True while the page is uncovered: once the preloader lifts on arrival, and
 * again each time the page-transition curtain lifts. Intros play on it.
 */
export const useSiteReady = () => useState("site-ready", () => false);

export const useMenuOpen = () => useState("menu-open", () => false);

/** The chapter currently in view, shown in the header. */
export const useChapter = () =>
  useState("chapter", () => ({ index: "I", title: "Prologue" }));

/** What the page-transition curtain announces while it covers the screen. */
export const useCurtainLabel = () =>
  useState("curtain-label", () => ({ kicker: "", title: "" }));

/** Smooth-scrolls to an element (or a y offset) through Lenis when it is running. */
export function useScrollTo() {
  const { $lenis } = useNuxtApp();
  return (
    target: string | HTMLElement | number,
    options: { immediate?: boolean } = {},
  ) => {
    const el =
      typeof target === "string"
        ? document.querySelector<HTMLElement>(target)
        : target;
    if (el === null) return;
    if ($lenis)
      $lenis.scrollTo(el, {
        duration: 1.8,
        immediate: options.immediate,
        force: true,
        easing: (t) => 1 - (1 - t) ** 4,
      });
    else if (typeof el === "number") window.scrollTo(0, el);
    else el.scrollIntoView();
  };
}

/**
 * Follows a site link like `/about#contact`: scrolls when it points into the
 * current page, otherwise navigates (and the curtain covers the change).
 */
export function useGoTo() {
  const route = useRoute();
  const scrollTo = useScrollTo();
  return (href: string) => {
    const [path, hash] = href.split("#");
    if (!path || path === route.path) scrollTo(hash ? `#${hash}` : 0);
    else navigateTo(href);
  };
}
