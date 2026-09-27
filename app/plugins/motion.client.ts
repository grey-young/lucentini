import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, Flip)
  ScrollTrigger.config({ ignoreMobileResize: true })

  // The story starts at the top: pinned chapters and the preloader both assume it.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let lenis: Lenis | undefined

  if (!reducedMotion) {
    document.documentElement.classList.add('has-motion')
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(time => lenis?.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  document.fonts?.ready.then(() => ScrollTrigger.refresh())

  return { provide: { lenis, reducedMotion } }
})
