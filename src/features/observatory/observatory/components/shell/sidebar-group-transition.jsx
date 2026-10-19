import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export function SidebarGroupTransition({ group, children }) {
  const reduceMotion = useReducedMotion();
  const direction = group === 'main' ? -1 : 1;
  return (
    <div className="relative">
    <AnimatePresence initial={false} mode="popLayout" custom={direction}>
      <motion.div key={group} custom={direction}
        initial="enter" animate="visible" exit="exit"
        className="w-full" data-sidebar-group={group}
        variants={{
          enter: (direction) => ({ opacity: 0, transform: `translateX(${reduceMotion ? 0 : direction * 12}px)` }),
          visible: { opacity: 1, transform: 'translateX(0px)' },
          exit: (direction) => ({ opacity: 0, transform: `translateX(${reduceMotion ? 0 : direction * -12}px)`, pointerEvents: 'none' }),
        }}
        transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.25, 0.1, 0.25, 1] }}>
        {children}
      </motion.div>
    </AnimatePresence>
    </div>
  );
}
