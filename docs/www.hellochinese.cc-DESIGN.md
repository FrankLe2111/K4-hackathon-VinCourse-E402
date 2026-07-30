# Design System Inspired by HelloChinese

## 1. Visual Theme & Atmosphere

HelloChinese embodies a vibrant, approachable, and playful design language that celebrates cultural learning through interactive engagement. The visual identity combines bright, energetic accents with warm, inviting surfaces that encourage exploration and retention. The design uses bold typography paired with soft, rounded card containers and decorative background shapes, creating a joyful, non-threatening atmosphere perfect for language learners of all ages. The system balances professional credibility with approachable friendliness, using color gradients and layered visual depth to guide users through learning workflows while maintaining clarity and accessibility.

**Key Characteristics**
- Vibrant, saturated accent colors (teals, purples, pinks, oranges) used purposefully for feature differentiation
- Soft, highly rounded corners (`60px`) on containers for a friendly, modern feel
- Clean, neutral typography hierarchy with generous whitespace
- Warm, pastel background tints (#FFF9E5, #E3F9FF, #DFFFF3) that don't compete with content
- Playful use of layered background shapes and illustrated icons
- Accessibility-first design with strong contrast between text and backgrounds

## 2. Color Palette & Roles

### Primary
- **Brand Teal** (`#00CA72`): Primary call-to-action elements, accent highlights, and brand reinforcement; used for interactive links and key feature accents
- **Brand Teal Secondary** (`#00C898`): Secondary teal variant for hover states and depth variation

### Accent Colors
- **Vibrant Purple** (`#007AFF`): Accent for interactive elements and highlight states
- **Deep Maroon** (`#490000`): Used sparingly for emphasis and visual hierarchy depth (dark accent)

### Interactive
- **Success Green** (`#00CA72`): Links, interactive elements, and positive actions
- **Interactive Blue** (`#007AFF`): Alternative interactive state and secondary call-to-action

### Neutral Scale
- **Near Black** (`#222222`): Primary text color; used for all body copy and headings
- **Dark Gray** (`#444444`): Secondary text, labels, and reduced-emphasis copy
- **Medium Gray** (`#888888`): Tertiary text, hints, and disabled states
- **Light Gray** (`#E5E7EB`): Borders, dividers, and subtle backgrounds
- **Off White** (`#F6F6F6`): Subtle background tint
- **Pure White** (`#FFFFFF`): Primary background and card base

### Surface & Borders
- **Cream Tint** (`#FFF9E5`): Warm pastel surface for feature cards; used for game-based learning section
- **Light Blue Tint** (`#E3F9FF`): Cool pastel surface for information-dense cards
- **Mint Tint** (`#DFFFF3`): Fresh pastel surface for accent feature cards
- **Light Purple Tint** (`#F3F2FF`): Soft lavender surface for content sections
- **Border Default** (`#E5E7EB`): All borders and divider lines

## 3. Typography Rules

### Font Family
**Primary**: Poppins (sans-serif) — clean, modern, and highly legible for both display and body text
- Fallback stack: `Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`

**Secondary**: ui-sans-serif (system default) — used for navigation, labels, and interface text
- Fallback stack: `ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', system-ui, sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / Hero | Poppins | 128px | 900 | 128px | 0px | Large, bold landing page headline; "No. 1 Chinese Learning App" |
| Heading 1 | Poppins | 32px | 700 | 40px | -0.5px | Main section titles and feature headers |
| Heading 2 | Poppins | 24px | 600 | 32px | 0px | Subsection titles and card headers |
| Heading 3 | Poppins | 20px | 600 | 28px | 0px | Feature names and emphasis text |
| Body Large | Poppins | 18px | 400 | 28px | 0px | Feature descriptions and longer copy |
| Body | Poppins / ui-sans-serif | 16px | 400 | 24px | 0px | Standard body copy, navigation, and interface text |
| Body Small | ui-sans-serif | 14px | 400 | 20px | 0px | Labels, captions, and secondary information |
| Button | Poppins | 16px | 500 | 24px | 0px | Call-to-action and interactive labels |
| Code / Monospace | ui-sans-serif | 14px | 400 | 20px | 0px | Technical text and code references |

### Principles
- Use Poppins for all display and heading content to establish brand personality
- Use ui-sans-serif for interface and navigation to ensure system consistency
- Maintain minimum 16px base font size for body text to ensure accessibility
- Keep line height at 1.5x font size for readability (e.g., 16px text = 24px line height)
- Use generous letter spacing only on large display sizes for visual interest
- Ensure 4.5:1 contrast ratio between text and background for WCAG AA compliance
- Prioritize weight variation (400, 500, 600, 700, 900) over color for hierarchy

## 4. Component Stylings

### Buttons

**Primary Button**
- Background: `#00CA72`
- Text Color: `#FFFFFF`
- Padding: `12px 24px`
- Font: Poppins, 16px, weight 500
- Border Radius: `8px`
- Border: none
- Hover State: Background `#00B85F`, box-shadow `0px 4px 12px rgba(0, 202, 114, 0.2)`
- Active State: Background `#009F50`, box-shadow `0px 2px 4px rgba(0, 0, 0, 0.1)`
- Disabled State: Background `#E5E7EB`, Text Color `#888888`, cursor not-allowed

**Secondary Button**
- Background: `rgba(0, 202, 114, 0.1)`
- Text Color: `#00CA72`
- Padding: `12px 24px`
- Font: Poppins, 16px, weight 500
- Border Radius: `8px`
- Border: `1px solid #00CA72`
- Hover State: Background `rgba(0, 202, 114, 0.15)`, border-color `#009F50`
- Active State: Background `rgba(0, 202, 114, 0.2)`

**Ghost Button**
- Background: transparent
- Text Color: `#222222`
- Padding: `12px 24px`
- Font: Poppins, 16px, weight 400
- Border Radius: `0px`
- Border: none
- Hover State: Text Color `#00CA72`
- Underline on hover (text-decoration: underline)

### Cards & Containers

**Feature Card - Warm (Game-Based Learning)**
- Background: `#FFF9E5`
- Border Radius: `60px`
- Padding: `32px`
- Border: none
- Box Shadow: none
- Text Color: `#222222`
- Min Height: `306px`

**Feature Card - Cool (All-in-One Learning)**
- Background: `#F3F2FF`
- Border Radius: `60px`
- Padding: `32px`
- Border: none
- Box Shadow: none
- Text Color: `#222222`
- Min Height: `306px`

**Feature Card - Accent (Speech Recognition)**
- Background: `#FFE7F4`
- Border Radius: `60px`
- Padding: `32px`
- Border: none
- Box Shadow: none
- Text Color: `#222222`
- Min Height: `280px`

**Feature Card - Warm Alt (Handwriting)**
- Background: `#FFF9E5`
- Border Radius: `60px`
- Padding: `32px`
- Border: none
- Box Shadow: none
- Text Color: `#222222`
- Min Height: `280px`

**Standard Container**
- Background: `#FFFFFF`
- Border Radius: `8px`
- Padding: `24px`
- Border: `1px solid #E5E7EB`
- Box Shadow: `0px 1px 3px rgba(0, 0, 0, 0.05)`

### Inputs & Forms

**Text Input - Default**
- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Border Radius: `8px`
- Padding: `12px 16px`
- Font: ui-sans-serif, 16px, weight 400
- Text Color: `#222222`
- Placeholder Color: `#888888`
- Focus State: Border `1px solid #00CA72`, box-shadow `0px 0px 0px 3px rgba(0, 202, 114, 0.1)`

**Text Input - Error**
- Border: `1px solid #DC2626`
- Focus State: Border `1px solid #DC2626`, box-shadow `0px 0px 0px 3px rgba(220, 38, 38, 0.1)`

**Text Input - Disabled**
- Background: `#F6F6F6`
- Border: `1px solid #E5E7EB`
- Text Color: `#888888`
- Cursor: not-allowed

**Dropdown**
- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Border Radius: `8px`
- Padding: `12px 16px`
- Font: ui-sans-serif, 16px, weight 400
- Text Color: `#222222`
- Hover State: Border `1px solid #D1D5DB`
- Focus State: Border `1px solid #00CA72`, box-shadow `0px 0px 0px 3px rgba(0, 202, 114, 0.1)`

### Navigation

**Header Navigation**
- Background: `#FFFFFF`
- Height: `64px`
- Padding: `16px 32px`
- Border Bottom: `1px solid #E5E7EB`
- Display: flex, align-items center, justify-content space-between
- Z-index: `999`

**Navigation Link - Default**
- Text Color: `#222222`
- Font: ui-sans-serif, 16px, weight 400
- Padding: `8px 16px`
- Border Radius: `4px`
- Hover State: Background `rgba(0, 0, 0, 0.05)`, text-decoration underline
- Active State: Text Color `#00CA72`, border-bottom `2px solid #00CA72`

**Navigation Link - Accent**
- Text Color: `#00CA72`
- Font: ui-sans-serif, 16px, weight 400
- Hover State: Text Color `#009F50`

**Mobile Menu Toggle**
- Background: transparent
- Border: none
- Cursor: pointer
- Display: none on desktop, flex on mobile

### Badges & Labels

**Badge - Success**
- Background: `rgba(0, 202, 114, 0.15)`
- Text Color: `#00CA72`
- Padding: `6px 12px`
- Border Radius: `20px`
- Font: ui-sans-serif, 12px, weight 500
- Border: none

**Badge - Default**
- Background: `#E5E7EB`
- Text Color: `#444444`
- Padding: `6px 12px`
- Border Radius: `20px`
- Font: ui-sans-serif, 12px, weight 500
- Border: none

## 5. Layout Principles

### Spacing System
**Base Unit**: `4px`

**Scale**:
- `4px` — Tight spacing for inline elements
- `8px` — Compact spacing between small elements
- `12px` — Small padding inside components
- `16px` — Standard component padding and small gaps
- `20px` — Comfortable internal spacing
- `24px` — Medium section spacing and card padding
- `28px` — Between medium sections
- `32px` — Large gap between feature blocks
- `40px` — Extra-large spacing
- `48px` — Major section spacing
- `60px` — Hero-level spacing
- `64px` — Extra padding for large sections
- `72px` — Maximum section padding

**Usage Context**:
- Button padding: `12px 24px`
- Card padding: `24px` to `32px`
- Section margin: `48px` to `72px`
- Between grid items: `32px`
- Inline element spacing: `8px` to `16px`

### Grid & Container
- **Max Width**: `1200px` for standard content
- **Column Strategy**: 2-column grid for features on desktop (544px per card with 32px gap), 1-column on tablet/mobile
- **Horizontal Padding**: `32px` on desktop, `20px` on tablet, `16px` on mobile
- **Section Pattern**: Hero section (full width), feature grid (max-width container), testimonials (full width with centered content)

### Whitespace Philosophy
Generous whitespace is used throughout to prevent cognitive overload and guide focus. Each major section is separated by `48px` to `72px` of vertical space. Cards and components use internal padding of `24px` to `32px` to create breathing room around content. No elements should feel crowded; negative space is treated as a design element equal to positive space.

### Border Radius Scale
- `0px` — Navigation items, subtle separators, and minimal-style buttons
- `4px` — Small UI controls and tight containers
- `8px` — Standard containers, inputs, and modular cards
- `20px` — Rounded badges and small pill-shaped elements
- `60px` — Large feature cards with strong visual personality

### Border Widths
- **Thin** (`1px`): All borders by default — container borders, input borders, divider lines
- **Medium** (`2px`): Active navigation underlines, focus ring accents, emphasized borders

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base (Ground) | No shadow, flat | Cards on neutral backgrounds, feature containers |
| Raised (Level 1) | `0px 1px 3px rgba(0, 0, 0, 0.05)` | Subtle elevation for inputs, standard containers, and surface-level cards |
| Elevated (Level 2) | `0px 4px 12px rgba(0, 202, 114, 0.2)` | Button hover states, emphasized cards, and interactive elements |
| Floating (Level 3) | `0px 8px 24px rgba(0, 0, 0, 0.12)` | Modals, dropdowns, and prominent overlays |
| Maximum (Level 4) | `0px 16px 40px rgba(0, 0, 0, 0.15)` | Top-level modals, alerts, and full-screen overlays |

**Shadow Philosophy**: The system uses subtle, layered shadows sparingly to create hierarchy without visual noise. Shadows increase in intensity and blur radius as content rises in the z-index, providing clear depth cues. Most containers remain flat (`none`) to maintain the clean, modern aesthetic. Shadows are only applied to interactive elements that require visual feedback or to floating content that overlays other elements.

### Opacity Levels
- **Disabled/Inactive**: `0.20` opacity (20%) — Applied to disabled form inputs, inactive navigation items, and muted icons
- **Full/Active**: `1.00` opacity (100%) — All standard interactive elements and content

### Z-index / Layering
- **Base**: `1` — Standard page content, cards, and default components
- **Secondary**: `2` — Inline overlays and layered decorative elements
- **Dropdown**: `10` — Dropdown menus, tooltips, and floating content below modals
- **Modal**: `100` — Modal overlays, alerts, and blocking dialogs (inferred standard)
- **Sticky**: `999` — Header navigation, sticky sidebars, and persistent UI

## 7. Do's and Don'ts

### Do
- Use the teal accent color (`#00CA72`) prominently for primary calls-to-action and interactive elements to guide user focus
- Apply generous padding (`24px` to `32px`) inside cards and containers to create a spacious, welcoming feel
- Use Poppins font for all display text, headings, and feature titles to reinforce brand personality
- Apply the full rounded border radius (`60px`) to large feature cards to create visual distinction and warmth
- Maintain at least `48px` vertical spacing between major sections to prevent cognitive overload
- Use color-tinted card backgrounds (`#FFF9E5`, `#F3F2FF`, etc.) to differentiate feature sections without stark contrast
- Prioritize 16px minimum font size for all body text to ensure readability
- Use white space as a design tool — negative space is as important as positive space
- Apply subtle shadows (`0px 1px 3px rgba(0, 0, 0, 0.05)`) only to interactive elements that require visual feedback
- Test all interactive elements for a minimum 4.5:1 contrast ratio between text and background

### Don't
- Don't use the deep maroon color (`#490000`) as a primary color — reserve it for rare accent highlights only
- Don't apply multiple shadow layers to the same element; use the appropriate elevation level instead
- Don't reduce padding below `12px` inside components or buttons; maintain comfortable spacing for touch targets
- Don't use less than `24px` line height for body text; readability is critical for a learning platform
- Don't apply border radius smaller than `8px` to standard containers; maintain the system's rounded, friendly aesthetic
- Don't override the typography hierarchy with arbitrary font sizes; stick to the defined scale
- Don't use more than three accent colors in a single view; excessive color creates visual chaos
- Don't apply opacity to text instead of using the neutral color scale; always use semantic colors for hierarchy
- Don't remove the border-bottom from active navigation links; it's a key wayfinding affordance
- Don't overcrowd feature cards with text; use the tinted backgrounds to create clear visual boundaries

## 8. Responsive Behavior

### Breakpoints

| Breakpoint Name | Width | Key Changes |
|-----------------|-------|------------|
| Mobile | 320px–639px | Single-column layout, 16px horizontal padding, stacked cards, 2x button height, 16px spacing, font sizes reduced by 2px where appropriate |
| Tablet | 640px–1023px | 2-column grid for features, 20px horizontal padding, adjusted card widths, 24px spacing, full typography scale |
| Desktop | 1024px+ | Full 2–4 column layouts, 32px horizontal padding, max-width containers (1200px), 32px+ spacing, maximum typography scale |

### Touch Targets
- **Minimum Hit Area**: `44px × 44px` for all interactive elements (buttons, links, form controls)
- **Button Height**: `36px` minimum on desktop, `44px` on mobile
- **Button Width**: Minimum `44px` for icon-only buttons, `100px` minimum for text buttons
- **Form Input Height**: `40px` minimum for text inputs, dropdowns, and selects
- **Spacing Between Targets**: Minimum `8px` between adjacent interactive elements to prevent accidental activation
- **Link Text**: Minimum `16px` font size on mobile, underlined or visually distinct on hover

### Collapsing Strategy
- **Feature Grid**: Transitions from 2-column (544px each + 32px gap) on desktop to 1-column on tablet (full width with 20px padding) to stacked on mobile (100% width with 16px margin)
- **Navigation**: Horizontal navigation on desktop (`ui-sans-serif`, 16px) collapses to hamburger menu icon on tablet (640px) with full-screen overlay menu
- **Cards**: `60px` border radius maintained on all breakpoints; padding reduces from `32px` to `24px` on tablet, `20px` on mobile
- **Typography**: Display size (`128px`) reduces to `64px` on tablet, `48px` on mobile; body font remains `16px` minimum on all breakpoints
- **Spacing**: All vertical gaps reduce by 20% on tablet, 40% on mobile; horizontal padding adjusts as noted above
- **Images**: Scale to `100%` width with max-width constraints; maintain aspect ratio with `max-width: 100%` and `height: auto`

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA / Links**: Success Green (`#00CA72`) — all primary interactive elements and main call-to-action buttons
- **Secondary Accent**: Interactive Blue (`#007AFF`) — secondary interactive states and alternative highlights
- **Background**: Pure White (`#FFFFFF`) — primary page and container background
- **Text (Primary)**: Near Black (`#222222`) — all main heading and body text
- **Text (Secondary)**: Dark Gray (`#444444`) — labels, secondary copy, and de-emphasized text
- **Text (Tertiary)**: Medium Gray (`#888888`) — hints, placeholders, and disabled states
- **Borders / Dividers**: Light Gray (`#E5E7EB`) — all container borders, input borders, and divider lines
- **Feature Card - Warm**: Cream Tint (`#FFF9E5`) — game-based learning and warm feature sections
- **Feature Card - Cool**: Light Purple Tint (`#F3F2FF`) — all-in-one learning and information sections
- **Feature Card - Accent**: Mint Tint (`#DFFFF3`) — special accent feature cards
- **Feature Card - Alt**: Light Blue Tint (`#E3F9FF`) — alternative feature card backgrounds

### Iteration Guide

1. **Always use Poppins font** for headings (h1, h2, h3) and body large (18px+); use `ui-sans-serif` only for navigation, labels, and small interface text. Fallback stacks are critical for cross-platform consistency.

2. **Primary interactive color is always `#00CA72`** — all buttons, links, active states, and accent highlights use this teal. Secondary interactive elements use `#007AFF` (blue) for visual variation. Never use other colors for interactive elements.

3. **Typography hierarchy is defined by size and weight, not color** — use the established scale (128px display, 32px h1, 24px h2, 16px body) with weight variations (400, 500, 600, 700, 900). Never invent new font sizes or weights.

4. **Maintain minimum 16px font size for all body text** and ensure `1.5x line height` (e.g., 24px for 16px text). This ensures accessibility and readability on all devices. Do not reduce sizes below this threshold.

5. **Feature cards use large `60px` border radius** with tinted background colors (`#FFF9E5`, `#F3F2FF`, `#FFE7F4`, `#DFFFF3`). Each card typically has `32px` internal padding and no border or shadow. Cards are the primary visual container pattern.

6. **Spacing follows the 4px scale** — always use multiples of 4px (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `48px`, `64px`, `72px`). Default section margins are `48px` to `72px` vertical, `32px` horizontal. Card padding is `24px` to `32px`.

7. **Neutral colors handle hierarchy** — use `#222222` for primary text, `#444444` for secondary, `#888888` for tertiary. The neutral scale (`#E5E7EB`, `#F6F6F6`) defines borders and subtle backgrounds. Never use color for text hierarchy; use weight and size instead.

8. **Responsive behavior collapses in order** — Desktop (2-column, 1200px max, 32px padding) → Tablet (2-column, 20px padding) → Mobile (1-column, 16px padding). All font sizes remain consistent; only layout and spacing adjust. Touch targets stay `44px` minimum.

9. **Elevation uses sparse, subtle shadows** — only apply shadows to interactive elements (`0px 1px 3px rgba(0, 0, 0, 0.05)` for hover, `0px 4px 12px rgba(0, 202, 114, 0.2)` for elevated states). Most containers remain flat. Maximum shadow blur is `40px` for full-screen overlays.

10. **Accessibility is non-negotiable** — all text maintains `4.5:1` contrast ratio with backgrounds, form inputs are labeled and keyboard-accessible, interactive elements have visible focus states (`3px rgba(0, 202, 114, 0.1)` ring), and touch targets are always `44px+`. Test every color combination before deployment.