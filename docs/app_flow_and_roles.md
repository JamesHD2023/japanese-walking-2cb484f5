# App Flow, Pages, and Roles – Japanese Walking App

## 👤 User Roles
- **Single role**: All users are equal (no admin roles in V1)

---

## 📲 App Pages & Flow

### 1. **Welcome Screen**
- Brief intro to the app’s value
- Bullet-point benefits:
  - Boost heart health and energy in 30 minutes a day
  - Scientifically proven method
  - Easy for anyone to use
- Button: "Why it Works"

### 2. **"Why it Works" Page**
- Overview of the Japanese Walking method
- Research-backed benefits (visual summary + bullet points)
- Option to return to welcome screen or continue to signup

### 3. **Sign-Up / Login Page**
- Required for access
- Options:
  - Email + Password
  - Apple Login (iOS)
  - Google Login (Android)
- Friendly language explaining why login is needed

### 4. **Trial Welcome Page**
- Confirms 5-day full access
- Shows trial countdown
- CTA: “Start My First Walk”

### 5. **Home / Timer Page**
- Timer Options: 15, 30, 45, 60 minutes
- One-tap Start Button
- Background audio cue every 3 mins
- Option to end walk early

### 6. **Walk Complete Summary**
- Session duration
- Intervals completed
- Button to go to History

### 7. **History Page**
- Daily logs: minutes walked, # of sessions
- Weekly summary bar chart
- Current streak
- Personal bests
- Consistency Score (active days in past 30)

### 8. **Subscription Lock Screen** (Post-Trial)
- Message: “Your trial has ended”
- Explain locked features (timers, history, tracking)
- Button: “Unlock Full Access – $15/year”
- In-app payment via Apple/Google/Stripe

### 9. **Settings / Help Page**
- View account info (email, subscription status)
- Privacy policy, data deletion
- Option: resend monthly email summary

---

## 🔄 User Flow Summary
1. Open app → Welcome Screen
2. Tap “Why it Works” (optional)
3. Create account → Trial starts
4. Start walking session
5. View history and progress
6. After 5 days → lock features → upgrade prompt

---

## 🛑 Error States & Edge Cases
- Block access to >15-min timer post-trial
- Handle no internet gracefully
- Prevent multiple timers from running at once
- Confirm end session to avoid accidental exits

