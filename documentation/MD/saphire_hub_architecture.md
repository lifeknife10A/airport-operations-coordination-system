# Saphire International Airport (SPH) — Hub Architecture Specification

**Project:** Saphire Airport Operations Coordination System (AOCS)  
**Document Version:** 1.0  
**Date:** 2026-07-28  

---

## 1. Naming & Identifier Standards

To give the project a distinct aesthetic identity while adhering to aviation standards, our home airport hub is officially designated as:

* **Airport Name**: **Saphire International Airport** *(Spelled with a single 'P' for aesthetic design choice)*
* **IATA 3-Letter Code**: **`SPH`**
* **ICAO 4-Letter Code**: **`VASP`**
* **City / Location**: Saphire City, India
* **Timezone**: `Asia/Kolkata` (`UTC+05:30`)
* **Primary Database ID**: `airport_id = 1` in the `airports` table.

---

## 2. The Saphire Hub Principle (Flight Route Constraint)

### Core Operational Rule:
As an internal **Airport Operations Coordination System (AOCS)** specifically for **Saphire International Airport (`SPH`)**, our system only tracks and manages aircraft that physically arrive at or depart from Saphire International Airport. 

Our ground teams, gate managers, refueling crews, and supervisors do **not** manage external flight routes (e.g., a flight traveling from Mumbai `BOM` to Delhi `DEL` has no impact on Saphire Airport's gates or ramp resources).

```mermaid
graph TD
    subgraph Managed by Saphire AOCS
        A[External Airport e.g. BOM, DEL, DXB, LHR] -->|Inbound Arrival| SPH[Saphire International Airport - SPH]
        SPH -->|Outbound Departure| B[External Airport e.g. BOM, DEL, DXB, JFK]
    }
    
    subgraph Excluded from Saphire AOCS
        C[Mumbai - BOM] -.-|Unmanaged Third-Party Route| D[Delhi - DEL]
    }
```

---

## 3. Database Constraints & Enforcement

### 3.1 PostgreSQL Check Constraint
In `db/migration/V1__initial_schema.sql`, the `flights` table enforces this operational constraint at the database layer:

```sql
CONSTRAINT chk_saphire_hub CHECK (
    origin_airport_id = 1 OR destination_airport_id = 1
);
```

### 3.2 Route Categorization

1. **Inbound Flights (Arrivals)**:
   * `origin_airport_id`: Any valid external airport (e.g., `BOM`, `DEL`, `BLR`, `DXB`, `LHR`, `JFK`).
   * `destination_airport_id`: `1` (`SPH` - Saphire International Airport).
   * `flight_type`: `'ARRIVAL'`

2. **Outbound Flights (Departures)**:
   * `origin_airport_id`: `1` (`SPH` - Saphire International Airport).
   * `destination_airport_id`: Any valid external airport (e.g., `BOM`, `DEL`, `BLR`, `DXB`, `LHR`, `JFK`).
   * `flight_type`: `'DEPARTURE'`

---

## 4. Impact on Application Components

* **Dashboard & Flight Schedule**: All live flight grids display either `Origin ➔ SPH` or `SPH ➔ Destination`.
* **Gate & Stand Allocation**: Gate assignment logic only triggers for flights parking at `SPH` gates (`gate_id`).
* **Turnaround Workflow**: Turnaround tasks (Cabin Cleaning, Refueling, Maintenance Inspection, Catering, Boarding) are linked strictly to aircraft positioned at Saphire International Airport.
