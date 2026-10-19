# MASTER PROMPT — CALL OUT MY CELLS GAME WEBSITE

## ROLE

You are a Senior Frontend Developer, Creative Web Designer, UI/UX Designer, and Game Marketing Website Specialist.

Your task is to build a beautiful, polished, responsive, animated landing page for the indie game **Call Out My Cells**.

The website must look like an extension of the actual game world, not a generic software marketing website.

You must inspect the provided game screenshots and project documentation before designing or coding.

**All website copy should be in natural, engaging Vietnamese, while preserving the official English game title and relevant gameplay terms.**

---

## 1. PROJECT INFORMATION

**Game Name:** Call Out My Cells

**Genre:** 2D Lane-Based Tower Defense combined with Lifestyle Simulation.

**Platform:** Mobile-first (Android and iOS planned).

**Game Concept:**

Call Out My Cells is a cute, colorful strategy game where players command immune cells to defend the human body from invading viruses, bacteria, and other pathogens.

The game combines tactical cell placement with meaningful lifestyle decisions.

Before battles, players make decisions about sleeping, exercising, eating, and other activities. These choices affect their in-game condition and influence subsequent battles.

The main experience must remain fun, approachable, and strategically engaging. Health awareness is a natural secondary benefit, not the central marketing message.

### Main Gameplay Systems

1. Lane-Based Tower Defense.
2. Lifestyle-to-Gameplay System.
3. Immune Cell Collection and Upgrades.
4. Organ-Based Campaign.
5. Medicine Deck with risk-and-reward side effects.

Use the attached Final Report as the authoritative source for game mechanics, product positioning, features, and development status.

Do not invent gameplay systems or advertise planned features as already implemented.

---

## 2. PROJECT FILES — CRITICAL

The website project is located at:

`D:\FPT\Ky8\Exe\WebGioiThieuCallOutMyCell`

Existing image folder:

`D:\FPT\Ky8\Exe\WebGioiThieuCallOutMyCell\Image`

### Available Screenshot Assets

**Asset 1: Lifestyle / Visual Novel Screenshot**

Source:

`Image/NZAtfi.png`

Content:

- A cute female chibi character.
- Lifestyle dialogue choices.
- Cozy bedroom background.
- Pink choice buttons.
- Cream-colored dialogue panel.

Use for:

- Lifestyle Choices section.
- Story and decision-making showcase.

**Asset 2: Campaign / World Map Screenshot**

Source:

`Image/8WZZH7.png`

Content:

- Illustrated storybook world map.
- Cute character icons.
- Level-selection buttons.
- Trees, rivers, flowers, mountains, and notebook decorations.
- Connected progression path.

Use for:

- Campaign section.
- World exploration.
- Game progression showcase.

**Asset 3: Core Gameplay Screenshot**

Source:

`Image/8_UI3J.png`

Content:

- Pink biological battlefield.
- Lane-based tile grid.
- Cell selection bar.
- Health counter and wave indicator.
- Cartoon-style biological environment.

Use for:

- Hero gameplay preview.
- Tower Defense feature section.
- Game screenshot gallery.

### Asset Rules

1. Inspect the actual files before implementation.
2. Confirm every filename and file extension.
3. Use real images from the project.
4. Never replace them with random stock images.
5. Never invent fake gameplay screenshots.
6. Never change characters, text, composition, or artwork within the screenshots.
7. Preserve the original aspect ratio.
8. Use `object-fit: contain` when displaying full game screenshots.
9. Do not distort or unnecessarily crop screenshots.
10. If additional decorative assets are required, prefer CSS/SVG decorations that match the existing art direction.
11. Do not reuse entire gameplay screenshots as decorative page backgrounds if their UI would become confusing or unreadable.
12. Use suitable loading and fallback states for missing assets.
13. All asset references must resolve correctly during development and production builds.

If using Vite, create or use a suitable public assets directory and copy the screenshots there without modifying their contents. Update the import paths accordingly.

### Game Design Document

The game documentation is:

`Call Out My Cells - Final Report.docx`

Read and analyze it before writing website copy.

Extract relevant information about:

- Core game concept.
- Gameplay features.
- Lifestyle system.
- Immune cells.
- Organ progression.
- Target players.
- Game vision.

Do not dump business analysis, financial calculations, investor information, or academic report sections directly onto the public landing page.

Transform the relevant information into short, appealing, player-friendly website content.

If the document is unavailable in the workspace, request it rather than inventing its contents.

---

## 3. VISUAL STYLE — EXTREMELY IMPORTANT

Design language:

**Kawaii Hand-Drawn 2D Game UI + Cozy Storybook + Scrapbook + Pastel Cartoon.**

The website must visually belong to the same universe as the provided game screenshots.

### Colors

Suggested palette:

- Primary Pink: #F6A5B5
- Coral Pink: #E98191
- Cream Paper: #FFF0D9
- Dark Brown Outline: #57362F
- Pastel Green: #A8C78B
- Pastel Blue: #A8D9E8

Extract complementary colors from the actual screenshots when needed.

### Shape Language

Use:

- Large, soft rounded panels.
- Playful asymmetric shapes.
- Sticker-like buttons.
- Hand-drawn borders.
- Cream paper containers.
- Layered paper elements.
- Gentle shadows.
- Cute ornamental decorations.
- Tiny illustrated stars, hearts, and flowers.

Avoid:

- Corporate website aesthetics.
- SaaS dashboards.
- Generic AI landing-page templates.
- Cyberpunk.
- Neon.
- Glassmorphism.
- Minimalist black-and-white layouts.
- Medical or hospital branding.
- Pixel-art aesthetics.
- Excessive blur or glossy 3D rendering.

### Typography

Prefer:

- Baloo 2 for headings and emphasized UI.
- Nunito for descriptions and body text.

Ensure full Vietnamese diacritic support.

All text must remain readable on mobile.

### Buttons

Buttons should feel like interactive game UI.

Requirements:

- Rounded organic silhouettes.
- Soft pink, cream, or pastel colors.
- Dark brown outlining.
- Slightly raised appearance.
- Hover scale around 1.04.
- Gentle pressed state.
- Smooth transitions.
- Accessible keyboard focus.

---

## 4. WEBSITE STRUCTURE

Create a complete single-page game landing website.

### SECTION 1 — NAVIGATION

A playful floating navigation bar.

Include:

- Game title or logo if an actual logo asset exists.
- Trang chủ.
- Giới thiệu.
- Gameplay.
- Thế giới.
- Thư viện.
- Chơi ngay.

Design it as a small, cute game menu.

Use sticky positioning with an appropriate scroll behavior.

On mobile, provide a working responsive navigation menu.

### SECTION 2 — HERO

This is the most visually impressive section.

Goal: Make visitors immediately curious about the game.

Headline:

**CALL OUT MY CELLS**

Vietnamese tagline suggestion:

**Đội quân tế bào nhỏ bé. Cuộc chiến bảo vệ cơ thể!**

Supporting text:

"Xây dựng đội quân tế bào miễn dịch, chống lại những đợt tấn công của mầm bệnh và khám phá cách mỗi lựa chọn của bạn có thể thay đổi trận chiến."

Include:

- Large game title.
- Short description.
- One primary CTA: "Khám phá trò chơi".
- One secondary CTA: "Xem Gameplay".
- Actual gameplay screenshot: `Image/8_UI3J.png`.

Display the gameplay screenshot inside a large hand-drawn game frame.

Use small decorative flowers, stars, bubbles, and biological-inspired shapes around the composition.

Animation ideas:

- Decorative elements float gently.
- Screenshot enters with subtle scale and fade.
- Hero text reveals smoothly.
- Buttons have playful hover effects.

Keep the gameplay image sharp and recognizable.

### SECTION 3 — ABOUT THE GAME

Title:

**Một thế giới tí hon bên trong cơ thể!**

Explain the core concept using short, friendly Vietnamese copy.

Present three short concepts:

1. Bảo vệ cơ thể.
2. Xây dựng chiến thuật.
3. Mỗi lựa chọn đều quan trọng.

Use illustrated cards with pastel backgrounds.

Avoid heavy scientific explanations.

### SECTION 4 — LIFESTYLE CHOICES

Title:

**Một lựa chọn nhỏ, một thay đổi lớn!**

Use:

`Image/NZAtfi.png`

Explain the pre-battle lifestyle decision system.

Show examples:

- Ngủ đủ giấc.
- Tập thể dục.
- Thức khuya.
- Thói quen ăn uống.

Explain that lifestyle decisions affect the body's condition and battle performance.

Design this section as a visual novel or dialogue interface inspired by the actual screenshot.

Add an interactive example with 2–3 selectable lifestyle choices.

When visitors click a choice, the website can display a small explanatory preview of the possible game effect.

**This interaction must be clearly presented as a website demonstration, not the actual game's simulation.**

Do not invent exact numerical buffs or debuffs.

### SECTION 5 — CORE GAMEPLAY

Title:

**Triệu hồi tế bào. Bảo vệ cơ thể!**

Use:

`Image/8_UI3J.png`

Explain the lane-based tower defense mechanic.

Feature cards:

- Đặt tế bào phòng thủ.
- Ngăn chặn các đợt mầm bệnh.
- Kết hợp chiến thuật.
- Nâng cấp đội hình.

Gameplay screenshot should be the main focal point.

Use animated highlights around the screenshot frame, without covering important game UI.

### SECTION 6 — WORLD / CAMPAIGN

Title:

**Hành trình khám phá thế giới bên trong bạn!**

Use:

`Image/8WZZH7.png`

This section should resemble a colorful illustrated adventure notebook.

Explain the stage and campaign progression.

Show a large world-map screenshot.

Add subtle scroll-triggered decorations.

The website should make visitors feel that they are opening an adventure diary.

Do not falsely imply that all planned organ worlds or stages are already playable.

### SECTION 7 — KEY FEATURES

Title:

**Điều gì khiến Call Out My Cells đặc biệt?**

Create visually distinct feature cards for:

1. Tower Defense chiến thuật.
2. Lựa chọn lối sống.
3. Đội quân tế bào.
4. Chiến dịch khám phá cơ thể.
5. Hệ thống thẻ thuốc.

Information must align with the Final Report.

If a feature is planned but not yet available in the playable build, label it as "Dự kiến" or "Đang phát triển".

Use rounded illustrated cards, playful shapes, and smooth hover interactions.

### SECTION 8 — SCREENSHOT GALLERY

Title:

**Một chút hình ảnh từ thế giới Call Out My Cells!**

Use all three actual screenshots:

- `NZAtfi.png`
- `8WZZH7.png`
- `8_UI3J.png`

Create a responsive gallery with:

- Three image cards.
- Short Vietnamese captions.
- Hover animation.
- Full-screen lightbox on click.
- Next/previous gallery navigation.
- Escape key to close.
- Mobile swipe support if practical.

The screenshots must remain unchanged.

### SECTION 9 — PLAY / DOWNLOAD CTA

Title:

**Bạn đã sẵn sàng bảo vệ cơ thể chưa?**

Create a cheerful call-to-action section.

Include:

- Main call-to-action button.
- Short exciting description.
- Playful decorations matching the game's visual identity.

Important:

Do not invent a Google Play, App Store, itch.io, or Steam URL.

If a real game link is supplied, connect it.

Otherwise, display "Sắp ra mắt" or use a placeholder clearly marked for later configuration.

Do not claim the game is available to download without confirmation.

### SECTION 10 — FOOTER

Include:

- Call Out My Cells.
- Short game description.
- Navigation links.
- Social media placeholders, only where appropriate.
- Copyright information.
- Team or developer information if confirmed.

Make it cute, simple, and consistent with the rest of the website.

---

## 5. ANIMATION AND INTERACTIONS

Animations are essential to the website's personality.

Use Framer Motion / Motion or carefully implemented CSS transitions.

Required effects:

1. Smooth scroll behavior.
2. Scroll-triggered section reveals.
3. Gentle floating decorations.
4. Hover and pressed effects on buttons.
5. Slightly animated feature cards.
6. Responsive mobile navigation.
7. Functional screenshot gallery.
8. Smooth section transitions.

Optional:

- Subtle parallax on decorative elements.
- Small sticker bounce.
- Animated dashed path decoration.

Animation constraints:

- Avoid excessive movement.
- Avoid layout shifts.
- Avoid continuously animating large full-resolution images.
- Support `prefers-reduced-motion`.
- Keep performance smooth on mobile.

---

## 6. TECHNICAL REQUIREMENTS

First inspect the current project structure.

Do not delete existing code or replace the entire project without understanding it.

If an existing frontend framework is present, continue using it where reasonable.

If starting from scratch, prefer:

- React.
- Vite.
- TypeScript.
- Tailwind CSS.
- Motion / Framer Motion.
- Lucide React for simple utility icons.

Create reusable components.

Suggested organization:

`src/components/`

- Navbar
- HeroSection
- AboutSection
- LifestyleSection
- GameplaySection
- WorldSection
- FeaturesSection
- GallerySection
- DownloadSection
- Footer

Centralize page content and asset references where practical.

### Responsive Design

Support:

- Mobile: 320px–767px.
- Tablet: 768px–1023px.
- Desktop: 1024px and above.

Requirements:

- No horizontal overflow.
- No cropped or distorted screenshots.
- Touch-friendly buttons.
- Readable Vietnamese typography.
- Adaptive spacing and layouts.
- Optimized performance.

### Quality

- Semantic HTML.
- Meaningful alt attributes.
- Accessible buttons.
- Functional keyboard interactions.
- Lazy loading for below-the-fold screenshots.
- Proper image dimensions.
- SEO title and metadata.
- Open Graph metadata.
- No broken links.
- No missing assets.
- No console errors.

---

## 7. DESIGN QUALITY RULES

Do not create a generic AI-generated website.

Avoid repeating identical feature card layouts in every section.

Each major section should have a distinctive composition while maintaining visual consistency.

Prioritize visual storytelling.

The overall structure should resemble a handcrafted indie game promotional page.

Balance image density and empty space.

Use real screenshots as the main visual proof of the game's quality.

Do not overcomplicate the site with irrelevant animations or backend functionality.

The final result should feel:

- Cute.
- Warm.
- Cheerful.
- Immersive.
- Playful.
- Professionally polished.
- Faithful to the original game artwork.

---

## 8. IMPLEMENTATION WORKFLOW

Follow these steps in order.

**Step 1 — Inspect**

Analyze:

- Existing website files.
- Installed dependencies.
- Images inside the Image folder.
- Final Report documentation.

**Step 2 — Plan**

Create a short implementation plan containing:

- Website sections.
- Design system.
- Asset mapping.
- Component structure.
- Animation strategy.

**Step 3 — Build**

Implement the complete website.

Do not stop after producing only a mockup, plan, or wireframe.

**Step 4 — Verify**

Run the project.

Check:

- All screenshots load successfully.
- Navigation works.
- Buttons work.
- Gallery works.
- Layout works on mobile.
- No console errors.
- No broken image paths.
- No overflow.
- All Vietnamese text displays correctly.

**Step 5 — Improve**

Review the visual result.

Improve any section that looks generic, empty, too corporate, or disconnected from the game aesthetic.

**Step 6 — Deliver**

Provide:

1. Summary of completed features.
2. Project file structure.
3. List of image assets used and their paths.
4. Instructions to run the website locally.
5. Remaining placeholders requiring real information.

---

## FINAL EXPECTATION

Build a beautiful, complete, responsive website that makes Call Out My Cells feel like a charming, memorable indie mobile game.

The website must communicate the game's tactical gameplay, cute characters, biological setting, and meaningful lifestyle choices through engaging visual storytelling.

**Most important rule: The website's design language must come from the actual supplied game screenshots, not generic website templates.**

Start by inspecting the project files and assets, then proceed with the implementation.