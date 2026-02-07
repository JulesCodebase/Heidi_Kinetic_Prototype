# Kinetic Network — Patient History Sharing Incentive System

> A working prototype demonstrating a credit-based reciprocity model that makes information sharing a selfish, rational decision for competing physiotherapy clinics.

**Built for:** Heidi Health — Project 1: Incentive Design Under Adversarial Conditions

---

## The Problem

Kinetic serves 1,800 independent physiotherapy clinics. Patients increasingly see multiple physios across locations and specialties, but each clinic treats them as a brand-new patient — repeating assessments, losing treatment context, and delaying recovery.

Clinics have asked for shared patient history. But incentives are misaligned:

- **71%** want to *receive* history from other clinics
- **19%** want to *share* theirs
- **Primary fear:** "I don't want to help patients switch to competitors."
- **Secondary fear:** "What if another physio judges my treatment?"

This is not a policy problem. It is an incentive design problem.

## The Solution: Credit-Based Reciprocity

The Kinetic Network applies a simple economic principle: **you must give to get.**

Clinics earn credits by contributing structured patient data and spend credits to access records from other clinics. The system creates a self-reinforcing loop:

```
Share Records → Earn Credits → Spend Credits to Access Others → See Network Value → Share More
```

No clinic gets a free ride. Contribution is the price of admission.

## How the Two Core Fears Are Addressed

### Fear 1: "I don't want to help patients switch to competitors"

- **Delayed Disclosure:** Clinics can delay detailed clinical notes by 30 days. The receiving clinic gets a summary immediately, but full treatment details are withheld — protecting the sharing clinic's competitive edge during active treatment.
- **Summary-Only Mode:** Clinics can choose to share only high-level clinical data (diagnosis, sessions, outcomes) without detailed notes, intervention specifics, or subjective assessments.
- **Selective Attributes:** Each share lets the clinic choose exactly which of 7 data categories to include. A clinic can share diagnosis and outcomes while withholding treatment methodology.

### Fear 2: "What if another physio judges my treatment?"

- **Enforced Anonymization:** Patient names are always anonymized (cannot be toggled off). Records are identified by condition category, not by individual.
- **Aggregate Insights:** The Network Insights dashboard shows population-level trends (modality effectiveness, recovery benchmarks) — not individual clinic performance. No clinic is singled out.
- **Quality Score Rewards Completeness, Not Correctness:** The scoring system measures *how much* data you share, not whether your treatment approach was "right." There is no peer review or rating of clinical decisions.

---

## How to Run

### Quick Start

**Prerequisite:** [Node.js](https://nodejs.org) must be installed.

**Windows:** Double-click `start-windows.bat`
**Mac:** Double-click `start-mac.command` (right-click > Open if blocked by Gatekeeper)

A terminal window will install dependencies and open the app in your browser automatically.

### Developer Method

```bash
npm install
npm run dev
```

---

## System Walkthrough

### 1. Opt-In / Opt-Out (Settings)

The clinic starts opted out with 0 credits. The Settings page presents a toggle to join the network, with a three-step explanation: **Share → Earn → Learn**.

Opting out triggers a confirmation modal showing what will be lost:
- Access to 847 participating clinics
- Network Insights dashboard
- **All accumulated credits (forfeited)**

This visible consequence creates a psychological switching cost that discourages churn once a clinic has invested effort.

### 2. Sharing Records and Earning Credits (Share Record)

A three-panel interface:
- **Left:** Patient list with search
- **Center:** Clinical record preview with raw physiotherapy notes
- **Right:** Sharing configuration with real-time quality scoring

**Quality Score System — 7 weighted attributes:**

| Attribute | Weight |
|-----------|--------|
| Diagnosis | 10% |
| Subjective History | 15% |
| Objective History | 20% |
| PROMs / Outcomes | 15% |
| Interventions / Treatment | 20% |
| Total Sessions | 5% |
| Patient Case Type | 15% |

**Credit Multiplier Tiers:**

| Quality Score | Tier | Multiplier |
|--------------|------|------------|
| 90–100% | Complete | 1.0x |
| 60–89% | Good | 0.7x |
| 30–59% | Partial | 0.4x |
| 0–29% | Minimal | 0.3x |

Toggling attributes on/off updates the quality score, multiplier, and estimated credit earning in real time. The system nudges clinics toward completeness by showing which missing attributes would increase their multiplier.

### 3. Browsing and Unlocking Records (Browse Network)

A searchable grid of network records showing diagnosis category, contributing clinic, distance, and clinic tier (Gold/Silver/Bronze). Each record costs **1.0 credit** to unlock. If the clinic has insufficient credits, the unlock button is disabled with a "Need Credits" label — forcing them back to the Share flow.

### 4. Requesting Specific Records (Request Records)

Clinics can search a global patient index and send targeted requests to specific clinics. Each request costs 1.0 credit (deducted immediately). The prototype simulates clinic approval with a 4-second delay.

### 5. Transaction History (Credit Ledger)

A full audit trail of all credit transactions: contributions (green), retrievals (red), and requests. Summary cards show current balance, total earned, total spent, and average quality score. A reference table at the bottom explains the multiplier tiers.

### 6. Network Insights (The Value Proposition)

Aggregate clinical intelligence across all 847 participating clinics, broken down by body region (Shoulder, Knee, Spine, Hip, Ankle, Neck):
- **Most Effective Modalities** — horizontal bar chart comparing treatment approaches
- **Recovery Speed** — line chart comparing your clinic vs. network average vs. industry average

This data is impossible for a single clinic to generate alone. It is only accessible to network participants. This is the core retention driver.

### 7. Membership and Token-to-Discount Conversion

A $99/month Professional Plan where earned credits can reduce the subscription cost:
- 1 credit = $2.00 discount
- Maximum discount: 40% ($39.60 off, requires 20 credits)

This creates a direct financial return on sharing — appealing to practice managers focused on cost.

### 8. Opt-Out Consequences

When a clinic attempts to leave, the confirmation modal explicitly lists what they lose: network access, insights, and their entire credit balance. Once a clinic has accumulated credits and relied on network insights for clinical benchmarking, leaving becomes an irrational economic decision.

---

## Scaling Strategy: 19% → 80%+

The system is designed to create compounding incentives that scale participation over time:

1. **Zero-Credit Start** — New clinics begin with 0 credits. The only way to access the network is to contribute first. This eliminates free-riding and ensures skin in the game from day one.

2. **Quality Multipliers** — The tiered scoring system (0.3x–1.0x) creates an internal incentive to share comprehensive data, not just the minimum. This raises aggregate data quality, which makes the network more useful for everyone.

3. **Privacy Controls Reduce Fear** — Delayed disclosure, summary-only mode, and selective attributes let clinics participate at their own comfort level. A clinic that shares only diagnoses and outcomes (withholding treatment details) still earns credits and accesses the network. The barrier to entry is low; depth of participation increases over time as trust builds.

4. **Network Effects** — Network Insights provide aggregate clinical intelligence that individual clinics cannot generate alone. As more clinics join, the data becomes richer and the insights become more valuable — a classic positive feedback loop. Early adopters see enough value to stay; their presence attracts the next wave.

5. **Visible Switching Costs** — Opting out forfeits all accumulated credits and access. The confirmation modal makes this cost explicit. Once invested, leaving is economically painful.

6. **Gamification** — Percentile rankings, badges (Network Verified, Top Contributor), and monthly activity tracking create social proof and competitive motivation between clinics.

7. **Financial Integration** — Token-to-discount conversion on membership fees creates a tangible monetary return on sharing, converting participation into a line item on the P&L that practice managers can justify.

**The compounding effect:** Each mechanism reinforces the others. Quality data attracts more clinics (network effects), which makes insights more valuable (retention), which makes leaving more costly (switching costs), which drives deeper sharing (quality multipliers), which attracts more clinics. The 19% who already want to share become the seed; the system's economics pull the remaining 61% who want to *receive* into contributing as the price of access.

---

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React

## Project Structure

```
App.tsx                        Main application router
context/AppContext.tsx          Global state, business logic, credit calculations
types.ts                       TypeScript interfaces
constants.ts                   Mock clinical data (10 patients, 10 network records)
components/
  Dashboard.tsx                Credit balance, badges, percentile ranking
  ShareRecord.tsx              Three-panel contribution flow with quality scoring
  BrowseRecords.tsx            Network record browsing and unlocking
  RequestRecords.tsx           Targeted record requests with simulated approval
  CreditLedger.tsx             Transaction history and multiplier reference
  NetworkInsights.tsx          Aggregate data visualizations by body region
  Settings.tsx                 Opt-in/out toggle, sharing preferences, privacy
  Membership.tsx               Subscription plan with token discount
  Layout.tsx                   Sidebar navigation and access control
  RecordDetailModal.tsx        Record detail overlay with privacy enforcement
```

---

*Submitted as part of the Heidi Health application — Project 1: Incentive Design Under Adversarial Conditions.*
