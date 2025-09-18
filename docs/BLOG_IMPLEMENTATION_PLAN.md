## Eldilta Blog - Implementation Plan & Progress Log

This document tracks scope, decisions, required assets, and progress for the bilingual MDX blog. Keep this updated as we work.

### Scope
- Bilingual blog (EN default, AR secondary) using MDX files.
- Routes:
  - Lists: `/en/blog`, `/ar/blog`
  - Post: `/en/blog/[slug]`, `/ar/blog/[slug]`
  - Tag: `/en/blog/tag/[tag]`, `/ar/blog/tag/[tag]`
  - Category: `/en/blog/category/[cat]`, `/ar/blog/category/[cat]`
- SEO: per-page meta, canonical, OpenGraph/Twitter, Structured Data (Article + Breadcrumb), hreflang.
- Feeds/Discovery: `sitemap.xml` (all locales), `rss.xml` (latest posts).
- UI: cards, sidebar (tags/categories/recent/CTA), breadcrumbs, share buttons, author box, related posts, TOC.
- Performance: responsive WebP images, lazy loading, ISR/revalidate.

### Decisions (confirmed)
- Content source: MDX files inside repo (can switch to CMS later).
- Locales: English is default; Arabic secondary.
- Identity: match current site colors/typography and social links.
- Social links source: `src/components/public/home/ContactInfo.tsx` (Facebook, Instagram, WhatsApp, mailto).
- Live site reference: https://eldelta.netlify.app/

### Initial Information Needed (from brand/content)
- Brand: logo (SVG/PNG), primary/secondary colors (if not already in theme), EN/AR fonts if different from app.
- Canonical site URL (production) for SEO.
- Social profiles (for metadata cards).
- Author profile: name, short bio, 512x512 avatar, optional links.
- Categories (initial):
  - Import from China / الاستيراد من الصين
  - Export Services / خدمات التصدير
  - Customs Clearance / التخليص الجمركي
  - Logistics Services / الخدمات اللوجستية
  - Guides & Resources / أدلة ومراجع
  - Industry News / أخبار الصناعة
- Tags (initial examples): Quality Inspection, Sea Freight, Air Freight, Supplier Sourcing, Trade Documents, Customs Duties, Cargo Insurance (ومقابلاتها العربية).
- Content seed: 5 article titles/outlines (EN+AR) and cover images (>= 1200x630) or approval to use placeholders.

### Implementation Checklist (linked to tasks)
- [ ] blog-01: Create MDX content folders `content/blog/en` and `content/blog/ar`
- [ ] blog-02: Define Types & frontmatter loader; link translations
- [ ] blog-03: Build list pages with pagination and filters
- [ ] blog-04: Build post page (TOC, related, internal links)
- [ ] blog-05: Tag & Category pages (both locales, hreflang)
- [ ] blog-06: SEO layer (meta, canonical, OG/Twitter, Structured Data)
- [ ] blog-07: Generate `sitemap.xml` (all locales, blog/tag/category)
- [ ] blog-08: Generate `rss.xml` (latest posts)
- [ ] blog-09: UI components (Cards, Sidebar, Breadcrumbs, Share, AuthorBox)
- [ ] blog-10: Visual identity (colors/fonts), responsive WebP images
- [ ] blog-11: ISR/Revalidate configuration and locale defaults
- [ ] blog-12: Integrate social links from `ContactInfo.tsx`
- [ ] blog-13: Add 5 initial MDX post skeletons (EN/AR) with frontmatter
- [ ] blog-14: QA pass (Lighthouse, Rich Results, hreflang, internal links)

### Current Status (as of creation)
- Decisions confirmed: MDX, bilingual (EN default), reuse site identity, use existing social links.
- Awaiting: author profile, confirmation/edits to categories & tags, initial 5 article titles or approval to propose.
- No code changes performed yet (pending explicit approval to start).

### Notes & Conventions
- Slugs are shared between locales (e.g., `import-from-china-101`).
- Each MDX file includes frontmatter: `title`, `excerpt`, `coverImage{url,alt,width,height}`, `tags[]`, `category`, `author{ name, avatar, bio }`, `publishedAt`, `updatedAt`, `status`, `locale`, `translationOf`, `seo{ metaTitle, metaDescription, canonical, ogImage }`.
- Hreflang pairs generated from `locale` + `translationOf`.
- Images: store in `public/blog/` (or CDN later); always include meaningful `alt` text (EN & AR).

### Next Action When Resuming
1) Confirm/adjust categories & tags if needed.
2) Provide author details and 5 initial article titles (or approve proposed set).
3) On approval, start with tasks blog-01 → blog-04, then SEO/feed tasks.


