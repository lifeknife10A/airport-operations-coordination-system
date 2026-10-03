# 📋 SAPHIRE AOCS: Official Submission Guidelines, CR Audio Briefing & Presentation Blueprint

**Project**: Saphire Airport Operations Coordination System (AOCS)  
**Document**: Submission Guidelines, Comprehensive CR Recording Transcript & Master Deliverable Action Plan  
**Submission Due Date**: **05 October 2026, 23:59 IST** *(Reference: Department Notice & CR Clarification)*  
**Team**:
- **Krishna Solanki (I075)** — Database & System Integration Lead
- **Anuvrat Tripathi** — Frontend UI/UX Lead
- **Anay Modi** — Backend API & Logic Lead
- **Chaitanya Tikku** — Documentation, UML & QA Testing Lead

---

## 🎙️ 1. Class Representative (CR) Audio Briefings & Transcripts

### **Audio Recording 1 (`18:06:26`) — Initial Submission & Video Requirements:**
> *"Um, so in PPT we have to add everything that we have done from Lab 1 to Lab 9. So first lab was user stories, so we have to add user stories. Then there are diagrams, multiple diagrams, so we have to add that in presentations.*  
> 
> *And then we have to make a different video of like 5 minutes, 5 to 6 minutes, not more than that. It will show the working of your website, like the software that you have built, uska working we have to show.*  
> 
> *And in that working, there should be a like small image of you that is explaining everything, like jaise Meet pe hum karte hain na, waise.*  
> 
> *So these are the two things that you have to submit on 4th of October? I thought it is 5th of October."*

---

### **Audio Recording 2 (`18:26:49`) — Slide Count & Professor's Viva Evaluation Model:**
> *"I'm not sure why is that happening, I'll send you another one. So basically sir wants ki 20 to 25 slides ho sakta hai, like he wants a clear content of everything that you have done. He will not make you say the PPT, like you... tumhe explain nahi karna hai PPT ko like ye ye hai, ye ye hai jaise normal presentation mein karte hain, wo nahi karna hai. He'll just look through the PPT and the working, and he'll ask questions on the basis of that."*

---

## 📌 2. Key Takeaways & Evaluation Dynamics

1. **Slide Count & Depth**: Target **20 to 25 slides**. The professor wants comprehensive, self-documenting technical content covering every aspect of the project and Labs 1–9.
2. **Viva Format**: You will **not** give a standard slide-reading speech. The professor will **inspect and flip through the PPT deck and the working software**, asking targeted technical viva questions directly based on what is shown on the slides and in the database/code.
3. **Implication**: Slides must be rich with **actual architecture diagrams, mathematical/relational models, database schema fragments, workflows, and live UI console captures** so all evidence of engineering rigor is readily visible.

---

## 📑 3. Master 22-Slide Technical Blueprint (Labs 1 to 9 & Viva Inspection Ready)

| Slide # | Category / Lab | Slide Title & Key Focus Areas | Specific Repository & Lab Artifacts |
| :---: | :--- | :--- | :--- |
| **01** | **Title & Team** | Saphire AOCS: Airport Operations Coordination System | Team roles (I075 Krishna, Anuvrat, Anay, Chaitanya) & system scale |
| **02** | **Domain & Vision** | Aerodrome Architecture & Real-World Bottlenecks | CSMIA Mumbai inspired 4-limb quad-runway masterplan (`AIRPORT_ASSETS.md`) |
| **03** | **Lab 1: Problem Definition** | System Scope & Operational Boundaries | Landside, Terminal, Airside, and Financial Clearance Boundaries |
| **04** | **Lab 1: Requirements & Stories** | Agile Epics, User Stories & Acceptance Criteria | 4 Core User Personas (AOCC Controller, DCS Agent, Dispatcher, Passenger) |
| **05** | **Lab 1: Non-Functional Specs** | Non-Functional Requirements (NFRs) & Performance | Sub-500ms latency, 99.9% uptime, 3NF compliance, Single-Session Security |
| **06** | **Lab 2: Process Models** | Agile Scrum Framework & Sprint Architecture | 5 Sprint Cycles (Architecture ➔ API ➔ UI ➔ RBAC Consoles ➔ Live DB Wiring) |
| **07** | **Lab 3: Use Case Model** | UML Use Case Diagram & System Boundaries | 10 Primary Actors, `<<include>>` and `<<extend>>` operational relationships |
| **08** | **Lab 3: Use Case Specs** | Core Use Case Specifications & Exception Flows | Flight Turnaround Dispatch & Baggage Reconciliation Use Case Tables |
| **09** | **Lab 4: Activity Flows** | UML Activity Diagram: Aircraft Turnaround Workflow | Parallel swimlanes: Refueling, Catering, Deboarding, Baggage Loading, Pushback |
| **10** | **Lab 4: Activity Flows** | UML Activity Diagram: Baggage Lifecycle & Screening | Check-in weighing ➔ 3D CT screening ➔ BHS sorting ➔ Apron loading ➔ Carousel |
| **11** | **Lab 5: Class Architecture** | UML Class Diagram & Domain Model (3NF) | JPA Domain entities, attributes, methods, multiplicities (`Lab 5 Class Diagram.png`) |
| **12** | **Lab 5: Design Patterns** | Software Engineering Design Patterns Applied | Repository Pattern (JPA), Strategy Pattern (Tariff Billing), JWT Interceptor |
| **13** | **Lab 6: Sequence Flows** | UML Sequence Diagram: Turnaround & Delay Escalation | Lifelines: AOCC Controller ➔ Service ➔ Repository ➔ DB ➔ Pushback Notification |
| **14** | **Lab 6: Sequence Flows** | UML Sequence Diagram: DCS Check-in to Boarding | Passenger lookup ➔ Seat map lock ➔ Tag issue ➔ Clearance verification |
| **15** | **Lab 7: Collaboration Model** | UML Collaboration / Communication Diagram | Object communication graph with numbered message passing (`Lab 7 SVG`) |
| **16** | **Lab 8: Data Flow Diagrams** | DFD Level 0 (Context) & DFD Level 1 Subsystems | 5 Subsystems: Flight Ops, Check-in, Baggage BHS, Airside Dispatch, Billing |
| **17** | **Database: Relational Schema** | PostgreSQL 18 Relational Architecture (41 Tables) | 47 FK edges, strict CHECK constraints, 158,660+ seed records, 20 Flyway migrations |
| **18** | **Database: Star Schema** | Analytics Data Warehouse & Star Schema | Fact Tables (`Fact_Turnaround`, `Fact_Baggage`) & Dimension Tables (`Dim_Time`, etc.) |
| **19** | **Tech Stack & Security** | Full-Stack Stack Integration & Session Security | React 19 + Spring Boot 3.2.5 + Postgres 18 + Single active session tracking |
| **20** | **Lab 9: Software Testing** | Test Suites, Boundary Value Analysis & Coverage | 109 Backend Unit/Integration Tests, Equivalence Partitioning, Postman API suites |
| **21** | **System Live Consoles** | Operational Consoles & Live Features | 16 Pages (Check-In Desk, AOCC, Airside Telemetry, Shift Handover Logbook, Exporters) |
| **22** | **Conclusion & Future Scope** | Summary, Project Impact & Future Roadmap | AI Turnaround Prediction, IoT Apron Tracking, DigiYatra Biometric Gates |

---

## 🎥 4. Video Demonstration Blueprint (5–6 Minutes Strict Cap — 4-Member Team Allocation)

### **Video Technical Requirements:**
1. **Duration**: 5:00 to 6:00 minutes maximum.
2. **Format**: Screen capture showing the live local application running on `http://localhost:3000` and `http://localhost:8080`.
3. **Presenter Overlay**: Visible webcam circle/box in corner (Loom / Google Meet style) with clear voice narration from all 4 team members.

---

### **🎬 Recommended Video Production Methods:**

#### 🌟 **Method 1: Live Group Google Meet / MS Teams Call (Fastest & Zero Editing — 10 Minutes Total)**
* **How it works**: All 4 team members join a private Google Meet or MS Teams meeting with cameras turned on.
* Krishna shares the browser screen (`http://localhost:3000`).
* Record the meeting. Each member speaks during their allocated 1 min 20 sec slot while Krishna drives the UI on screen.
* **Why it's great**: It perfectly matches what the CR instructed (*"jaise Meet pe hum karte hain na, waise"*), automatically generates the screen + webcam tiles layout, and requires zero video editing or stitching.

#### 🎥 **Method 2: Master Screen Recording + Webcam Picture-in-Picture Editing (Highest Visual Quality)**
* **How it works**: 
  1. Krishna records one smooth 5-minute screen recording of the application running through all features.
  2. Each of the 4 members records a 1-minute video of themselves speaking their script section on their phone/webcam.
  3. Drop the screen recording and the 4 webcam clips into CapCut, iMovie, or Clipchamp, overlaying the webcam bubble in the bottom corner.
* **Why it's great**: Guarantees zero UI lag or mistakes on screen and allows seamless re-takes.

---

### **🎙️ 4-Member Turn-by-Turn Video Script & Timing Breakdown:**

```
⏱️ 00:00 – 01:20 | MEMBER 1: Krishna Solanki (Database & System Integration Lead)
• Project Overview & Architecture: Introduce Saphire AOCS, the 4-member team, and problem domain.
• Tech Stack & Database Scale: 41 relational tables in 3NF, 158,660+ live records, Spring Boot 3.2.5, React 19.
• System Admin Console Demo: Showcase live KPI analytics, user account lifecycle, security audit log stream, and trigger live CSV/PDF/Excel report streaming (/api/reports/export/*).

⏱️ 01:20 – 02:35 | MEMBER 2: Anuvrat Tripathi (Frontend UI/UX Lead)
• Public Passenger Portal Walkthrough: Navigate Home Page (/), Concourse Bento, and Live 3D Flight Tracker (/tracker).
• Public Services & Helpdesk: Show Flight Schedule (/schedule), Lost & Found Claim Submission (/passenger-services), and Operational Support Inquiry Submission (/contact) querying the live database.

⏱️ 02:35 – 03:50 | MEMBER 3: Anay Modi (Backend API & Logic Lead)
• Departure Control System (DCS) Check-In Desk: Log in as Check-in Agent (/dashboard/check-in), perform passenger lookup by PNR, interactive cabin seat map selection, luggage weighing, and live IATA thermal boarding pass + bag tag generation.
• AOCC Flight Turnaround & Delay Engine: Log in as AOCC Controller (/dashboard/aocc), show turnaround task workflows, delay code logging (IATA delay codes), and automated gate allocation.

⏱️ 03:50 – 05:15 | MEMBER 4: Chaitanya Tikku (Documentation, UML & QA Testing Lead)
• Airside & Ground Logistics: Show Airside Ops (/dashboard/airside-ops) with wingspan conflict detection, runway telemetry/friction sweeps, and Logistics (/dashboard/logistics) carousel feeds.
• Airfield Shift Handover Logbook: Demonstrate the 8-hour Shift Handover Log (/api/shift-handover/*).
• Quality Assurance & SE Rigor: Highlight test coverage (109 backend unit tests, boundary value analysis, UML Labs 1–9 compliance).
• Conclusion & Sign-off: Final remarks and thanking the evaluation committee.
```

---

## 📅 5. Submission Checklist & Timeline

- **Target Internal Freeze**: **04 October 2026, 20:00 IST** (Buffers against portal overload)
- **Official Portal Deadline**: **05 October 2026, 23:59 IST**

### **Deliverables Checklist:**
- [x] **Relational Database**: 41 tables in PostgreSQL 18 with Flyway migrations (`V1` to `V20`).
- [x] **Backend API**: Spring Boot 3.2.5 REST services with JWT and role authorization.
- [x] **Frontend Web Application**: 16 dedicated pages/dashboards in React 19 + TypeScript.
- [ ] **PowerPoint Presentation (PPT)**: Structured 15-slide deck incorporating Labs 1 to 9.
- [ ] **Video Demonstration**: 5 to 6 minute recorded walkthrough with webcam overlay.
- [ ] **Documentation Suite**: SRS Document, ER/Relational Schemas, User Manual, Project Report.
