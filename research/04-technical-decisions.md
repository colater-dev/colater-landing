# Colater - Technical & Design Decisions

## Onboarding Agent (Key Feature)
**NOT just a form — it's a live demo of Colater's capabilities.**

Flow:
1. User provides basic info (name, startup name, industry, what they need)
2. Agent kicks off **live competitor research** in the background
3. Shows the user MORE than they provided — competitor insights, market positioning ideas
4. User can give feedback on what the agent found
5. This impresses the customer and sells the service before the call even happens

Technical implications:
- Needs a backend/API for the research agent (could use AI API calls)
- Real-time updates (streaming or polling)
- Stateful multi-step interaction
- This is the most complex part of the landing page

## Blog
- MDX in Next.js
- Blog posts as .mdx files in the repo
- Developer-friendly, version controlled
- Can use Next.js built-in MDX support or next-mdx-remote

## Color Direction
- **Soft gradients** — lavender-to-peach, mint-to-sky, dreamy and modern
- Warm and approachable
- Pastel palette with gentle transitions
- Good contrast for readability

## Deployment
- **Vercel** (recommended for Next.js)
- Automatic deployments from Git
- Preview deployments for PRs
- Will need to update CNAME/DNS from GitHub Pages to Vercel

## Tech Stack Summary
- Next.js (App Router)
- Tailwind CSS
- MDX for blog
- Vercel for deployment
- API routes for Onboarding Agent backend
- Potentially: Framer Motion for animations
