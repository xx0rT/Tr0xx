import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, CustomEase)

/* One ease for the whole site: a long, confident settle. */
export const EASE = CustomEase.create('troxx', 'M0,0 C0.16,1 0.3,1 1,1')

export const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches

export { gsap, ScrollTrigger, ScrollSmoother, SplitText }
