# ISTC — Digital Proposal & Website Redesign

An independent, pre-hire proposal for the **International Science and Technology Center** (istc.int), created by **Shyngys Narseyit** as an applicant for the PR & Media Intern role.

Apple-inspired, fully responsive, animated, **trilingual (EN / RU / KK)**.

## 1 · The Proposal — `/`
A single-page pitch built around the candidate's real edge: the platforms ISTC is missing (TikTok, Telegram, Threads) are exactly the ones he has already grown to **145,000 followers**. Includes the current-state audit, a phased 60-day plan and measurable commitments.

## 2 · The Redesign — `/redesign/`
A modern, **multi-page** concept redesign that mirrors the **real ISTC information architecture**, with mega-menu navigation and real photography.

**Navigation (matches istc.int):**
- **Who We Are** → About ISTC · Governance & Members · Documents & Reports
- **What we do** → Apply for research grants · Proposal portal · Travel & workshop support · Project development & execution · Implemented & on-going projects
- **Procurement** → ISTC Tenders · Procurement support
- **Media center** → News · Press kit
- **EXPO 2025** (reframed as an "at Expo 2025: Results" page)
- Search · Expert access

**11 pages:** Home, About, Governance & Members, Documents & Reports, What We Do, Apply for grants, Projects, Procurement, Media center, EXPO 2025, Contact.

**Modern UX/UI:** full-width mega-menu dropdowns, full-screen mobile accordion menu, search overlay, an animated `<canvas>` particle-network hero, real stock photography (Unsplash), split-media sections, process-flow & timeline diagrams, filterable project grid, tender table, count-up stats, contact form, back-to-top, and a persistent EN/RU/KK language switcher.

## Technical notes
- Shared front-end in `redesign/assets/`: `styles.css`, `components.js` (injects nav / mobile menu / search / footer), `i18n.js` (all translations), `main.js` (behaviour, canvas, filters).
- No build step, no framework. `prefers-reduced-motion` respected throughout. Photography served from Unsplash CDN.
- **Independent concept**, not an official ISTC website. Figures are drawn from a public digital audit (July 2026); ISTC content is used only for demonstration.

**Shyngys Narseyit** · narseyitshyngys@gmail.com · [linkedin.com/in/shyngys-narseyit](https://www.linkedin.com/in/shyngys-narseyit)
