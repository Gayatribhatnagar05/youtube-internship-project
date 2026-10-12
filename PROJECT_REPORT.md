# PROJECT REPORT: YouTube 2.0 Full-Stack Platform

**Student Name:** Gayatri Bhatnagar  
**GitHub Repository:** https://github.com/Gayatribhatnagar05/youtube-internship-project  
**Live Hosted URL:** https://youtube-internship-project-umber.vercel.app  
**Deployment Platform:** Vercel  

---

## 1. Executive Summary
YouTube 2.0 is an advanced, full-stack video streaming and community interaction platform built upon the foundation of the initial training project. This project successfully implements all 6 assigned internship tasks, bringing production-grade features including real-time WebRTC watch parties, quota-governed video downloads, tiered subscriptions with invoice generation, a gesture-enabled custom video player, automated time/region personalization with OTP security, and multilingual comment moderation. The web application is fully responsive across desktop, tablet, and mobile devices.

---

## 2. Key Internship Features Implemented

### Task 1: Real-Time Watch Party & Video Call
- **Synchronized Playback:** Integrated real-time room communication using Socket.io to sync play, pause, and seek events across all connected participants simultaneously.
- **WebRTC Video Call:** Built-in peer-to-peer video and audio calling with device fallback guards.
- **Interactive Controls:** Includes mic mute/unmute, camera toggle, screen sharing, real-time chat, and an active participants roster.
- **Session Recording:** Implemented local browser-based session recording (MediaRecorder API) allowing hosts to capture and download watch party sessions locally.

### Task 2: Controlled Video Downloads with Daily Quotas
- **Tier-Based Limits:**
  - Free Plan: 1 download per day
  - Bronze Plan: 5 downloads per day
  - Silver Plan: 20 downloads per day
  - Gold Plan: Unlimited downloads
- **Dedicated Downloads Section:** Created a dedicated `/downloads` management page displaying download history, video metadata, download timestamps, and remaining daily quota.
- **Quota Enforcement:** Real-time quota validation prevents unauthorized or unlimited downloads by free-tier users.

### Task 3: Subscription Upgrades & Razorpay Test Payments
- **Tiered Plans:** Implemented Free, Bronze (₹99/mo), Silver (₹299/mo), and Gold (₹599/mo) plans with distinct feature unlocks.
- **Payment Gateway Simulation:** Seamless Razorpay payment modal with automated success callback and tier upgrade.
- **Invoice & Receipt Generation:** Automatically generates an itemized tax invoice including transaction ID, plan duration, subtotal, and 18% GST breakdown with a printable/downloadable format.

### Task 4: Custom Video Player with Gesture Support
- **Custom Controls:** Designed a responsive player interface with play/pause, volume scrubbing, fullscreen toggle, and next video quick navigation.
- **Quick Seek:** Added ±10-second skip buttons and an interactive progress bar.
- **Mobile Touch Gestures:** Double-tap on the left/right sides of the screen allows seamless ±10-second rewinding and fast-forwarding on mobile and touch devices.

### Task 5: Personalization & OTP Security Verification
- **Time/Region-Aware Themes:** Automatically switches to Light Mode during daytime (10:00 AM – 12:00 PM IST) and defaults to Dark Mode during other hours, while preserving manual theme toggle overrides.
- **Two-Factor OTP Security:** Enforces a 6-digit OTP verification challenge upon detecting a login from an unrecognized device or location.

### Task 6: Multilingual Comments & Content Moderation
- **Instant Translation:** Built-in translation engine supporting multi-language comment conversion (English, Hindi, Spanish, French, German, Japanese, etc.).
- **Location Tagging:** Optional user state/location display alongside comments.
- **Spam & Profanity Filter:** Automatic detection and warning for vulgar or spam comments.
- **Moderation Tools:** Community upvotes, downvotes, and a non-destructive flag/report mechanism for community review.

---

## 3. Technology Stack
- **Frontend:** Next.js 15 (React 19), TypeScript/JavaScript, CSS3 Design System, Lucide Icons
- **Backend:** Node.js, Express.js, Socket.io, WebRTC
- **Database & Storage:** MongoDB / Mongoose
- **Deployment & CI/CD:** Vercel (Production Hosting), Git/GitHub Version Control

---

## 4. UI/UX & Responsive Design
- Optimized for mobile, tablet, and desktop screens with fluid layouts.
- Added a mobile bottom navigation bar and responsive video action buttons to eliminate UI overflow on smaller viewports.
- Single-click Demo Sign In with test OTP toast alerts for effortless evaluation.

---

## 5. Conclusion
All specified internship requirements and training extensions have been thoroughly developed, tested, and deployed to a public, unauthenticated Vercel environment.
