# AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
## Master Enterprise 140-Table Architecture & Federated AODB Blueprint

---

### Executive Architectural Directive & Strategy

#### **Is it worth building 140 tables in code?**
* **NO for Code Execution**: Building 140 tables in Java/Spring Boot and React UI within a semester project will cause massive complexity bottlenecks.
* **YES for Documentation & Strategy**: Documenting the complete 140-table enterprise blueprint alongside our **21-Table Executable Core Engine** gives the team the ultimate architectural authority.

This document serves as the **140-Table Enterprise Master Specification**, designed for ingestion by LLMs (ChatGPT, Claude, Codex, Antigravity) so teammates (**Krishna, Anay, Anuvrat, Chaitanya**) can cross-question any aviation domain.

---

## SECTION 1: THE 16 OPERATIONAL DOMAINS & 140 TABLE BREAKDOWN

### Domain 1: AODB Core & Flight Movements (12 Tables)
1. `FLIGHTS` (Core schedule & movement)
2. `FLIGHT_LEGS` (Multi-stop route segments)
3. `FLIGHT_SCHEDULES_SEASONAL` (IATA Slot coordination)
4. `AIRCRAFT` (Airframe registry)
5. `AIRCRAFT_TYPES` (ICAO widebody/narrowbody specs)
6. `AIRLINES` (Carrier codes & IATA/ICAO prefixes)
7. `AIRPORTS` (Global airport master directory)
8. `RUNWAYS` (Airside strip assignments)
9. `TAXIWAYS` (Taxi routing nodes)
10. `FLIGHT_STATUS_HISTORY` (Audit of status state changes)
11. `FLIGHT_DIVERSIONS` (Alternate airport diversion logs)
12. `CODE_SHARE_FLIGHTS` (Marketing vs operating airline mappings)

### Domain 2: Resource Management System (RMS) (14 Tables)
13. `GATES` (Terminal gate inventory)
14. `STANDS` (Apron aircraft parking positions)
15. `RON_PARKING` (Remain Overnight aircraft positions)
16. `CHECKIN_COUNTERS` (Terminal ticket counter blocks)
17. `BAGGAGE_BELTS` (Arrival baggage claim carousels)
18. `BAGGAGE_LATERALS` (Departure baggage sorting spurs)
19. `AIRSIDE_BUSES` (Apron passenger shuttle buses)
20. `RESOURCE_ALLOCATIONS` (Time-blocked resource reservations)
21. `RESOURCE_CONSTRAINTS` (Aircraft size vs gate max wingspan rules)
22. `RESOURCE_CONFLICTS` (Overbooking & SLA alert logs)
23. `RESOURCE_MAINTENANCE` (Out-of-service gate logs)
24. `TERMINAL_ZONES` (Concourses T1, T2, T3)
25. `RESOURCE_EQUIPMENT_RULES` (GPU/PCA bridge requirements)
26. `RESOURCE_COST_RATES` (Hourly gate usage pricing)

### Domain 3: Ground Handling & A-CDM Turnaround (15 Tables)
27. `TASKS` (Turnaround sub-task SLA workflows)
28. `TASK_TEMPLATES` (Standard turnaround task checklists)
29. `DELAY_LOGS` (IATA delay reason codes 00-99)
30. `FUEL_LOGS` (Jet A-1 fueling transactions)
31. `FUEL_DENSITY_CHECKS` (Quality assurance lab density tests)
32. `CARGO_MANIFESTS` (Unit Load Device ULD freight manifests)
33. `GROUND_EQUIPMENT` (Tugs, belt loaders, GPUs, de-icing rigs)
34. `EQUIPMENT_ASSIGNMENTS` (Vehicle to flight task allocations)
35. `CABIN_CLEANING_LOGS` (Sanitation SLA sign-offs)
36. `CATERING_ORDERS` (Galley food & beverage loading logs)
37. `DE_ICING_OPERATIONS` (Winter fluid application logs)
38. `WATER_WASTE_SERVICE_LOGS` (Potable water & lavatory service)
39. `APRON_VEHICLE_POSITION_GPS` (Real-time telemetry vehicle tracking)
40. `GROUND_HANDLER_CONTRACTS` (SLA agreements with third-party handlers)
41. `TURNAROUND_MILESTONES` (Target Off-Block Time TOBT, Actual In-Block Time AIBT)

### Domain 4: Departure Control System (DCS) & Passenger Processing (12 Tables)
42. `PASSENGERS` (Traveler PNR profiles)
43. `BOARDING_PASSES` (Barcoded Boarding Pass BBP records)
44. `SEAT_MAPS` (Aircraft cabin seating configurations)
45. `SEAT_ASSIGNMENTS` (Passenger seat reservations)
46. `SPECIAL_ASSISTANCE_PRM` (Passengers with Reduced Mobility requests)
47. `UNACCOMPANIED_MINORS` (UM child tracking logs)
48. `MEAL_PREFERENCES` (Special dietary requests)
49. `FREQUENT_FLYER_PROGRAMS` (Loyalty tier records)
50. `UPGRADE_LISTS` (Standby & class upgrade queues)
51. `STANDBY_PASSENGERS` (Waitlisted passenger queues)
52. `NO_SHOW_PASSENGERS` (Gate no-show logs)
53. `BAGGAGE_ALLOWANCES` (Weight & piece quota rules)

### Domain 5: Baggage Reconciliation System (BRS) (8 Tables)
54. `BAG_TAGS` (10-digit IATA barcode bag tags)
55. `BAGGAGE_SCAN_EVENTS` (Bag tag barcode scan history)
56. `BAGGAGE_CONTAINERS` (ULD container loading manifests)
57. `MISHANDLED_BAGGAGE` (Lost/Delayed bag reports)
58. `BAGGAGE_CLAIM_LOGS` (Passenger luggage retrieval logs)
59. `BAGGAGE_SECURITY_SCREENING` (HBS x-ray security screening level 1-5)
60. `RUSH_BAGGAGE` (Expedited transfer baggage logs)
61. `BAGGAGE_REROUTING_LOGS` (Misconnected flight re-bagging logs)

### Domain 6: Security, E-Gates & Border Control (10 Tables)
62. `SECURITY_CHECKPOINTS` (Terminal E-gates & scanners)
63. `PASSENGER_CLEARANCE_LOGS` (E-gate barcode & biometric scans)
64. `IMMIGRATION_RECORDS` (Passport stamps, visa checks & border clearance)
65. `SECURITY_INCIDENTS` (Prohibited item & security breach logs)
66. `STAFF_BADGES` (Airside Security Identification Cards ASIC)
67. `BIOMETRIC_TEMPLATES` (Encrypted facial recognition hashes)
68. `WATCHLIST_SCREENING` (Interpol & security blacklist cross-checks)
69. `CCTV_CAMERA_REGISTRY` (Terminal camera node inventory)
70. `ACCESS_CONTROL_DOORS` (Airside door keycard access logs)
71. `SECURITY_THREAT_LEVELS` (Airport threat level posture)

### Domain 7: Aeronautical & Commercial Billing (10 Tables)
72. `AIRLINE_CONTRACTS` (Master aeronautical fee agreements)
73. `LANDING_FEE_TARIFTS` (Weight-based MTOW landing pricing)
74. `PARKING_FEE_TARIFFS` (Stand parking duration pricing)
75. `PASSENGER_SERVICE_CHARGES` (PSCF terminal departure taxes)
76. `INVOICES` (Billed statements to airlines)
77. `INVOICE_LINE_ITEMS` (Detailed charges for refueling, GPU, gates)
78. `PAYMENTS` (Accounts receivable payment transactions)
79. `CREDIT_MEMOS` (Fee adjustments & SLA dispute credits)
80. `CONCESSION_LEASES` (Duty-free & retail store leases)
81. `RETAIL_REVENUE_ROYALTIES` (Percentage sales royalty logs)

### Domain 8: Commercial Retail & Passenger Amenities (8 Tables)
82. `CONCESSION_STORES` (Duty-free, dining & retail registry)
83. `LOUNGE_VISITS` (Executive VIP lounge entry logs)
84. `LOUNGE_PARTNERSHIPS` (Airline lounge access contracts)
85. `WIFI_USAGE_LOGS` (Passenger airport Wi-Fi authentication)
86. `DUTY_FREE_PURCHASES` (Export-validated duty-free sales)
87. `LOST_AND_FOUND` (Unclaimed item registry)
88. `PARKING_LOT_TRANSACTIONS` (Public long-term parking billing)
89. `PASSENGER_FEEDBACK_KIOSKS` (Smiley terminal satisfaction ratings)

### Domain 9: HR, Staff Rostering & Certification (10 Tables)
90. `USERS` (Staff login accounts)
91. `ROLES` (RBAC security roles)
92. `USER_PHONE_NUMBERS` (Staff phone directory)
93. `EMPLOYEE_PROFILES` (HR master records)
94. `STAFF_ROSTERS` (Shift planning & calendar assignments)
95. `SHIFT_ATTENDANCE` (Clock-in / clock-out biometric logs)
96. `AIRSIDE_DRIVING_PERMITS` (ADP vehicle license certifications)
97. `TRAINING_CERTIFICATIONS` (Dangerous Goods & Ramp safety certs)
98. `STAFF_QUALIFICATIONS` (Aircraft type rating capabilities)
99. `OVERTIME_LOGS` (Shift overtime payroll logs)

### Domain 10: Airside, Runway & ATC Coordination (10 Tables)
100. `NOTAMS` (Notice to Airmen navigational alerts)
101. `WEATHER_REPORTS` (METAR / TAF weather observations)
102. `RUNWAY_INSPECTIONS` (FOD Foreign Object Debris inspection logs)
103. `BIRD_STRIKE_LOGS` (Wildlife hazard tracking)
104. `NOISE_MONITORING_SENSORS` (Decibel sensor log stations)
105. `AIRFIELD_LIGHTING_STATUS` (CAT III runway lighting health)
106. `SNOW_REMOVAL_OPERATIONS` (Airside plow & de-icer route tracking)
107. `EMERGENCY_RESPONSE_LOGS` (Airport Fire & Rescue ARFF dispatch)
108. `APRON_INCIDENT_REPORTS` (Aircraft wingtip collision reports)
109. `AIRSPACE_SLOTS` (EUROCONTROL / FAA flow control slots)

### Domain 11: Fuel Farm & Supply Chain (6 Tables)
110. `FUEL_STORAGE_TANKS` (Main Jet A-1 fuel depot tanks)
111. `FUEL_SUPPLIER_DELIVERIES` (Refinery fuel truck/pipeline receipts)
112. `FUEL_HYDRANT_SYSTEM` (Underground apron fuel pit nodes)
113. `FUEL_BOWSERS` (Mobile refueling tanker trucks)
114. `FUEL_DISPENSE_TRANSACTIONS` (Uplift liters & density records)
115. `FUEL_RECONCILIATION_DAILY` (End-of-day fuel balance audit)

### Domain 12: Facilities, MRO & Asset Management (10 Tables)
116. `FACILITY_ASSETS` (Passenger boarding bridges, escalators, HVAC)
117. `MAINTENANCE_WORK_ORDERS` (Building repair work orders)
118. `PREVENTIVE_MAINTENANCE_SCHEDULES` (Scheduled asset servicing)
119. `HANGAR_RESERVATIONS` (Heavy maintenance hangar bookings)
120. `SPARE_PARTS_INVENTORY` (MRO equipment parts stock)
121. `CONTRACTOR_PERMITS` (Third-party maintenance vendor passes)
122. `ENERGY_CONSUMPTION_LOGS` (Terminal power & HVAC meter readings)
123. `JANITORIAL_LOGS` (Restroom & concourse cleaning logs)
124. `WASTE_MANAGEMENT_LOGS` (International catering waste disposal)
125. `ASSET_DEPRECIATION` (Financial asset life cycle records)

### Domain 13: Messaging, Middleware & Auditing (8 Tables)
126. `NOTIFICATIONS` (Staff alerts & FIDS broadcasts)
127. `AUDIT_LOGS` (Immutable legal compliance security trail)
128. `TYPE_B_MESSAGES` (IATA SITA Type B telegraphic messages: LDP, MVT, PDM)
129. `API_INTEGRATION_LOGS` (REST / SOAP external airline webhooks)
130. `SYSTEM_EVENT_QUEUE` (Kafka / RabbitMQ operational event bus)
131. `DATA_SYNC_ERRORS` (Inter-system sync failure retry queue)
132. `USER_SESSIONS` (Active JWT authentication tokens)
133. `FEATURE_FLAGS` (System dynamic configuration flags)

### Domain 14: Analytics, BI & Data Warehouse (7 Tables)
134. `FACT_FLIGHT_TURNAROUND` (Star schema central turnaround fact)
135. `FACT_PASSENGER_CLEARANCE` (Star schema checkpoint throughput fact)
136. `FACT_RESOURCE_UTILIZATION` (Star schema gate occupancy fact)
137. `DIM_TIME` (Date/Time dimension)
138. `DIM_AIRLINE` (Carrier dimension)
139. `DIM_AIRPORT` (Airport origin/destination dimension)
140. `DIM_DELAY_REASON` (IATA delay classification dimension)

---

## SECTION 2: THE COMPLETE END-TO-END 140-TABLE OPERATIONAL EVENT FLOW

```
[AIRLINE SCHEDULE PUBLISHED] ➔ Seasonal Slots (`FLIGHT_SCHEDULES_SEASONAL`)
          │
          ▼
[A-CDM FLIGHT CREATED] ➔ Flight record generated (`FLIGHTS`, `AIRLINES`, `AIRCRAFT`)
          │
          ▼
[RMS ALLOCATION] ➔ Gate, Stand & Carousel assigned (`RESOURCE_ALLOCATIONS`, `GATES`, `STANDS`)
          │
          ▼
[PASSENGER CHECK-IN] ➔ PNR loaded, Seat assigned, Boarding Pass & Bag Tag printed (`BOARDING_PASSES`, `BAG_TAGS`)
          │
          ▼
[TERMINAL E-GATE ENTRY] ➔ Scanner verifies barcode (`SECURITY_CHECKPOINTS`, `PASSENGER_CLEARANCE_LOGS`)
          │
          ▼
[SECURITY SCREENING] ➔ Level 1-5 HBS X-Ray scan (`BAGGAGE_SECURITY_SCREENING`, `SECURITY_INCIDENTS`)
          │
          ▼
[IMMIGRATION BORDER CONTROL] ➔ Biometric facial match & visa stamp (`IMMIGRATION_RECORDS`)
          │
          ▼
[VIP LOUNGE ACCESS] ➔ Executive lounge scan (`LOUNGE_VISITS`)
          │
          ▼
[GATE BOARDING SCAN] ➔ Passenger boarded (`PASSENGER_CLEARANCE_LOGS`)
          │
          ▼
[A-CDM GROUND TURNAROUND] ➔ Cabin cleaned (`CABIN_CLEANING_LOGS`), Refueled (`FUEL_LOGS`, `FUEL_STORAGE_TANKS`), Cargo loaded (`CARGO_MANIFESTS`, `BAGGAGE_CONTAINERS`)
          │
          ▼
[AIRSIDE CLEARANCE] ➔ Runway assigned (`RUNWAYS`, `TAXIWAYS`, `NOTAMS`), Off-block recorded (`TURNAROUND_MILESTONES`)
          │
          ▼
[TAKE-OFF / AIRBORNE] ➔ Status updated to AIRBORNE on FIDS Displays (`FLIGHT_STATUS_HISTORY`, `NOTIFICATIONS`)
          │
          ▼
[AERONAUTICAL BILLING] ➔ Landing fee, Parking tariff & Refueling invoice generated (`INVOICES`, `INVOICE_LINE_ITEMS`)
          │
          ▼
[DATA WAREHOUSE BI ETL] ➔ Fact tables updated for delay & SLA analytics (`FACT_FLIGHT_TURNAROUND`, `FACT_PASSENGER_CLEARANCE`)
```

---

## SECTION 3: HOW OUR 21-TABLE EXECUTABLE CORE ENGINE MAPS INTO THE 140-TABLE BLUEPRINT

Our **21-Table Executable Core** (`V1__initial_schema.sql` + `V2__seed_data.sql` with 2,700+ rows) extracts the **essential operational backbone** from this 140-table architecture:

| 140-Table Enterprise Domain | 21-Table Executable Core Mapping |
|---|---|
| **Domain 1: AODB Flight Core** | ➔ `FLIGHTS`, `AIRCRAFT`, `RUNWAYS` |
| **Domain 2: Resource Allocation RMS** | ➔ `GATES`, `DEPARTMENTS`, `BAGGAGE_CAROUSELS` |
| **Domain 3: Ground Handling A-CDM** | ➔ `TASKS`, `DELAY_LOGS`, `FUEL_LOGS`, `CARGO_MANIFESTS` |
| **Domain 4: Departure Control DCS** | ➔ `PASSENGERS`, `BOARDING_PASSES`, `LOUNGE_VISITS` |
| **Domain 5 & 6: Security & Immigration** | ➔ `SECURITY_CHECKPOINTS`, `PASSENGER_CLEARANCE_LOGS`, `IMMIGRATION_RECORDS` |
| **Domain 9: Identity & Access IAM** | ➔ `USERS`, `ROLES`, `USER_PHONE_NUMBERS` |
| **Domain 13: Audit & Messaging** | ➔ `NOTIFICATIONS`, `AUDIT_LOGS` |

---
*Author: Antigravity Agent (Google Deepmind) | Project: Airport Operations Coordination System (AOCS)*
