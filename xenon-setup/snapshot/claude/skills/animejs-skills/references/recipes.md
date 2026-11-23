# Anime.js v4 Recipes & Patterns

Copy-paste recipes for named patterns. SKILL.md holds the principles; this file holds the full catalog. All snippets assume `import { ... } from 'animejs';` where used.

## Basic animations

### Fade in
```js
animate('.el', { opacity: [0, 1], duration: 500, ease: 'outQuad' });
```

### Slide in from left
```js
animate('.el', { translateX: [-100, 0], opacity: [0, 1], duration: 600, ease: 'outExpo' });
```

### Scale & rotate entrance
```js
animate('.el', { scale: [0, 1], rotate: ['45deg', '0deg'], duration: 800, ease: 'outBack' });
```

### Bounce settle
```js
animate('.el', { translateY: [-50, 0], ease: 'outBounce', duration: 1000 });
```

## Staggered animations

### List items stagger
```js
animate('.list-item', {
  translateX: [-50, 0], opacity: [0, 1],
  delay: stagger(100), duration: 500, ease: 'outQuad',
});
```

### Grid reveal from center
```js
animate('.grid-item', {
  scale: [0, 1], opacity: [0, 1],
  delay: stagger(50, { grid: [10, 10], from: 'center' }),
  duration: 400, ease: 'outBack',
});
```

### Wave (ambient loop)
```js
animate('.item', {
  translateY: [0, -30, 0],
  delay: stagger(80, { ease: 'inOutQuad' }),
  duration: 600, loop: true,
});
```

### Random particle scatter
```js
animate('.particle', {
  translateX: () => random(-200, 200),
  translateY: () => random(-200, 200),
  scale: stagger([0.5, 1.5]),
  delay: stagger(20, { from: 'random' }),
  duration: 1000,
});
```

## Timeline sequences

### Basic sequence (each starts after previous ends)
```js
const tl = createTimeline({ defaults: { duration: 500, ease: 'outExpo' } });
tl.add('.box-1', { translateX: 250 })
  .add('.box-2', { translateX: 250 })
  .add('.box-3', { translateX: 250 });
```

### Overlapping animations
```js
const tl = createTimeline();
tl.add('.el-1', { translateX: 100 })
  .add('.el-2', { translateY: 100 }, '<')       // start with previous
  .add('.el-3', { scale: 1.5 }, '<+=200');        // 200ms after previous start
```

### Labeled choreography
```js
const tl = createTimeline({ defaults: { duration: 600, ease: 'outQuart' } });
tl.label('start')
  .add('.header', { translateY: [-50, 0], opacity: [0, 1] })
  .add('.nav-item', { translateY: [-20, 0], opacity: [0, 1], delay: stagger(50) }, '<+=200')
  .label('content')
  .add('.hero-text', { translateX: [-100, 0], opacity: [0, 1] }, 'content')
  .add('.hero-image', { scale: [0.8, 1], opacity: [0, 1] }, 'content+=100')
  .add('.cta-button', { scale: [0, 1] }, '>-=100');
```

### Looping/alternating timeline
```js
const tl = createTimeline({ loop: true, alternate: true, loopDelay: 500 });
tl.add('.spinner', { rotate: 360, duration: 1000 })
  .add('.pulse', { scale: [1, 1.2, 1], duration: 600 }, '<');
```

## Scroll animations

### Reveal on enter
```js
animate('.reveal', {
  translateY: [50, 0], opacity: [0, 1], duration: 800, ease: 'outExpo',
  autoplay: onScroll({ target: '.reveal', enter: 'bottom 80%' }),
});
```

### Scroll-synced progress bar
```js
animate('.progress-bar', {
  scaleX: [0, 1], transformOrigin: '0% 50%',
  autoplay: onScroll({ container: document.documentElement, sync: true }),
});
```

### Parallax
```js
animate('.parallax-layer', {
  translateY: [0, -200],
  autoplay: onScroll({ target: '.parallax-section', sync: true, ease: 'linear' }),
});
```

### Horizontal scroll section
```js
animate('.horizontal-section', {
  translateX: ['0%', '-300%'],
  autoplay: onScroll({ container: '.scroll-wrapper', axis: 'x', sync: true }),
});
```

## SVG animations

### Line drawing
```js
const path = createDrawable('path.svg-line');
animate(path, { draw: ['0 0', '0 1'], duration: 2000, ease: 'inOutQuad' });
```

### Multiple paths with stagger
```js
const paths = document.querySelectorAll('path');
animate(Array.from(paths).map(createDrawable), {
  draw: ['0 0', '0 1'], delay: stagger(200), duration: 1500, ease: 'inOutQuad',
});
```

### Shape morphing
```js
animate('#shape', { d: morphTo('#target-shape'), duration: 1000, ease: 'inOutQuad' });
```

### Motion path
```js
animate('.car', { ...createMotionPath('#road-path'), duration: 5000, ease: 'linear', loop: true });
```

### SVG fill & stroke (loop)
```js
animate('svg path', {
  fill: ['#3498db', '#e74c3c'],
  stroke: ['#2980b9', '#c0392b'],
  strokeWidth: [2, 4],
  duration: 1000, alternate: true, loop: true,
});
```

## Draggable

### Basic
```js
createDraggable('.drag-me', { container: '.container' });
```

### Snap to grid
```js
createDraggable('.grid-item', { x: { snap: 100 }, y: { snap: 100 }, container: '.grid-container' });
```

### Spring release
```js
createDraggable('.bouncy', {
  container: '.bounds',
  releaseEase: createSpring({ stiffness: 150, damping: 10, mass: 1 }),
});
```

### Carousel/slider
```js
const carousel = createDraggable('.carousel-track', {
  x: true, y: false,
  snap: (x) => Math.round(x / slideWidth) * slideWidth,
  onSnap: (self) => updateIndicator(Math.abs(self.x / slideWidth)),
});
```

### Draggable with callbacks
```js
createDraggable('.el', {
  container: '.bounds',
  onGrab:    (s) => s.target.classList.add('dragging'),
  onDrag:    (s) => console.log(`${s.x}, ${s.y}`),
  onRelease: (s) => s.target.classList.remove('dragging'),
  onSettle:  (s) => console.log('settled'),
});
```

## Text animations

### Char by char
```js
const { chars } = splitText('.title', { chars: true });
animate(chars, { translateY: [20, 0], opacity: [0, 1], delay: stagger(30), duration: 500, ease: 'outQuad' });
```

### Word by word
```js
const { words } = splitText('.paragraph', { words: true });
animate(words, { translateY: [30, 0], opacity: [0, 1], delay: stagger(50, { from: 'first' }), duration: 600, ease: 'outExpo' });
```

### Line by line
```js
const { lines } = splitText('.text-block', { lines: true });
animate(lines, { translateX: [-50, 0], opacity: [0, 1], delay: stagger(100), duration: 800, ease: 'outQuart' });
```

### Typewriter
```js
const { chars } = splitText('.typewriter', { chars: true });
chars.forEach(c => c.style.opacity = 0);
animate(chars, { opacity: [0, 1], delay: stagger(50), duration: 10, ease: 'steps(1)' });
```

## UI component patterns

### Modal open/close
```js
function openModal() {
  animate('.modal-backdrop', { opacity: [0, 1], duration: 300 });
  animate('.modal-content', { scale: [0.9, 1], opacity: [0, 1], duration: 400, ease: 'outBack' });
}
function closeModal() {
  const tl = createTimeline();
  tl.add('.modal-content', { scale: [1, 0.9], opacity: [1, 0], duration: 200 })
    .add('.modal-backdrop', { opacity: [1, 0], duration: 200 }, '<+=100');
  return tl;
}
```

### Accordion (measure scrollHeight, then animate)
```js
function toggleAccordion(panel) {
  const content = panel.querySelector('.content');
  const isOpen = panel.classList.contains('open');
  if (isOpen) {
    animate(content, { height: [content.scrollHeight, 0], opacity: [1, 0], duration: 300, ease: 'outQuad' });
  } else {
    animate(content, { height: [0, content.scrollHeight], opacity: [0, 1], duration: 400, ease: 'outQuart' });
  }
  panel.classList.toggle('open');
}
```

### Hamburger → close X
```js
function toggleMenu(isOpen) {
  const tl = createTimeline();
  if (isOpen) {
    tl.add('.hamburger .line:nth-child(1)', { rotate: 45, translateY: 8 })
      .add('.hamburger .line:nth-child(2)', { opacity: 0 }, '<')
      .add('.hamburger .line:nth-child(3)', { rotate: -45, translateY: -8 }, '<');
  } else {
    tl.add('.hamburger .line', { rotate: 0, translateY: 0, opacity: 1 });
  }
  return tl;
}
```

### Button hover (per-button listener)
```js
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => animate(btn, { scale: 1.05, duration: 200, ease: 'outQuad' }));
  btn.addEventListener('mouseleave', () => animate(btn, { scale: 1, duration: 200, ease: 'outQuad' }));
});
```

### Loading spinner (looped stagger)
```js
createTimeline({ loop: true })
  .add('.spinner-dot', { scale: [1, 1.5, 1], opacity: [1, 0.5, 1], delay: stagger(100), duration: 600 });
```

## React integration

### useAnime hook
```jsx
import { useRef, useEffect } from 'react';
import { animate, createScope } from 'animejs';

function useAnime(animationFn, deps = []) {
  const scope = useRef(null);
  const root = useRef(null);
  useEffect(() => {
    scope.current = createScope({ root: root.current });
    scope.current.add(animationFn);
    return () => scope.current.revert();
  }, deps);
  return root;
}

function AnimatedComponent() {
  const containerRef = useAnime(() => animate('.box', { translateX: 100, duration: 500 }));
  return <div ref={containerRef}><div className="box" /></div>;
}
```

### Animated list re-runs on items change
```jsx
import { useRef, useEffect } from 'react';
import { animate, stagger, createScope } from 'animejs';

function AnimatedList({ items }) {
  const containerRef = useRef(null);
  const scopeRef = useRef(null);
  useEffect(() => {
    scopeRef.current = createScope({ root: containerRef.current });
    scopeRef.current.add(() => {
      animate('.list-item', {
        translateX: [-50, 0], opacity: [0, 1],
        delay: stagger(50), duration: 400,
      });
    });
    return () => scopeRef.current.revert();
  }, [items]);
  return <ul ref={containerRef}>{items.map(i => <li key={i.id} className="list-item">{i.name}</li>)}</ul>;
}
```

## Advanced patterns

### Chained animations via promises
```js
async function animationSequence() {
  await animate('.step-1', { translateX: 100 }).then;
  await animate('.step-2', { translateY: 100 }).then;
  await animate('.step-3', { scale: 1.5 }).then;
}
```

### Dynamic value updates (counter)
```js
const obj = { value: 0 };
animate(obj, {
  value: 100, duration: 2000,
  onUpdate: () => { document.querySelector('.counter').textContent = Math.round(obj.value); },
});
```

### Responsive via createScope mediaQueries
```js
const scope = createScope({
  mediaQueries: { mobile: '(max-width: 768px)', desktop: '(min-width: 769px)' },
});
scope.add(({ matches }) => {
  if (matches.mobile) animate('.hero', { translateY: [50, 0], duration: 500 });
  else animate('.hero', { translateX: [-100, 0], duration: 800 });
});
```

### Custom modifier (snap to 10px grid mid-tween)
```js
animate('.el', {
  translateX: { to: 500, modifier: v => Math.round(v / 10) * 10 },
});
```

### Blend composition for smooth re-targeting
```js
animate('.el', { translateX: 100, composition: 'blend' });
// later, smoothly:
animate('.el', { translateY: 100, composition: 'blend' });
```

### Spring as ease (per-tween, not as timeline default)
```js
const spring = createSpring({ stiffness: 200, damping: 18 });
animate('.modal', { scale: [0.9, 1], opacity: [0, 1], duration: 600, ease: spring });
```

### Layout enter/exit (FLIP-style)
```js
const layout = createLayout({ root: '.list', children: '.list-item' });
layout.record();                 // capture before DOM change
// ...mutate DOM (filter/reorder)...
layout.animate({ enterFrom: { opacity: 0, translateY: 20 }, leaveTo: { opacity: 0 }, ease: 'outExpo' });
```