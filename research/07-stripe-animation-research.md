# Stripe Animation & Design Pattern Research

## 1. Animation Libraries & Techniques Stripe Actually Uses

### Primary Technologies
Stripe's landing pages use a combination of:

1. **WebGL / Custom Shaders (via `<canvas>`)** - The famous animated gradient mesh on stripe.com's hero is rendered using WebGL with custom GLSL fragment shaders. This is NOT a CSS gradient animation. It is a full GPU-accelerated canvas element with noise-based color blending that creates the smooth, organic, flowing color transitions.

2. **CSS Transforms & Transitions** - For the majority of UI element animations (hover states, scroll reveals, card interactions), Stripe uses hardware-accelerated CSS: `transform`, `opacity`, and `will-change`. They avoid animating layout properties (width, height, top, left) and stick to compositor-friendly properties.

3. **Intersection Observer API** - Scroll-triggered animations are powered by native `IntersectionObserver`, not scroll-event listeners. Elements fade/slide in when they enter the viewport.

4. **requestAnimationFrame loops** - For continuous animations (the gradient mesh, floating elements), they use `requestAnimationFrame` for smooth 60fps rendering.

5. **SVG animations** - Some illustrations and icons use animated SVGs with CSS keyframes or SMIL-like transitions.

6. **No heavy animation library** - Stripe does NOT use GSAP, Framer Motion, or Anime.js on their main pages. They write custom, lightweight animation code to keep bundle size minimal. However, this is because they have a large engineering team. For a startup, Framer Motion is the right choice as it provides the same effects with far less custom code.

---

## 2. Specific Animation Patterns (Breakdown)

### Pattern A: Animated Gradient Mesh (Hero Background)

**What it looks like:** A full-bleed background with 4-6 soft color blobs that morph and flow organically. Colors blend into each other with smooth transitions. It feels alive and premium.

**How Stripe does it:**
- A `<canvas>` element with WebGL context
- Custom GLSL fragment shader that combines multiple simplex noise functions
- Each color "blob" has a position that moves slowly over time using sine/cosine functions
- Colors are blended in the shader using smooth interpolation (mix/smoothstep)
- The animation runs at ~30fps to save GPU cycles (not full 60fps needed for slow movement)

**How to replicate in Next.js + Tailwind + Framer Motion:**

Option 1 - CSS-only approximation (MVP):
```css
.gradient-mesh {
  background:
    radial-gradient(at 40% 20%, rgba(168, 130, 255, 0.6) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgba(255, 160, 180, 0.5) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgba(120, 200, 255, 0.5) 0px, transparent 50%),
    radial-gradient(at 80% 70%, rgba(180, 255, 200, 0.4) 0px, transparent 50%),
    radial-gradient(at 20% 90%, rgba(255, 200, 130, 0.4) 0px, transparent 50%);
  animation: meshMove 20s ease-in-out infinite;
}

@keyframes meshMove {
  0%, 100% { background-position: 0% 0%, 100% 0%, 0% 50%, 80% 70%, 20% 90%; }
  25% { background-position: 20% 30%, 70% 20%, 10% 60%, 90% 50%, 30% 80%; }
  50% { background-position: 40% 10%, 60% 40%, 20% 40%, 70% 80%, 40% 70%; }
  75% { background-position: 10% 40%, 80% 10%, 5% 55%, 85% 60%, 25% 85%; }
}
```

Option 2 - Canvas-based (production quality, v1.1+):
```tsx
// Use a lightweight library: @react-three/fiber + a custom shader
// OR use the "meshGradient" approach with vanilla canvas
// Package recommendation: "mesh-gradient" npm package or custom implementation

// Simplified canvas approach:
function GradientMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    function animate() {
      time += 0.003;
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw moving radial gradients with blur compositing
      const blobs = [
        { x: Math.sin(time * 0.7) * 200 + canvas.width/2, y: Math.cos(time * 0.5) * 150 + canvas.height/3, color: 'rgba(168, 130, 255, 0.5)', r: 400 },
        { x: Math.cos(time * 0.5) * 250 + canvas.width/2, y: Math.sin(time * 0.8) * 200 + canvas.height/2, color: 'rgba(255, 160, 180, 0.4)', r: 350 },
        { x: Math.sin(time * 0.9) * 180 + canvas.width/3, y: Math.cos(time * 0.6) * 120 + canvas.height/2, color: 'rgba(120, 200, 255, 0.4)', r: 380 },
      ];

      blobs.forEach(blob => {
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />;
}
```

Option 3 - WebGL shader (highest fidelity, v2):
```
Use @react-three/fiber with a custom ShaderMaterial.
The fragment shader uses simplex noise to blend 4-6 colors.
This is the closest to Stripe's actual implementation.
Package: gl-noise for GLSL noise functions.
```

**Recommendation for Colater:** Start with Option 1 (CSS) for MVP. Upgrade to Option 2 (Canvas) for v1.1. Option 3 only if you want pixel-perfect Stripe parity.

---

### Pattern B: Scroll-Triggered Reveals

**What it looks like:** Content sections fade in and slide up as you scroll down. Elements stagger in (first the heading, then subtext, then cards one by one).

**How Stripe does it:**
- IntersectionObserver watches each section
- When visible, a class is added that triggers CSS transition
- Initial state: `opacity: 0; transform: translateY(30px);`
- Revealed state: `opacity: 1; transform: translateY(0);`
- Transition: `transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);`
- Stagger is achieved by adding incremental `transition-delay` to children

**How to replicate with Framer Motion:**
```tsx
import { motion } from 'framer-motion';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // Stripe's custom ease
    },
  }),
};

function Section({ children }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUpVariants}
    >
      {children}
    </motion.div>
  );
}

// For staggered children:
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};
```

**Key easing curve:** `cubic-bezier(0.16, 1, 0.3, 1)` - This is Stripe's signature ease. It starts fast and decelerates very smoothly. In Framer Motion, use `ease: [0.16, 1, 0.3, 1]`.

---

### Pattern C: Parallax Cards / Floating UI Elements

**What it looks like:** Product screenshots or UI mockups that float, have subtle parallax on scroll, and cast layered shadows. Cards tilt slightly on hover. Multiple layers move at different speeds creating depth.

**How Stripe does it:**
- Multiple layered elements with different `transform: translateY()` speeds on scroll
- Soft, multi-layered box shadows for depth
- Subtle rotation transforms on hover
- Glass-morphism effects (backdrop-blur) on some overlapping elements

**How to replicate with Framer Motion:**
```tsx
// Parallax on scroll
import { useScroll, useTransform, motion } from 'framer-motion';

function ParallaxCard({ speed = 0.5, children }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -200]);

  return (
    <motion.div
      style={{ y }}
      whileHover={{
        rotateY: 5,
        rotateX: -5,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08),0_8px_20px_rgba(0,0,0,0.04)]"
    >
      {children}
    </motion.div>
  );
}

// 3D tilt card that follows mouse
function TiltCard({ children }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateY(x * 10);
    setRotateX(y * -10);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}
```

**Tailwind shadow system for Stripe-like depth:**
```
// Define in tailwind.config.js
boxShadow: {
  'stripe-sm': '0 2px 5px -1px rgba(50,50,93,0.1), 0 1px 3px -1px rgba(0,0,0,0.07)',
  'stripe': '0 13px 27px -5px rgba(50,50,93,0.15), 0 8px 16px -8px rgba(0,0,0,0.12)',
  'stripe-lg': '0 30px 60px -12px rgba(50,50,93,0.18), 0 18px 36px -18px rgba(0,0,0,0.15)',
  'stripe-hover': '0 35px 60px -15px rgba(50,50,93,0.22), 0 25px 40px -20px rgba(0,0,0,0.18)',
}
```

---

### Pattern D: Stripe's Typography & Spacing System

**What makes it feel premium:**
- **Large, confident headlines**: 48-72px, tight letter-spacing (-0.02em to -0.04em), font-weight 600-700
- **Generous whitespace**: Sections have 120-200px vertical padding. Nothing feels cramped.
- **Muted body text**: Body copy is 16-18px, color is NOT pure black. Stripe uses `#425466` or similar muted dark blue-gray.
- **Limited color palette in text**: Headlines in dark navy (#0A2540), body in slate (#425466), accents sparingly
- **System font stack**: Stripe uses their custom font but falls back to system fonts. For Colater, Inter or the system stack works perfectly.

**Tailwind implementation:**
```tsx
// Hero headline
<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
  The AI-Powered Design<br />Agency for Founders
</h1>

// Subheadline
<p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed mt-6">
  One senior designer with AI superpowers. Agency-level output, startup-friendly pricing.
</p>

// Section padding
<section className="py-24 md:py-32 lg:py-40 px-6">
```

---

### Pattern E: Micro-interactions & Hover States

**What Stripe does:**
- Buttons lift on hover (translateY -1px to -2px) with enhanced shadow
- Cards elevate on hover with smooth shadow transition
- Links have color transitions with subtle underline animations
- CTAs have a slight scale (1.02) on hover
- Navigation items have smooth opacity/color changes

**Framer Motion button component:**
```tsx
function StripeButton({ children, variant = 'primary' }) {
  return (
    <motion.button
      whileHover={{ y: -1, boxShadow: '0 7px 14px rgba(50,50,93,0.1), 0 3px 6px rgba(0,0,0,0.08)' }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'px-6 py-3 rounded-full font-semibold text-sm transition-colors',
        variant === 'primary' && 'bg-indigo-600 text-white hover:bg-indigo-700',
        variant === 'secondary' && 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300',
      )}
    >
      {children}
    </motion.button>
  );
}
```

---

### Pattern F: Animated Code/Terminal Blocks

**What it looks like:** Stripe shows code snippets that type themselves out, with syntax highlighting that fades in line by line.

**How to replicate:**
```tsx
// Use Framer Motion stagger for line-by-line reveal
const codeLines = [
  'const colater = new Colater({',
  '  agents: ["research", "design", "copy"],',
  '  style: "startup-ready",',
  '});',
  '',
  'await colater.buildBrand("YourStartup");',
];

function AnimatedCode() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      className="bg-slate-900 rounded-2xl p-8 font-mono text-sm"
    >
      {codeLines.map((line, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, x: -10 },
            visible: { opacity: 1, x: 0 },
          }}
          className="text-slate-300"
        >
          {line}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

## 3. General Layout Patterns That Make Stripe Feel Premium

### 3a. Content Width & Grid System
- Max content width: ~1080-1200px
- Text blocks max width: ~640px (for readability)
- Grid: Asymmetric layouts are common. NOT always 50/50. Often 40/60 or text-left + visual-right.
- Heavy use of negative space to let elements breathe.

### 3b. Section Structure (Stripe Pattern)
Each section follows this rhythm:
1. **Eyebrow text** - Small, uppercase, colored text (e.g., "GLOBAL PAYMENTS")
2. **Headline** - Large, bold, dark
3. **Description** - 1-2 lines of muted body text
4. **Visual** - Screenshot, illustration, or interactive demo
5. **Supporting details** - Cards or bullet points below

```tsx
<section className="py-32">
  <div className="max-w-6xl mx-auto px-6">
    {/* Eyebrow */}
    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">
      Meet the Agents
    </p>
    {/* Headline */}
    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
      A team that never sleeps
    </h2>
    {/* Description */}
    <p className="text-lg text-slate-500 max-w-xl mb-16">
      Six specialized AI agents working alongside one senior designer.
    </p>
    {/* Visual / Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cards here */}
    </div>
  </div>
</section>
```

### 3c. Color Strategy
Stripe uses a dark navy/indigo primary (#635BFF is their brand purple) against a clean white background, with very muted grays for secondary text. The gradient mesh adds color richness to the hero without making the rest of the page feel busy.

**For Colater (warm, approachable, per your notes):**
```
Primary: Soft indigo/lavender (#8B7FFF or similar)
Accent: Warm peach/coral (#FF8A6B)
Background: Off-white (#FAFBFC)
Text primary: Dark slate (#1A1F36)
Text secondary: Muted gray (#6B7294)
Surface: White (#FFFFFF)
Gradient mesh colors: Lavender, peach, mint, sky blue (pastel palette)
```

### 3d. Glassmorphism & Blur Effects
Stripe uses subtle glass effects for overlapping panels:
```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
}
```

Tailwind:
```html
<div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl">
```

---

## 4. Implementation Priority for Colater

### MVP (This Week) - CSS-Only Polish
These require ZERO extra dependencies beyond Tailwind + Framer Motion:
- [ ] Scroll-triggered fade-up reveals with `whileInView` (Framer Motion)
- [ ] Stripe-style shadows on cards (Tailwind custom shadows)
- [ ] CSS gradient mesh background on hero (multiple radial-gradients + keyframe animation)
- [ ] Generous section padding (py-24 to py-40)
- [ ] Tight headline tracking, muted body text colors
- [ ] Button hover micro-interactions (lift + shadow)
- [ ] Staggered card entrance animations

### v1.1 - Enhanced Animations
- [ ] Canvas-based animated gradient mesh (smoother, more organic)
- [ ] Parallax scroll effects on hero elements
- [ ] 3D tilt cards for agent showcase
- [ ] Animated status updates for "Meet the Agents" section (typewriter + stagger)
- [ ] Glassmorphism on overlapping elements

### v2 - Full Premium Treatment
- [ ] WebGL shader gradient mesh (pixel-perfect Stripe quality)
- [ ] React Three Fiber for 3D interactive elements
- [ ] Page transition animations (AnimatePresence)
- [ ] Scroll-linked progress animations
- [ ] Advanced cursor interactions

---

## 5. Key NPM Packages to Consider

| Package | Purpose | Priority |
|---------|---------|----------|
| `framer-motion` | All animations, scroll triggers, layout animations | MVP |
| `tailwindcss` | Styling, responsive design | MVP |
| `clsx` or `cn` (from shadcn) | Conditional class merging | MVP |
| `@react-three/fiber` | 3D elements (if needed) | v2 |
| `@react-three/drei` | 3D helpers (if needed) | v2 |
| `lenis` or `@studio-freight/lenis` | Smooth scrolling | v1.1 |
| `simplex-noise` | Noise functions for canvas gradient | v1.1 |

---

## 6. Performance Considerations

Stripe's pages are fast because:
1. **No heavy animation libraries on critical path** - For Colater, use dynamic imports for Framer Motion components that are below the fold.
2. **Hardware-accelerated only** - Only animate `transform` and `opacity`. Never animate `width`, `height`, `margin`, `padding`.
3. **`will-change` hints** - Apply `will-change: transform` to elements that will animate, but sparingly.
4. **Reduced motion** - Always respect `prefers-reduced-motion`:
```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// In Framer Motion:
<motion.div
  initial={prefersReducedMotion ? false : "hidden"}
  whileInView="visible"
>
```
5. **Canvas animations** - Use `requestAnimationFrame` with a throttle (every other frame) for gradient meshes. They don't need 60fps.
6. **Intersection Observer `once: true`** - Elements only animate in once, not on every scroll in/out.

---

## 7. The "Stripe Feel" Checklist

What separates a premium landing page from a generic one:

- [x] **Negative space** - Double the padding you think you need
- [x] **Consistent vertical rhythm** - Same spacing scale throughout
- [x] **Muted secondary colors** - Body text is never pure black
- [x] **Shadows over borders** - Use layered soft shadows, not harsh borders
- [x] **Smooth transitions** - Everything has a transition, nothing snaps
- [x] **Custom easing** - Never use `ease` or `linear`. Use `cubic-bezier(0.16, 1, 0.3, 1)`
- [x] **One bold visual per section** - Don't clutter. One hero image, one demo, etc.
- [x] **Tight headline kerning** - `tracking-tight` on all headlines
- [x] **Generous line-height on body** - `leading-relaxed` for readability
- [x] **Progressive disclosure** - Show more on interaction, don't overwhelm upfront
- [x] **Asymmetric layouts** - Not everything needs to be centered or 50/50
- [x] **Subtle gradients** - On backgrounds, buttons, or text. Never harsh color blocks.
