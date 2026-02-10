# Colater Landing Page — Research Summary

## The Pitch
**Colater is an AI-accelerated design agency for pre-seed/seed founders who want to iterate fast.**
One senior designer + 6 specialized AI agents = agency-level output at startup-friendly pricing.

---

## Key Decisions

| Decision | Choice |
|----------|--------|
| **CTA** | Book a call via Onboarding Agent (intelligent form that demos the AI) |
| **Tone** | Warm & approachable |
| **Color** | Soft gradients (lavender, peach, mint, sky) |
| **Animations** | Stripe.com inspired — go all out (gradient meshes, parallax, 3D) |
| **Tech** | Next.js + Tailwind + Framer Motion, deployed on Vercel |
| **Blog** | MDX in Next.js |
| **Pricing** | "Starting at" signals, $500-2k range |
| **Target** | Pre-seed / Seed startups |
| **Team** | Solo founder + 6 AI agents |
| **Domain** | colater.com |
| **Timeline** | This week (MVP) |

---

## Page Structure (Top → Bottom)

### 1. Navbar
- Colater logo
- Nav links: Services, Agents, Pricing, Blog
- CTA button: "Talk to Our Agent"

### 2. Hero
- Animated gradient mesh background (soft pastels)
- Headline: "The AI-Powered Design Agency for Founders Who Want to Iterate Fast"
- Subheadline: Brief value prop about speed + quality + price
- Primary CTA → Onboarding Agent form
- Secondary CTA → Learn more / scroll

### 3. Social Proof Strip
- 2 startup logos
- 2 founder faces + testimonials
- Compact, trustworthy

### 4. The Problem
- Three pain points of traditional agencies:
  1. Too slow (weeks/months vs days)
  2. Too expensive ($10-30k/mo retainers)
  3. Too rigid (waterfall, limited revisions)
- Visual comparison or animated counter

### 5. Meet the Agents (Star Section)
- Slack-channel-style status update UI
- 6 agents with live-looking status updates:
  1. **Research Agent** — "Just completed competitor analysis for @YourStartup"
  2. **Brand Strategist Agent** — "Positioned your brand against 5 competitors"
  3. **Design System Agent** — "Built your component library — 42 components ready"
  4. **Brand Copywriter Agent** — "Generated 8 tagline variants — review attached"
  5. **Asset Generator Agent** — "Created 12 social media variants for launch"
  6. **Onboarding Agent** — "New project brief received — kicking off research"
- Animated: status updates appear with stagger animation

### 6. How It Works
- NOT traditional steps
- "Talk to the Onboarding Agent" — CTA leads to intelligent form
- Brief → Agents research & draft → Designer refines → You review → Iterate
- Emphasis on weekly agent reports and continuous monitoring

### 7. Services
- 4 cards with icons:
  1. Brand Identity ($500+)
  2. Product/UI Design ($1,000+)
  3. Web Design & Dev ($1,500+)
  4. Pitch Decks & Collateral ($500+)
- Each shows what's included

### 8. Pricing
- "Starting at" format
- Pre-qualify leads without scaring them off
- CTA: "Get a Custom Quote" → Onboarding Agent

### 9. FAQ
- Quality: "Is there a real designer?" → Yes, senior designer reviews everything
- Process: "How does it work?" → Brief → Agents → Designer → Review → Iterate
- Deliverables: "What do I get?" → Design files, brand guidelines, weekly agent reports
- Speed: "How fast?" → Most projects delivered in 1-2 weeks
- Data: "Is my data safe?" → Yes, confidential
- IP: "Who owns the designs?" → You do, 100%

### 10. Final CTA
- Repeated hero CTA
- "Ready to build your brand at startup speed?"
- Button → Onboarding Agent

### 11. Footer
- Colater logo
- Links: Services, Agents, Pricing, Blog, Contact
- Social links
- Copyright

---

## Onboarding Agent (The Key Innovation)
1. User clicks CTA → opens intelligent multi-step form
2. Collects: Name, startup name, industry, what they need, timeline
3. **Kicks off live competitor research** via Claude API
4. Shows user MORE than they provided — competitor insights, positioning ideas
5. User can give feedback on findings
6. Ends with booking a call (impressed and pre-sold)

---

## The 6 Agents
1. **Research Agent** — Competitor analysis, market research, trend identification
2. **Brand Strategist Agent** — Brand positioning, strategy, identity direction
3. **Design System Agent** — Component libraries, design tokens, consistency
4. **Brand Copywriter Agent** — Taglines, voice, messaging, content
5. **Asset Generator Agent** — Rapid social/marketing asset generation
6. **Onboarding Agent** — Intelligent intake, live research, project scoping

---

## Operations Model (for FAQ/messaging)
- Agents work continuously (not just when asked)
- Weekly reports on agent progress to clients
- Clients get CMS access for content review
- Human designer directs agents and ensures quality
- Example: "Marketing Agent identified an SEO opportunity, drafted blog pages"

---

## Color Palette (Proposed)
- Primary: Soft lavender `#8B7FFF`
- Accent: Warm peach `#FF8A6B`
- Background: Off-white `#FAFBFC`
- Text primary: Dark slate `#1A1F36`
- Text secondary: Muted gray `#6B7294`
- Surface: White `#FFFFFF`
- Gradient mesh: Lavender, peach, mint, sky blue pastels

---

## MVP Scope (This Week)
### Must Ship
- [x] Next.js project setup with Tailwind + Framer Motion
- [ ] All 11 page sections (navbar through footer)
- [ ] CSS gradient mesh hero background
- [ ] Scroll-triggered reveal animations
- [ ] Stripe-style shadows and spacing
- [ ] Agent showcase with status-update UI
- [ ] Smart onboarding form (multi-step, conditional)
- [ ] Responsive design (mobile-first)
- [ ] Deploy to Vercel

### v1.1 (Next Week)
- [ ] Canvas-based gradient mesh (smoother)
- [ ] Parallax and 3D tilt effects
- [ ] Blog structure with MDX
- [ ] Glassmorphism effects
- [ ] Smooth scrolling (Lenis)

### v2 (Following Weeks)
- [ ] Live Onboarding Agent with Claude API backend
- [ ] WebGL shader gradient mesh
- [ ] Blog content
- [ ] Case studies
- [ ] Advanced cursor interactions

---

## Research Files Index
1. `01-foundations.md` — Core identity, CTA, services, tone, tech stack
2. `02-positioning.md` — Team, target client, agents, differentiator
3. `03-page-structure.md` — Page sections, agent display, pricing, content strategy
4. `04-technical-decisions.md` — Onboarding agent, blog, colors, deployment
5. `05-final-specs.md` — Final agent list, animations, domain, timeline, MVP scope
6. `06-operations-model.md` — How it works, weekly reports, pain points, FAQ themes
7. `07-stripe-animation-research.md` — Deep dive on Stripe's techniques with code examples
