# AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
## Enterprise Database Architecture & Operational Coordination System

Welcome to the official repository for the **Airport Operations Coordination System (AOCS)**. This repository houses the complete database design, operational specifications, data warehouse matrices, and system architecture documents.

---

> [!IMPORTANT]
> ### 📢 TEAMMATE NAVIGATION GUIDE & RECOMMENDED VIEWING FORMAT
> For quick visualization and review, **teammates are strongly recommended to open the `.pdf` format files** located in [`documentation/PDF/`](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PDF). PDF files render vector graphics cleanly across all OS platforms without needing Draw.io installed.

---

## 📌 Project Overview & Operational Scope

The **Airport Operations Coordination System (AOCS)** coordinates real-time logistics, flight turnaround tasks, airside infrastructure, and passenger/cargo streams across **25 airport operational roles** (including Flight Dispatchers, Air Traffic Control Officers, Ground Handling Managers, Fuel Operations Specialists, and Security Auditors).

### Core Operational Domains:
* **Flight Dispatch & Airside Logistics**: Gate allocations, runway assignments, and flight status tracking.
* **Ground Turnaround Coordination**: Multi-department sub-task tracking (catering, cleaning, refuel, maintenance) with SLA elapsed time metrics.
* **Incident & Delay Analytics**: Identification of flight delay root causes and ground bottleneck sequences.
* **Logistics & Resource Tracking**: Fuel density transaction logs, cargo container manifests, and baggage carousels.
* **Passenger & Executive Services**: Traveler passenger logs, passport validation, and VIP executive lounge access.

---

## 🗺️ Master Asset Index & File Map

Each architectural stage provides 5 distinct asset formats to support editing, version control, web preview, and formal presentation:

| Architectural Stage | Stage Status | 📄 Recommended PDF (Best for Viewing) | 🎨 Vector SVG | 🖼️ Raster PNG | 📐 Draw.io Source | 💻 Draw.io XML | 📝 Technical Markdown Codex |
|---|:---:|---|---|---|---|---|---|
| **1. Peter Chen Conceptual ERD** | **Completed** | [ER Diagram.pdf](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PDF/ER%20Diagram.pdf) | [ER Diagram.svg](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/SVG/ER%20Diagram.svg) | [ER Diagram.png](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PNG/ER%20Diagram.png) | [AOCS ER Diagram.drawio](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/db/AOCS%20ER%20Diagram.drawio) | [AOCS ER Diagram.drawio.xml](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/db/AOCS%20ER%20Diagram.drawio.xml) | [chen_er_diagram_and_operational_flow.md](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/MD/database_creation/chen_er_diagram_and_operational_flow.md) |
| **2. Information Package Matrix** | **Completed** | [AOCS Information Package.pdf](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PDF/AOCS%20Information%20Package.pdf) | [AOCS Information Package.svg](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/SVG/AOCS%20Information%20Package.svg) | [AOCS Information Package.png](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/PNG/AOCS%20Information%20Package.png) | [AOCS Information Package.drawio](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/db/AOCS%20Information%20Package.drawio) | [AOCS Information Package.drawio.xml](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/db/AOCS%20Information%20Package.drawio.xml) | [information_package_matrix.md](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/MD/database_creation/information_package_matrix.md) |
| **3. Star Schema Dimensional Model** | *Next Phase* | *Queued* | *Queued* | *Queued* | *Queued* | *Queued* | [analytics_star_schema.md](file:///Users/krish/Desktop/Software%20Engineering/Mini%20Project/documentation/MD/database_creation/analytics_star_schema.md) |

---

## 📁 Repository Directory Structure

```
Mini Project/
├── README.md                              <-- Master Project Documentation & Navigation Index
├── flyway.conf                            <-- Flyway Migration Configuration
├── db/                                    <-- Database Diagrams & SQL Migrations
│   ├── AOCS ER Diagram.drawio             <-- Step 1 Draw.io Source
│   ├── AOCS ER Diagram.drawio.xml         <-- Step 1 Draw.io XML
│   ├── AOCS Information Package.drawio    <-- Step 2 Draw.io Source
│   ├── AOCS Information Package.drawio.xml<-- Step 2 Draw.io XML
│   └── migration/                         <-- Flyway SQL Migration Scripts (V1__Initial_Schema.sql)
│
└── documentation/                         <-- Comprehensive Documentation Hub
    ├── PDF/                               <-- PRIMARY VIEWING ASSETS (.pdf)
    │   ├── ER Diagram.pdf                 <-- Step 1 Visual PDF
    │   └── AOCS Information Package.pdf   <-- Step 2 Visual PDF
    ├── PNG/                               <-- Raster Image Assets (.png)
    ├── SVG/                               <-- Scalable Vector Graphics (.svg)
    └── MD/                                <-- Detailed Markdown Specifications
        ├── project_discussion/            <-- Brainstorming, Roles, Roadmap & Groupings
        │   ├── AOCS_Master_Handbook.md
        │   ├── project_vision.md
        │   ├── project_development_roadmap.md
        │   ├── roles.MD
        │   ├── team_assignments.md
        │   └── user_requirements_combined.md
        └── database_creation/             <-- Database Architecture Specifications
            ├── chen_er_diagram_and_operational_flow.md
            ├── ER_Diagram_Design.md
            ├── information_package_matrix.md
            └── analytics_star_schema.md
```

---

## 🛠️ Technology Stack & Database Infrastructure

* **Database Engine**: PostgreSQL 18
* **Schema Migration & Version Control**: Flyway CLI 13.0.0
* **Conceptual & Dimensional Modeling**: Draw.io / Diagrams.net (Peter Chen Standard ERD & Kimball Information Package Matrix)
* **Data Warehouse Method**: Kimball Bus Architecture (10 Conformed Dimensions)

---

## 🚀 Architectural Milestones Completed

### Step 1: Peter Chen ER Diagram (16 Normalized Operational Entities)
* Established 16 core entities connected via 17 relationship diamonds with 100% 90-degree orthogonal lines.
* Implemented total vs partial participation constraints using bold parallel double lines (`════`).
* Zero shape penetrations or overlapping cardinality labels.

### Step 2: Information Package Matrix (Data Warehouse Analytics)
* Designed a **10-Dimension Kimball Analytics Matrix** mapped directly from operational entities:
  `DIM_TIME`, `DIM_FLIGHT`, `DIM_AIRCRAFT`, `DIM_GATE`, `DIM_RUNWAY`, `DIM_USER`, `DIM_DEPARTMENT`, `DIM_ROLE`, `DIM_PASSENGER`, `DIM_LOGISTICS`.
* Constructed using Draw.io's native **List** container components with 100% monochrome professional formatting.

---
*Maintained by the Airport Operations Coordination System (AOCS) Engineering Team*
