import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { TransitionProps } from 'vue'
import { isPieceSlug, piece } from '~/data/pieces'

type Landing = { top: number } | { hash: string }

// Where the incoming page should open. The router's scrollBehavior records it
// (with the browser's saved position on back/forward) while the old page is
// still covered, and the transition applies it before the curtain lifts.
let landing: Landing = { top: 0 }

export function setLanding(value: Landing) {
  landing = value
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const frame = () => new Promise(resolve => requestAnimationFrame(resolve))

/** Names the destination on the curtain. */
function labelFor(path: string) {
  const [, section, slug] = path.split('/')
  if (section === 'collection' && isPieceSlug(slug)) {
    const p = piece(slug)
    return { kicker: `Lot ${p.lot} · ${p.discipline.title}`, title: p.title }
  }
  if (section === 'collection') return { kicker: 'Fine jewelry, sculpture, artifacts & art', title: 'The collection' }
  return { kicker: 'Family-owned since 1963', title: 'About the house' }
}

/**
 * The page transition: a curtain rises over the old page, the new one mounts
 * and settles at its landing position underneath, then the curtain lifts.
 */
export function usePageTransition(): TransitionProps {
  const nuxtApp = useNuxtApp()
  const ready = useSiteReady()
  const label = useCurtainLabel()
  const menuOpen = useMenuOpen()
  const router = useRouter()

  const curtain = () => document.querySelector<HTMLElement>('.curtain')

  return {
    mode: 'out-in',
    css: false,

    onLeave(_el, done) {
      const el = curtain()
      label.value = labelFor(router.currentRoute.value.path)
      if (nuxtApp.$reducedMotion || !el) return done()
      nuxtApp.$lenis?.stop()
      ready.value = false
      gsap.killTweensOf(el)
      gsap.timeline({ onComplete: () => done() })
        .set(el, { visibility: 'visible' })
        .fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.95, ease: 'expo.inOut' })
        .fromTo(el.querySelectorAll('.curtain__line'), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.07, ease: 'expo.out' }, 0.45)
        .fromTo(el.querySelector('.curtain__bar'), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, 0.3)
    },

    async onEnter(el, done) {
      menuOpen.value = false
      const c = curtain()
      // Let the page mount its scenes, and its lead image decode, before revealing it.
      await frame()
      const lead = (el as HTMLElement).querySelector<HTMLImageElement>('img[fetchpriority="high"]')
      await Promise.race([lead?.decode().catch(() => {}), wait(1500)])
      ScrollTrigger.refresh()
      const to = landing
      landing = { top: 0 }
      if ('hash' in to) {
        const target = document.querySelector<HTMLElement>(to.hash)
        if (target) nuxtApp.$lenis ? nuxtApp.$lenis.scrollTo(target, { immediate: true, force: true }) : target.scrollIntoView()
      }
      else {
        nuxtApp.$lenis?.scrollTo(to.top, { immediate: true, force: true })
        window.scrollTo(0, to.top)
      }
      ScrollTrigger.update()

      if (nuxtApp.$reducedMotion || !c) {
        ready.value = true
        return done()
      }
      gsap.timeline({
        onComplete: () => {
          gsap.set(c, { visibility: 'hidden' })
          done()
        },
      })
        .to(c.querySelectorAll('.curtain__line'), { yPercent: -110, duration: 0.6, stagger: 0.05, ease: 'expo.in' }, 0)
        .to(c.querySelector('.curtain__bar'), { scaleX: 0, transformOrigin: 'right', duration: 0.6, ease: 'power3.in' }, 0)
        .to(c, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, 0.35)
        .add(() => {
          ready.value = true
          nuxtApp.$lenis?.start()
        }, 0.75)
        .set(c.querySelector('.curtain__bar'), { transformOrigin: 'left' })
    },
  }
}
