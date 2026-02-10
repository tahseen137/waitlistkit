# QE Master Plan: WaitlistKit Pre-Launch Validation

**Role:** Chief Strategy Officer (CSO)  
**Date:** February 7, 2026  
**Status:** DRAFT  
**Target:** Pre-Launch Validation for "WaitlistKit"

---

## 1. The Workflow: Dev -> QE -> Sign-off

This protocol ensures a clean handover between Development and Quality Engineering (QE) to prevent regression and ensure launch readiness.

### **Phase 1: The Hand-off (Dev -> QE)**
*   **Trigger:** Developer completes a feature or fix.
*   **Action:** Developer must:
    1.  Deploy to the **Staging/Preview Environment** (e.g., Vercel Preview URL).
    2.  Update `waitlistkit/CHANGELOG.md` with "Unreleased" changes.
    3.  Ping QE with: *"Ready for QA - [Commit Hash/Preview URL]"*.
*   **Gate:** QE **does not** start testing until a specific Preview URL is provided.

### **Phase 2: The Validation (QE Execution)**
*   **Action:** QE executes the **Master Test Suite** (defined below) against the Preview URL.
*   **Constraint:** Testing must happen on:
    *   Desktop (Chrome/Arc)
    *   Mobile (iOS Safari)
*   **Output:** Results recorded in `waitlistkit/QA_LOG.md`.

### **Phase 3: The Verdict**
*   **Pass:** QE marks the release as **"VERIFIED"** in the QA Log and notifies the CTO.
*   **Fail:** QE logs a **Bug Report** (see Section 3) and rejects the release.

---

## 2. The Master Test Suite

The QE must validate these 5 Critical Paths to prove the product works.

### **Path A: The Embed Widget (The Core Product)**
*   **Goal:** Verify the widget works on an *external* site (not just localhost).
*   **Test Steps:**
    1.  Create a fresh Project in the Admin Dashboard.
    2.  Copy the `<script>` embed code.
    3.  Create a local `index.html` file and paste the code.
    4.  Open `index.html` in a browser.
*   **Pass Criteria:**
    *   Widget renders with correct colors/text.
    *   Loading state is visible.
    *   No console errors.

### **Path B: The Viral Loop (Signups & Referrals)**
*   **Goal:** Verify the referral engine counts correctly.
*   **Test Steps:**
    1.  **User A** signs up via the Widget.
        *   *Check:* User A gets a unique Referral Link.
        *   *Check:* User A is added to DB with `position: 1`.
    2.  **User B** clicks User A's Referral Link.
    3.  **User B** signs up.
        *   *Check:* User B is added to DB.
        *   *Check:* **User A's `referralCount` increments by 1.**
        *   *Check:* User A's position updates (if dynamic positioning is enabled).
*   **Pass Criteria:** Database reflects the referral relationship (`referredBy` column matches User A's code).

### **Path C: The Admin Dashboard**
*   **Goal:** Verify the user can manage their data.
*   **Test Steps:**
    1.  Access `/admin/[projectId]?secret=[adminSecret]`.
    2.  Verify the list shows User A and User B.
    3.  Click **"Export CSV"**.
*   **Pass Criteria:** Downloaded CSV contains valid email, position, and referral count data.

### **Path D: Stripe Monetization (Sandbox)**
*   **Goal:** Verify upgrading to "Pro" works.
*   **Test Steps:**
    1.  Click "Upgrade to Pro" in the Admin Dashboard.
    2.  Complete checkout using Stripe Test Card (`4242...`).
    3.  Return to Dashboard.
*   **Pass Criteria:**
    *   Admin Dashboard shows "Plan: Pro".
    *   DB `Project` table shows `plan: "pro"` and valid `stripeSubscriptionId`.

---

## 3. The Bug Loop (Defect Management)

If a test fails, we follow the **"Stop the Line"** protocol.

1.  **Log It:**
    *   QE adds an entry to `waitlistkit/QA_LOG.md`:
        *   `[FAIL] Path B - Step 3: User A referral count did not increment.`
        *   `Severity: P0 (Blocker)`
2.  **Assign It:**
    *   QE notifies Dev: *"Validation Failed on [Feature]. See QA_LOG.md."*
3.  **Fix It:**
    *   Dev fixes the issue and deploys a **New Preview URL**.
    *   Dev replies: *"Fix deployed. Retry."*
4.  **Verify It:**
    *   QE re-runs the *specific failed test* AND the *Regression Test* (verify no side effects).

---

## 4. Sign-Off Criteria (Go/No-Go)

The CSO will only authorize "Go for Launch" when:

1.  **100% Pass Rate** on Critical Paths A, B, and C (Widget, Viral Loop, Admin).
2.  **Stripe Integration** confirmed in Test Mode (Path D).
3.  **Zero P0/P1 Bugs** open in `QA_LOG.md`.
4.  **Performance Check:** Widget loads in < 1.5 seconds on 4G network.

**Signed:**
*Chief Strategy Officer*
