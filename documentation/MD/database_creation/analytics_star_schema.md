# Analytics Star Schema Architecture

**System:** Saphire Airport Operations Coordination System (AOCS) (AOCS) Data Warehouse  
**Model Type:** Star Schema (1 Central Fact Table + 6 Dimension Tables)  

---

## 1. Dimensional Architecture Diagram

```mermaid
erDiagram
    DIM_TIME {
        bigint time_key PK
        date full_date
        integer year
        integer quarter
        integer month
        varchar month_name
        integer day_of_week
        varchar day_name
        integer hour
    }
    DIM_FLIGHT {
        bigint flight_key PK
        varchar flight_number
        varchar airline_name
        varchar origin_iata
        varchar destination_iata
        varchar flight_type
    }
    DIM_AIRCRAFT {
        bigint aircraft_key PK
        varchar registration_number
        varchar model
        varchar manufacturer
        integer passenger_capacity
    }
    DIM_GATE {
        bigint gate_key PK
        varchar gate_number
        varchar terminal
        varchar max_aircraft_size
    }
    DIM_DELAY_REASON {
        bigint reason_key PK
        varchar reason_category
        varchar description
    }
    DIM_DEPARTMENT {
        bigint department_key PK
        varchar department_name
    }

    FACT_TURNAROUND_PERFORMANCE {
        bigint fact_id PK
        bigint time_key FK
        bigint flight_key FK
        bigint aircraft_key FK
        bigint gate_key FK
        bigint reason_key FK
        bigint department_key FK
        integer planned_turnaround_minutes
        integer actual_turnaround_minutes
        integer total_delay_minutes
        decimal fuel_liters_pumped
        decimal cargo_weight_kg
        integer onboard_passenger_count
    }

    DIM_TIME ||--o{ FACT_TURNAROUND_PERFORMANCE : "aggregates"
    DIM_FLIGHT ||--o{ FACT_TURNAROUND_PERFORMANCE : "measures"
    DIM_AIRCRAFT ||--o{ FACT_TURNAROUND_PERFORMANCE : "classifies"
    DIM_GATE ||--o{ FACT_TURNAROUND_PERFORMANCE : "locates"
    DIM_DELAY_REASON ||--o{ FACT_TURNAROUND_PERFORMANCE : "categorizes"
    DIM_DEPARTMENT ||--o{ FACT_TURNAROUND_PERFORMANCE : "evaluates"
```

---

## 2. Fact & Dimension Table Definitions

### 2.1 Central Fact Table: `FACT_TURNAROUND_PERFORMANCE`
* **Grain:** One row per completed aircraft turnaround flight leg.
* **Foreign Keys:** `time_key`, `flight_key`, `aircraft_key`, `gate_key`, `reason_key`, `department_key`.
* **Additive Measures:**
  * `planned_turnaround_minutes`: Baseline scheduled turnaround window.
  * `actual_turnaround_minutes`: Realized ground time from On-Block to Pushback.
  * `total_delay_minutes`: Cumulative delay across all tasks.
  * `fuel_liters_pumped`: Volume of fuel loaded.
  * `cargo_weight_kg`: Weight of commercial cargo loaded.
  * `onboard_passenger_count`: Total boarded passengers.

---

## 3. Why Star Schema Over Snowflake Schema?

1. **Query Performance**: Star schema denormalizes dimensions, eliminating multi-level joins when aggregating large analytical queries for executive dashboards.
2. **Simplicity for BI Tools**: Directly integrates into visualization platforms (PowerBI, Tableau, Superset) without complex join paths.
