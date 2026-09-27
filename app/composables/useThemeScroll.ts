import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Ref } from 'vue'

/**
 * Each section carries its own palette (data-theme); as one reaches the middle
 * of the screen the whole site eases into its colours and the header names it
 * (data-index, data-chapter). Covers the page's sections and the footer.
 */
export function useThemeScroll(root: Ref<HTMLElement | null | undefined>) {
  const chapter = useChapter()

  useScene(root, ({ motion }) => {
    const html = document.documentElement
    const sections = [...document.querySelectorAll<HTMLElement>('main [data-theme], footer[data-theme]')]

    const apply = (el: HTMLElement, immediate = false) => {
      if (el.dataset.chapter) chapter.value = { index: el.dataset.index ?? '', title: el.dataset.chapter }
      if (!motion) return
      const style = getComputedStyle(el)
      const token = (name: string) => style.getPropertyValue(`--theme-${name}`).trim()
      gsap.to(html, {
        '--bg': token('bg'),
        '--fg': token('fg'),
        '--muted': token('muted'),
        '--accent': token('accent'),
        '--line': token('line'),
        duration: immediate ? 0 : 1.1,
        ease: 'power2.inOut',
        overwrite: true,
      })
    }

    for (const el of sections) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) apply(el)
        },
      })
    }
    ScrollTrigger.sort()
    ScrollTrigger.refresh()
    apply(sections[0]!, true)

    return () => gsap.set(html, { clearProps: '--bg,--fg,--muted,--accent,--line' })
  })
}
