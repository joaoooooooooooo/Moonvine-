import { useLayoutEffect, useRef } from "react";

// Each shared section owns its content; nested sections manage their own reveal.
export function useSectionReveal({ includeSections = false, repeat = false, together = false, enterVh = 76, exitVh = 55 } = {}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const container = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (container?.closest(".report-document") || !container || (!together && !window.IntersectionObserver) || preference.matches) return;

    const targets = [];
    function collect(parent) {
      for (const child of parent.children) {
        const explicitItem = child.hasAttribute('data-reveal-item');
        if (child.matches('[hidden], [data-reveal-skip], script, style') || (child.matches('[aria-hidden="true"]') && !explicitItem)) continue;
        if (child.matches('section') && !includeSections) continue;

        // Walk through layout wrappers so individual headings and grid cards
        // stagger, but keep cards, widgets, and animation canvases together.
        const hasText = Array.from(child.childNodes).some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
        );
        const isComponent = child.matches('[data-slot], [role], [data-reveal-item]')
          || child.querySelector(":scope > canvas, :scope > svg")
          || /(?:^|\s)(?:\S+:)?(?:border(?:-\S+)?|bg-\S+|rounded(?:-\S+)?|shadow(?:-\S+)?)(?:\s|$)/.test(child.className);
        const isLayout = child.tagName === "DIV"
          && child.children.length > 0 && !hasText && !isComponent;

        if (!explicitItem && (child.querySelector("section") || isLayout)) {
          collect(child);
        } else {
          targets.push(child);
        }
      }
    }
    collect(container);

    const inView = new WeakMap();
    let groupInView = false;
    let groupRevealed = false;
    function setGroupVisible(visible) {
      if (!repeat && groupRevealed) return;
      if (visible) groupRevealed = true;
      for (const target of targets) target.dataset.sectionReveal = visible ? "visible" : "pending";
    }
    const observer = together ? null : new IntersectionObserver((entries) => {
      let stagger = 0;
      for (const { target, isIntersecting } of entries) {
        inView.set(target, isIntersecting);
        if (isIntersecting) {
          target.style.setProperty("--reveal-stagger", Math.min(stagger++, 8));
          target.dataset.sectionReveal = "visible";
          if (!repeat) observer.unobserve(target);
        } else if (repeat && !target.contains(document.activeElement)) {
          target.dataset.sectionReveal = "pending";
        }
      }
    }, { threshold: 0, rootMargin: repeat ? "-12% 0px -12% 0px" : "0px" });

    for (const [index, target] of targets.entries()) {
      target.dataset.sectionReveal = "pending";
      if (repeat) target.dataset.revealRepeat = "";
      if (together) target.style.setProperty("--reveal-stagger", Math.min(index, 8));
      else observer.observe(target);
    }
    let frame = 0;
    let ready = false;
    function updateGroup() {
      frame = 0;
      if (!repeat && groupRevealed) return;
      const bounds = container.getBoundingClientRect();
      groupInView = bounds.top <= window.innerHeight * enterVh / 100
        && (!repeat || bounds.bottom >= window.innerHeight * exitVh / 100);
      setGroupVisible(groupInView || container.contains(document.activeElement));
      if (groupRevealed && !repeat) {
        window.removeEventListener("scroll", scheduleGroup);
        window.removeEventListener("resize", scheduleGroup);
      }
    }
    function scheduleGroup() {
      if (!ready) return;
      if (!frame) frame = requestAnimationFrame(updateGroup);
    }
    if (together && targets.length) {
      window.addEventListener("scroll", scheduleGroup, { passive: true });
      window.addEventListener("resize", scheduleGroup);
      // Let the pending state paint before revealing sections already in view.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          ready = true;
          updateGroup();
        });
      });
    }

    // Keyboard navigation must never focus content that is still transparent.
    function revealFocused(event) {
      if (together) {
        setGroupVisible(true);
        if (!repeat) {
          window.removeEventListener("scroll", scheduleGroup);
          window.removeEventListener("resize", scheduleGroup);
        }
        return;
      }
      for (const target of targets) {
        if (target.contains(event.target)) {
          if (repeat) target.dataset.sectionReveal = "visible";
          else {
            delete target.dataset.sectionReveal;
            observer?.unobserve(target);
          }
        }
      }
    }
    function concealUnfocused(event) {
      if (!repeat) return;
      if (together) {
        if (!container.contains(event.relatedTarget) && !groupInView) setGroupVisible(false);
        return;
      }
      for (const target of targets) {
        if (target.contains(event.target) && !target.contains(event.relatedTarget) && !inView.get(target)) {
          target.dataset.sectionReveal = "pending";
        }
      }
    }
    function reset() {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleGroup);
      window.removeEventListener("resize", scheduleGroup);
      for (const target of targets) {
        delete target.dataset.sectionReveal;
        delete target.dataset.revealRepeat;
        target.style.removeProperty("--reveal-stagger");
      }
    }
    function onPreferenceChange() {
      if (preference.matches) reset();
    }
    container.addEventListener("focusin", revealFocused);
    container.addEventListener("focusout", concealUnfocused);
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      reset();
      container.removeEventListener("focusin", revealFocused);
      container.removeEventListener("focusout", concealUnfocused);
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, [includeSections, repeat, together, enterVh, exitVh]);

  return ref;
}
