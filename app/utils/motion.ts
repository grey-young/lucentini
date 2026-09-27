// Reusable scroll reveals. Call these inside useScene() so they are reverted
// with the component.
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

/** Lines rise out of a mask the first time the text scrolls into view. */
export function revealLines(target: Element, { start = 'top 86%', delay = 0 } = {}) {
  return SplitText.create(target, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit: self => gsap.from(self.lines, {
      yPercent: 110,
      duration: 1.2,
      delay,
      ease: 'expo.out',
      stagger: 0.09,
      scrollTrigger: { trigger: target, start, once: true },
    }),
  })
}

/** Characters rise line by line, for headings. */
export function revealChars(target: Element, { start = 'top 85%', delay = 0 } = {}) {
  return SplitText.create(target, {
    type: 'lines,chars',
    mask: 'lines',
    autoSplit: true,
    onSplit: self => gsap.from(self.chars, {
      yPercent: 115,
      rotate: 4,
      duration: 1.3,
      delay,
      ease: 'expo.out',
      stagger: 0.022,
      scrollTrigger: { trigger: target, start, once: true },
    }),
  })
}

/** A plate unveils from the bottom while its image settles from a zoom. */
export function revealPlate(frame: Element, { start = 'top 88%' } = {}) {
  const img = frame.querySelector('img')
  const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start, once: true } })
  tl.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
  if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0.15)
  return tl
}

/** Drifts an element against the scroll; positive amounts move it up faster. */
export function parallax(target: Element, amount: number, trigger: Element = target) {
  return gsap.fromTo(target, { y: amount }, {
    y: -amount,
    ease: 'none',
    scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
  })
}
