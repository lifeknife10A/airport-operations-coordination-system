# 03: Four-Member Video Demonstration Walkthrough Script
**Project**: Saphire AOCS (Airport Operations Coordination System)  
**Total Target Time**: 5 Minutes 30 Seconds  
**Format**: 1080p Screen Recording of Live Software on `http://localhost:3000` + Voiceover / Webcam  

---

## Member Allocation Timeline

```
[0:00 - 1:20] Krishna Solanki (I075)  : Database Architecture, Flyway, 3NF Schema & Star Schema
[1:20 - 2:40] Chaitanya Tikku (I078)  : Software Engineering Lifecycle, UML Modeling & QA Testing
[2:40 - 4:00] Anuvrat Tripathi (I080) : React 19 Frontend, UI/UX Bento Design & Web Consoles
[4:00 - 5:20] Anay Modi (I088)        : Spring Boot 3 Backend, JWT RBAC Security & Dispatch Logic
[5:20 - 5:30] Group Conclusion        : Final Sign-Off and Academic Viva Readiness
```

---

## Segment 1: Krishna Solanki (I075) - Database & Integration Lead
* **Time Range**: `0:00 - 1:20` (80 seconds)
* **Screen Actions**:
  - `0:00 - 0:25`: Open Slide 1 (Team Roster) and transition to Slide 17 (`Figure 9 - Relational Schema`).
  - `0:25 - 0:55`: Switch to terminal, connect to PostgreSQL CLI (`psql -U postgres -d saphire_db`), run `\dt` showing all 41 tables, and query `SELECT COUNT(*) FROM flights;` showing live production seed data.
  - `0:55 - 1:20`: Show Slide 18 (`Figure 10 - Star Schema`) detailing `FACT_FLIGHT_TURNAROUND` and the 10 conformed dimensions.
* **Spoken Script**:
  > *"Hello esteemed faculty evaluators. I am Krishna Solanki (Roll Number I075), Database and System Integration Lead for Saphire AOCS.*
  > 
  > *Our backend relies on PostgreSQL 18, architected across 41 relational tables in strict Third Normal Form. To ensure automated reproducibility, our schema is bootstrapped via 20 versioned Flyway migrations populated with over 158,000 live operational records.*
  > 
  > *We separated our architecture into 6 core domains: Security, Airfield Infrastructure, Flight Operations, Airside Servicing, Baggage Lifecycle, and Commercial Billing. For analytical intelligence, we synthesized these operational tables into a Kimball-compliant Data Warehouse Star Schema centered on `FACT_FLIGHT_TURNAROUND` joined to 10 conformed dimensions. Now, Chaitanya will present our software engineering lifecycle and UML modeling."*

---

## Segment 2: Chaitanya Tikku (I078) - Documentation, UML & QA Lead
* **Time Range**: `1:20 - 2:40` (80 seconds)
* **Screen Actions**:
  - `1:20 - 1:45`: Display Slide 7 (10 Stakeholder Actors & Use Case Model) and Slide 9 (`Figure 4.2 - Aircraft Turnaround Activity Diagram` showing the parallel fork-join servicing swimlanes).
  - `1:45 - 2:10`: Display Slide 11 (`Figure 5 - Class Diagram`) and Slide 13 (`Figure 6 - Sequence Diagram`).
  - `2:10 - 2:40`: Open terminal and execute `./mvnw test`, showing 109 automated unit and integration tests executing and passing with zero failures.
* **Spoken Script**:
  > *"I am Chaitanya Tikku (Roll Number I078), Documentation, UML, and QA Testing Lead.*
  > 
  > *Across Labs 1 through 9, we developed formal engineering artifacts. In Lab 3, we defined 10 stakeholder actors and operational stereotypes. In Lab 4, we modeled the aircraft turnaround critical path using UML Activity Diagrams with parallel fork-join synchronization across cabin cleaning, refueling, catering, and baggage servicing.*
  > 
  > *In Lab 5, our UML Class Diagram mapped directly to JPA entities. In Lab 6, our Sequence Diagrams modeled atomic transactions during check-in.*
  > 
  > *For Lab 9 verification, I engineered a test suite of 109 automated unit and integration tests executing Equivalence Partitioning and Boundary Value Analysis on gate wingspan thresholds and session security. I will now hand over to Anuvrat for the frontend demonstration."*

---

## Segment 3: Anuvrat Tripathi (I080) - Frontend UI/UX Lead
* **Time Range**: `2:40 - 4:00` (80 seconds)
* **Screen Actions**:
  - `2:40 - 3:05`: Open browser at `http://localhost:3000` on the Public Passenger Home Portal. Show the live telemetry bento grid, interactive 3D aircraft, and live flight tracker map.
  - `3:05 - 3:35`: Navigate to `/dashboard/check-in` (Departure Control Console). Search for PNR `6E-8841`, interactively select a seat on the dynamic aircraft cabin map, enter baggage weight 18.5kg, and click 'Issue Boarding Pass' to generate the thermal ticket with PDF417 barcode.
  - `3:35 - 4:00`: Navigate to `/dashboard/logistics` showing live baggage reclaim carousels and scan timeline.
* **Spoken Script**:
  > *"I am Anuvrat Tripathi (Roll Number I080), Frontend UI/UX Lead.*
  > 
  > *Our frontend is built using React 19, TypeScript, Vite, and Tailwind CSS with Material UI design tokens. We designed 16 dedicated web consoles with zero static UI mockups.*
  > 
  > *Our public portal features a real-time interactive flight tracker, timetable, and lost-and-found custody claims. On our staff side, our Departure Control Console enables check-in agents to search bookings by PNR, lock seats on a dynamic cabin grid, and instantly generate IATA-standard boarding passes with PDF417 barcodes and 10-digit bag tags.*
  > 
  > *Every button triggers live REST API calls with JWT interceptors. I now hand over to Anay for backend services and operational dispatch."*

---

## Segment 4: Anay Modi (I088) - Backend API & Logic Lead
* **Time Range**: `4:00 - 5:20` (80 seconds)
* **Screen Actions**:
  - `4:00 - 4:25`: Open `/dashboard/aocc` showing active flight turnaround Gantt bars, delay tags, and IATA delay code dropdown.
  - `4:25 - 4:55`: Navigate to `/dashboard/airside-ops` demonstrating wingspan compatibility check (e.g. attempting to assign an A380 to a narrowbody gate and seeing the conflict banner).
  - `4:55 - 5:20`: Show Slide 22 (Conclusion & Innovations) and deliver closing remarks.
* **Spoken Script**:
  > *"I am Anay Modi (Roll Number I088), Backend API and Logic Lead.*
  > 
  > *Our backend is powered by Java 17 and Spring Boot 3.2.5 across 18 RESTful controllers. We implemented Spring Security 6 with stateless JWT authentication and strict server-side session governance in the `auth_sessions` table.*
  > 
  > *Our AOCC Operations Console monitors live turnaround Gantt progress in real time, calculating estimated off-block times and linking duration variances to standardized IATA delay codes.*
  > 
  > *Furthermore, our airside engine validates aircraft wingspans and maximum takeoff weights against gate physical rules, rejecting incompatible assignments with HTTP 409 Conflict status.*
  > 
  > *In conclusion, Saphire AOCS delivers an enterprise-grade full-stack platform satisfying 100% of semester requirements. Thank you!"*

---

## Segment 5: Group Sign-Off (5:20 - 5:30)
* All 4 members on camera/audio thanking the evaluators and stating readiness for viva questions.
