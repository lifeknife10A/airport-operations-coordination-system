# Information Package Diagram Specification

**Subject Area:** Aircraft Turnaround Performance & Operations Analytics  
**System:** Airport Operations Coordination System (AOCS)  

---

## 1. Information Package Overview

An **Information Package Diagram** defines the data warehousing requirements by mapping key operational **Facts (Measures)** against **Dimensions** and their organizational **Hierarchies**. This matrix guides executive reporting for AOCC Directors and Airport Management.

---

## 2. Information Package Matrix

| Dimension 1: Time | Dimension 2: Flight & Airline | Dimension 3: Stand & Gate | Dimension 4: Aircraft Fleet | Dimension 5: Department & Role | Dimension 6: Delay Category |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Year** | Airline Category | Terminal | Aircraft Type | Division | Primary Delay Class |
| **Quarter** | Airline Name | Gate Zone | Manufacturer | Department Name | Reason Category |
| **Month** | Flight Type (Dom/Intl) | Stand Code | Aircraft Model | Role Title | Delay Sub-Code |
| **Date / Day of Week**| Flight Number | Max Size Rating | Registration Tail # | Staff User ID | Specific Reason Detail |
| **Hour / Shift Window**| Origin / Destination | Status | Seat Capacity | Shift Assignment | Log Sequence # |

### Facts & Performance Measures (Grain: Single Flight Turnaround Leg)
1. **Planned Turnaround Duration** (Minutes)
2. **Actual Turnaround Duration** (Minutes)
3. **Turnaround Variance** (`Actual - Planned` in Minutes)
4. **Total Delay Duration** (Minutes)
5. **Fuel Volume Pumped** (Liters) & **Net Weight** (kg)
6. **Commercial Cargo Load** (Total kg)
7. **Passenger Count** (Boarded vs Checked-In Ratio %)
8. **Task SLA Compliance Rate** (% of Turnaround Tasks Completed On-Time)

---

## 3. Business Questions Answered by this Package
* Which airline experiences the highest average turnaround delay at Terminal 2 gates?
* What percentage of delays are attributed to Refueling vs Cabin Cleaning during peak evening hours (18:00–22:00)?
* How does aircraft size (Wide-body vs Narrow-body) impact actual task completion times across departments?
