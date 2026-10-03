# 05: AI Prompts & Second-Opinion Audit Package
**Project**: Saphire AOCS (Airport Operations Coordination System)  
**Authors**: Krishna Solanki (I075), Chaitanya Tikku (I078), Anuvrat Tripathi (I080), Anay Modi (I088)  

---

## 1. Google NotebookLM Video Overview Custom Topic Prompt

Copy and paste this into the **Custom topic** field when creating a **Video Overview** (Explainer / Cinematic) in Google NotebookLM:

```text
Create a structured, high-impact technical explainer video for the Graduate Capstone Project "Saphire AOCS" (Airport Operations Coordination System) developed by Krishna Solanki (I075), Chaitanya Tikku (I078), Anuvrat Tripathi (I080), and Anay Modi (I088).

Structure the video narration and visuals into 5 clear chronological segments:

1. Operational Scope & Problem Formulation:
Explain how modern mega-airports suffer from disconnected legacy silos. Introduce Saphire AOCS as an integrated Airport Collaborative Decision Making (A-CDM) platform unifying landside check-in, airside turnaround, security screening, and commercial billing.

2. Software Engineering & UML Modeling (Labs 1 to 8):
Walk through the formal engineering lifecycle: 10 stakeholder use cases, UML Activity Diagrams with parallel fork-join turnaround synchronization (cleaning, refueling, catering, baggage), Spring Data JPA Class Diagrams, atomic DCS Sequence Diagrams, and DFD Level 0/1 subsystem data flows.

3. Database Architecture & Data Warehousing (Lab 9):
Highlight the production PostgreSQL 18 relational core featuring 41 normalized tables in strict 3NF across 6 operational domains, managed via 20 versioned Flyway migrations with 158,660+ live seed records. Contrast this with the OLAP Star Schema centered on FACT_FLIGHT_TURNAROUND with 10 conformed dimensions for real-time KPI analytics.

4. Full-Stack Implementation & 16 Dedicated Web Consoles:
Present the modern tech stack (Spring Boot 3.2.5 on Java 17 + React 19 with TypeScript and Tailwind/MUI). Highlight the 7 public passenger pages (Live Flight Tracker, Timetable, Baggage Claims) and 9 role-based operational staff consoles (DCS Check-in with PDF417 boarding passes, AOCC Turnaround Gantt tracker with IATA delay codes, and automated wingspan-vs-gate conflict validation).

5. Quality Assurance & Engineering Verification:
Conclude with the 109 automated JUnit 5 and Mockito backend unit/integration tests enforcing Equivalence Partitioning, Boundary Value Analysis, and single active session security (auth_sessions) with zero static mock data.
```

---

## 2. External AI Auditor / Second-Opinion Review Prompt

Use this prompt with any external Large Language Model (e.g. Claude Opus, ChatGPT, Gemini Pro) to audit your submission completeness:

```text
You are an expert university professor and external accreditation evaluator conducting a final audit on a Capstone Software Engineering project submission named "Saphire AOCS (Airport Operations Coordination System)".

Evaluate our project artifacts against university grading rubrics:

1. Team Roster & Attribution:
- Krishna Solanki (I075): Database & System Integration Lead (PostgreSQL 18, 41 Tables in 3NF, 20 Flyway Migrations, 158k+ Seed Records, Star Schema).
- Chaitanya Tikku (I078): Documentation, UML & QA Testing Lead (Use Case, Activity, Class, Sequence, Collaboration, DFDs, 109 JUnit Tests).
- Anuvrat Tripathi (I080): Frontend UI/UX Lead (React 19, TypeScript, Material UI, Bento Design, 16 Web Consoles).
- Anay Modi (I088): Backend API & Logic Lead (Java 17, Spring Boot 3.2.5, JWT Security, 18 REST Controllers, Dispatch Engine).

2. Slide Deck Verification:
- Exact 22 slides formatted in 16:9 widescreen with academic theme and zero emojis.
- Full coverage of Labs 1 to 9 (Agile Scrum, Use Case Specs, Turnaround Activity with Fork/Join, Class Diagram, Sequence Lifelines, DFD Context/Decomposition, 41-table 3NF Database, Star Schema OLAP, 109 QA Tests, 16 Consoles).

3. Technical Rigor:
- Clear architectural distinction between OLTP (41 normalized tables) and OLAP (Star Schema with 10 conformed dimensions).
- Verification of automated testing (Boundary Value Analysis, Equivalence Partitioning).
- Live software integration with zero mock data.

Please provide an objective audit report:
- Score out of 100 based on standard SE Capstone evaluation rubrics.
- Identify potential viva trap questions the external examiner might ask.
- Confirm if all technical deliverables are complete and aligned.
```
