import { gsap } from 'gsap'
import type { Ref } from 'vue'

export interface Scene {
  el: HTMLElement
  /** Selector scoped to the component root. */
  q: (selector: string) => HTMLElement[]
  motion: boolean
  desktop: boolean
  finePointer: boolean
}

/**
 * Runs a component's GSAP setup after mount inside a matchMedia context, so it
 * re-runs when the motion preference or breakpoint changes, and reverts every
 * tween, ScrollTrigger and SplitText it made when the component unmounts.
 */
export function useScene(root: Ref<HTMLElement | null | undefined>, setup: (scene: Scene) => void | (() => void)) {
  let mm: gsap.MatchMedia | undefined

  onMounted(() => {
    const el = root.value
    if (!el) return
    mm = gsap.matchMedia(el)
    mm.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 64rem)',
      finePointer: '(hover: hover) and (pointer: fine)',
    }, (context) => {
      const { motion, desktop, finePointer } = context.conditions as Record<string, boolean>
      const q = gsap.utils.selector(el) as Scene['q']
      return setup({ el, q, motion: !!motion, desktop: !!desktop, finePointer: !!finePointer })
    })
  })

  onBeforeUnmount(() => mm?.revert())
}
