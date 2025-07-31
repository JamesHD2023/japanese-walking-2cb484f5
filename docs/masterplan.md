# Masterplan.md – Japanese Walking App

## 📌 App Overview and Objectives
A minimalist walking timer app that helps users follow the Japanese Walking method with audible pace cues, progress tracking, and motivational summaries. Designed to be exceptionally easy to use, even for less tech-savvy users, with a clean interface and focus on long-term health benefits.

**Objectives:**
- Promote cardiovascular health and longevity via interval walking
- Offer frictionless daily use with low-tech, intuitive UX
- Encourage users to form consistent walking habits through visual progress and milestone messages

---

## 👥 Target Audience
- **Age Group**: Primarily 35+
- **Tech Experience**: Low to moderate
- **Behavior**: Already walks casually or wants to optimize walking time for health
- **Motivation**: Improve long-term health, reduce stress, boost energy, and live longer

---

## ⚙️ Core Features and Functionality
1. **Timed Walk Options**: 15, 30, 45, and 60-minute walk timers
2. **Audible 3-Minute Signals**: Cue users to switch walking pace (fast/slow)
3. **Background Operation**: Screen-off timer and audio cue functionality
4. **Progress Tracking**:
   - Daily minutes walked
   - Sessions per day
   - Weekly totals and averages
   - Streak counter
   - Consistency score (active days in past 30)
   - Personal bests
   - Monthly summary email
5. **Mandatory Account Creation** (email/password + Google/Apple login)
6. **Onboarding Screens with Educational Value**
7. **5-Day Full Access Trial**, then subscription:
   - $15/year
   - Post-trial: access limited to 15-minute timer, no tracking
8. **In-App Purchases via Apple Pay, Google Pay, Stripe**

---

## 🧱 High-Level Technical Stack (Recommended)
- **Platform**: Cross-platform mobile (Android + iOS)
- **Build Tool**: Lovable (No-code platform)
- **Database**: Built-in Lovable storage or Firebase for user and activity data
- **Auth**: Firebase Auth or Lovable’s native login support
- **Payments**: Apple IAP, Google Play Billing, Stripe (web fallback)
- **Email**: Integration with MailerSend or similar for monthly summaries

---

## 🗂️ Conceptual Data Model
- **User**
  - ID
  - Email/Login Method
  - Trial Status / Subscription Status
  - Onboarding Complete (yes/no)

- **Session Log**
  - User ID
  - Date/Time
  - Duration
  - Number of Intervals Completed

- **Streaks & Scores**
  - Last active day
  - Current streak
  - Longest streak
  - Consistency %
  
---

## 🎨 User Interface Design Principles
- Minimal touch points per screen
- High contrast, legible font (accessible design)
- Large buttons with clear labels
- Friendly, encouraging copy
- No clutter: one primary action per screen
- Accessible without tutorials or tooltips

---

## 🔐 Security Considerations
- All user data stored with encryption
- Minimal PII stored (email + auth ID only)
- Secure payment handling via platform-native APIs
- Data deletion on user request

---

## 🚀 Development Phases / Milestones
**Phase 1: Core MVP Build**
- Onboarding screens
- Login system
- Walk timers with audio cues
- Session logging
- History screen

**Phase 2: Monetization & Trial Logic**
- Trial countdown
- Subscription gate logic
- In-app purchases

**Phase 3: Retention & Motivation Features**
- Monthly summary email
- Streaks, personal bests, consistency score
- Milestone messages

**Phase 4: Polish & App Store Prep**
- Final QA + bug fixes
- Design refinements
- App Store and Play Store listing setup

---

## ⚠️ Potential Challenges & Solutions
- **Audio cue reliability in background** → Test thoroughly across OS versions
- **App store compliance** → Follow IAP guidelines strictly from Day 1
- **Low-tech users confused by login** → Use friendly, motivating language during signup

---

## 🌱 Future Expansion Possibilities
- Social features (e.g. friend streaks)
- Apple Health / Google Fit syncing
- Optional reminders (toggleable)
- Multi-language support
- Web version for dashboards and stats

