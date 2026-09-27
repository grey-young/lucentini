import type { RouterConfig } from '@nuxt/schema'

// Scrolling between pages happens under the transition curtain (see
// usePageTransition), so the router only records where the next page lands.
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path) return false
    setLanding(savedPosition ? { top: savedPosition.top } : to.hash ? { hash: to.hash } : { top: 0 })
    return false
  },
}
