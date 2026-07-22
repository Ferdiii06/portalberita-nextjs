// lib/useGsapAnimation.js
// SSR-safe GSAP utilities untuk Next.js (Pages Router)
// Semua animasi hanya dijalankan di sisi klien melalui useEffect

import { useEffect } from 'react';

/**
 * Daftarkan plugin GSAP secara SSR-safe.
 * Panggil di useEffect komponen yang membutuhkan ScrollTrigger.
 */
export async function registerGsapPlugins() {
  const gsap = (await import('gsap')).default;
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

/**
 * Fade + slide-up entrance untuk satu elemen atau selector.
 * @param {string|Element|NodeList} target - Selector CSS atau DOM element
 * @param {object} opts - Override GSAP vars
 */
export async function gsapFadeUp(target, opts = {}) {
  const gsap = (await import('gsap')).default;
  return gsap.from(target, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    ...opts,
  });
}

/**
 * Stagger fade-up untuk kumpulan elemen (mis. cards, list items).
 * @param {string|NodeList} targets
 * @param {object} opts
 */
export async function gsapStaggerUp(targets, opts = {}) {
  const gsap = (await import('gsap')).default;
  return gsap.from(targets, {
    opacity: 0,
    y: 50,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.1,
    ...opts,
  });
}

/**
 * Slide-in dari kanan.
 * @param {string|Element} target
 * @param {object} opts
 */
export async function gsapSlideInRight(target, opts = {}) {
  const gsap = (await import('gsap')).default;
  return gsap.from(target, {
    opacity: 0,
    x: 60,
    duration: 0.8,
    ease: 'power3.out',
    ...opts,
  });
}

/**
 * Slide-in dari kiri.
 */
export async function gsapSlideInLeft(target, opts = {}) {
  const gsap = (await import('gsap')).default;
  return gsap.from(target, {
    opacity: 0,
    x: -60,
    duration: 0.8,
    ease: 'power3.out',
    ...opts,
  });
}

/**
 * ScrollTrigger batch: animasi stagger untuk elemen yang masuk viewport.
 * Ideal untuk grid NewsCard yang banyak.
 * @param {string} selector - CSS selector untuk target elemen
 * @param {object} opts - Override BatchVars
 */
export async function gsapScrollBatch(selector, opts = {}) {
  const { gsap, ScrollTrigger } = await registerGsapPlugins();
  ScrollTrigger.batch(selector, {
    onEnter: (elements) => {
      gsap.from(elements, {
        opacity: 0,
        y: 50,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
        ...opts,
      });
    },
    once: true,
  });
}

/**
 * ScrollTrigger fade-up untuk satu elemen saat masuk viewport.
 */
export async function gsapScrollFadeUp(target, opts = {}) {
  const { gsap, ScrollTrigger } = await registerGsapPlugins();
  gsap.from(target, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: target,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    ...opts,
  });
}

/**
 * ScrollTrigger stagger untuk kumpulan elemen.
 */
export async function gsapScrollStagger(targets, triggerEl, opts = {}) {
  const { gsap, ScrollTrigger } = await registerGsapPlugins();
  gsap.from(targets, {
    opacity: 0,
    y: 40,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: {
      trigger: triggerEl || targets,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    ...opts,
  });
}

/**
 * Hook: animasi entrance satu kali saat komponen mount.
 * @param {Function} animateFn - fungsi async yang menjalankan animasi GSAP
 * @param {Array} deps - dependency array untuk useEffect
 */
export function useGsapEntrance(animateFn, deps = []) {
  useEffect(() => {
    let ctx;
    (async () => {
      const gsap = (await import('gsap')).default;
      ctx = gsap.context(animateFn);
    })();
    return () => ctx?.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
