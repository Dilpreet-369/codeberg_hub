# codeberg_hub
features till now remaining to implement:
1. during registeration checking if username is really unique in database (not matching with other users)

Here is a comprehensive overview of your project, its architectural direction, and a structured, production-ready roadmap you can copy and paste directly into your GitHub project `README.md` file.

---

## 🎯 Project Vision & Core Architecture

# CodebergHub Development Roadmap

This roadmap tracks the development lifecycle of CodebergHub from zero to MVP deployment and post-MVP scaling.

## 🟩 Phase 1: Authentication & Identity Blueprint (Completed)

* [x] Set up Express server with safe Mongoose schemas.
* [x] Configure secure user registration enforcing unique emails and alphanumeric usernames.
* [x] Build modern password hashing using `bcryptjs` hooks.
* [x] Build custom JWT authorization middlewares (`protectRoute`, `verifyRefreshToken`).
* [x] Remove third-party Google OAuth clutter to prioritize local credentials.
* [x] Develop React `Register` and `Login` interfaces with dark mode capabilities and instant state validation.
* [x] Add interactive password visibility eye-toggles to frontend fields.

---

## 🟨 Phase 2: Onboarding & User State Sync (Current Focus)

The objective of this phase is to establish developer identities right after login without creating friction.

* [ ] **Backend Endpoint:** Implement `PUT /api/users/onboarding` to capture developer profiles (`bio`, `workOrStudy`, `interests`) and flip the `isOnboarded` flag to `true`.
* [ ] **Frontend Soft-Gate Screen:** Build a minimal `/onboarding` slider screen in React where users can instantly set up their profile tags or hit a "Skip to Feed" button.
* [ ] **Profile Completion Component:** Build a visual progress tracking card (e.g., "Profile 40% Complete") to display in the main application layout to gently incentivize users to add their tech stacks later.

---

## 🟦 Phase 3: The Global Activity Feed (Infinite Scale Engine)

* [ ] **Post Schema Architecture:** Create a separate `post.model.js` schema pointing back to authors via their unique `username`.
* [ ] **Feed Operations API:** Build backend routes to write, read, and delete posts (`POST`, `GET /api/posts`).
* [ ] **Infinite Scroll / Pagination:** Set up MongoDB limit/skip pagination to return data in lightweight chunks of 15–20 posts.
* [ ] **Feed UI Layout:** Design a sleek developer dashboard containing a Markdown-supported post-creation container and community cards.

---

## 🟪 Phase 4: Peer-to-Peer Instant Messaging (Real-Time Networking)

* [ ] **WebSocket Integration:** Integrate `Socket.io` into the Express server loop for persistent, low-latency duplex connections.
* [ ] **Deterministic Room Routing:** Build instant chat room IDs by sorting and joining communicating usernames alphabetically (e.g., `userA_userB`).
* [ ] **Message Schema Layout:** Create a lightweight `Message` collection to archive chat logs permanently.
* [ ] **Chat UI Panel:** Build a real-time sidebar conversation view inside the React layout.

---

## 🚀 Phase 5: Post-MVP Optimization & Extensions

* [ ] **Google OAuth Re-introduction:** Implement Google Sign-In with an onboarding interception flow for missing usernames.
* [ ] **Hardware Optimization:** Dockerize the Node and React environments for clean deployments.
* [ ] **Markdown/Code Snippet Rendering:** Add syntax highlighting to the activity feed for shared code blocks.

---
