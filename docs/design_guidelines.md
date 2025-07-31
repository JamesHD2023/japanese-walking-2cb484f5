# Design Guidelines – Japanese Walking App

## 🎨 Visual Style

### Color Palette
- **Primary Color**: #3A7D44 – Calm green (health, vitality)
- **Accent Color**: #F4C542 – Bright yellow (positivity, motivation)
- **Neutral Background**: #FFFFFF – White
- **Text Color**: #222222 – Very dark gray
- **Muted Border/Divider**: #E0E0E0 – Light gray

### Typography
- **Primary Font**: Inter or SF Pro (rounded, highly legible)
- **Font Sizes**:
  - Headers: 24–28px
  - Body text: 16–18px
  - Subtext: 14px
- **Font Weight**: Medium to Semi-bold
- **Line height**: 1.5x font size

### Iconography
- Simple, intuitive icons (walking person, clock, calendar)
- No unnecessary animations or novelty symbols

---

## 🔘 Buttons & Controls

### Button Styles
- **Primary Button**
  - Background: #3A7D44
  - Text: White
  - Border Radius: 12px
  - Padding: 16px vertical, 24px horizontal
  - Font: 16px, bold

- **Secondary Button**
  - Background: transparent
  - Border: 2px solid #3A7D44
  - Text: #3A7D44

- **Disabled Button**
  - Background: #E0E0E0
  - Text: #888888

### Hover & Active States
- Buttons darken by 10% on tap/press
- Provide haptic feedback where supported

---

## 📱 Layout & Padding
- **Page padding**: 20px
- **Spacing between elements**: 12–16px
- **Section gaps**: 24px
- **Buttons full-width on mobile**
- Avoid dense or crowded layouts

---

## 📑 Dropdowns & Inputs
- **Dropdown Menus**
  - Full-width with rounded corners
  - Touch-friendly (min 48px height per option)

- **Text Inputs**
  - Rounded corners
  - Clear labels above field
  - Autofill support for email

---

## 🧭 Navigation & Flow
- Bottom nav or persistent top nav depending on Lovable components
- Key sections: Home (Timer), History, Settings
- Back navigation always visible where relevant

---

## ♿ Accessibility
- Minimum contrast ratio 4.5:1
- Tap target size: 48px min
- Support for iOS/Android font scaling
- No required gestures—tap only
- Avoid flashing or animation that could be disruptive

