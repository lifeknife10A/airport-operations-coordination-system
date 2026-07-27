# Peter Chen ER Diagram Specification & Operational Data Flow

**Project:** Saphire Airport Operations Coordination System (AOCS) (AOCS)  
**Standard Followed:** Peter Chen (1976) ER Notation (*as defined in College Study Material*)  

---

## 1. Peter Chen Notation Rules & Syntax Reference

Based strictly on your college study material (`ER Diagram Study Material.pdf`), the database design elements use the following notation rules:

| Element | Visual Representation / Notation | Purpose & Description |
| :--- | :--- | :--- |
| **Regular Entity** | Single-Lined Rectangle `[ Entity ]` | Strong independent entity type with its own primary key. |
| **Weak Entity** | Double-Lined Rectangle `[[ Weak Entity ]]` | Dependent entity that cannot exist without an identifying owner entity. |
| **Regular Relationship** | Single-Lined Diamond `< Relationship >` | Association between two or more strong entity types. |
| **Identifying Relationship** | Double-Lined Diamond `<< Relationship >>` | Relationship linking a weak entity to its owner entity. |
| **Key Attribute** | Oval with <u>Solid Underline</u> | Primary Key distinguishing unique entity instances. |
| **Partial Key (Discriminator)** | Oval with <u>-Dashed Underline-</u> | Attribute distinguishing weak entity instances under the same owner. |
| **Atomic Attribute** | Single-Lined Oval | Simple attribute that cannot be decomposed further. |
| **Composite Attribute** | Oval branching into child ovals (Tree) | Attribute composed of multiple sub-parts (e.g., `Name` → `First`, `Last`). |
| **Multivalued Attribute** | Double-Lined Oval `(( Attribute ))` | Attribute that can hold multiple values for a single instance (e.g., `Locations`, `Contact_Numbers`). |
| **Derived Attribute** | Dotted-Lined Oval `(: Attribute :)` | Value calculated/derived from other database attributes (e.g., `Turnaround_Duration`, `Total_Staff_Count`). |
| **Optional Participation** | Single Line `────────` | Entity participation in the relationship is optional. |
| **Total (Mandatory) Participation** | Double Line `════════` | Entity participation in the relationship is mandatory/total. |
| **Cardinalities** | `1`, `N`, `M` labeled on lines | Specifies `1:1`, `1:N`, or `M:N` mapping constraints. |

---

## 2. Comprehensive AOCS Chen ER Diagram Breakdown

Below is the complete entity, attribute, and relationship mapping applying all 6 Chen attribute types and weak entities.

### 2.1 Entity & Attribute Classification Matrix

```
                          ┌───────────────────────────┐
                          │ AOCS ENTITY SYSTEM (CHEN) │
                          └─────────────┬─────────────┘
                                        │
    ┌────────────────┬──────────────────┼──────────────────┬────────────────┐
    ▼                ▼                  ▼                  ▼                ▼
[ USERS ]       [ AIRCRAFT ]        [ GATES ]         [ FLIGHTS ]      [[ DELAY_LOGS ]]
 (Strong)        (Strong)            (Strong)          (Strong)           (Weak)
```

#### 1. Entity: `USERS` (Strong Entity `[ USERS ]`)
* <u>`user_id`</u> : **Key Attribute** (Solid Underline)
* `username` : **Key Attribute** (Alternative Unique Key)
* `name` : **Composite Attribute** (Tree branching into `first_name`, `last_name`)
* `password_hash`, `email` : **Atomic Attributes**
* `(( phone_numbers ))` : **Multivalued Attribute** (Double-Lined Oval - user can have multiple mobile/walkie numbers)
* `is_active` : **Atomic Attribute**

#### 2. Entity: `DEPARTMENTS` (Strong Entity `[ DEPARTMENTS ]`)
* <u>`department_id`</u> : **Key Attribute** (Solid Underline)
* `department_name` : **Atomic Attribute**
* `(( department_locations ))` : **Multivalued Attribute** (Double-Lined Oval - e.g., Terminal 1 Office, Hangar 3, Apron Desk)
* `(: number_of_staff :)` : **Derived Attribute** (Dotted-Lined Oval - calculated via `COUNT(users)`)

#### 3. Entity: `FLIGHTS` (Strong Entity `[ FLIGHTS ]`)
* <u>`flight_id`</u> : **Key Attribute** (Solid Underline)
* `flight_number` : **Atomic Attribute**
* `scheduled_arrival`, `scheduled_departure` : **Atomic Attributes**
* `actual_arrival`, `actual_departure` : **Atomic Attributes**
* `(: turnaround_duration :)` : **Derived Attribute** (Dotted-Lined Oval - calculated as `actual_departure - actual_arrival`)
* `flight_status` : **Atomic Attribute** (`'SCHEDULED'`, `'ON-BLOCK'`, `'SERVICING'`, `'READY'`, `'DEPARTED'`)

#### 4. Entity: `TASKS` (Strong Entity `[ TASKS ]`)
* <u>`task_id`</u> : **Key Attribute** (Solid Underline)
* `task_name` : **Atomic Attribute** (`'REFUELING'`, `'CABIN_CLEANING'`, `'CATERING'`)
* `status` : **Atomic Attribute** (`'PENDING'`, `'IN_PROGRESS'`, `'COMPLETED'`, `'FAILED'`)
* `(: elapsed_time :)` : **Derived Attribute** (Dotted-Lined Oval - calculated as `NOW() - actual_start`)

#### 5. Weak Entity: `DELAY_LOGS` (Weak Entity `[[ DELAY_LOGS ]]`)
* <u>`-delay_sequence_no-`</u> : **Partial Key / Discriminator** (Dashed Underline)
* `delay_minutes` : **Atomic Attribute**
* `reason_category` : **Atomic Attribute**
* `explanation` : **Atomic Attribute**
* *Identifying Relationship:* `<< triggers_delay >>` connecting `[ FLIGHTS ]` to `[[ DELAY_LOGS ]]`.

---

### 2.2 Chen ER Relationships, Participation & Cardinality Table

| Relationship | Entity 1 | Participation 1 | Cardinality | Entity 2 | Participation 2 | Relationship Description |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| **`< employs >`** | `[ DEPARTMENTS ]` | Single Line (Optional) | `1` : `N` | `[ USERS ]` | Double Line (Total) | Every user MUST belong to a department. |
| **`< operates >`** | `[ AIRCRAFT ]` | Single Line (Optional) | `1` : `N` | `[ FLIGHTS ]` | Double Line (Total) | Every flight leg MUST be assigned a physical aircraft. |
| **`< hosts >`** | `[ GATES ]` | Single Line (Optional) | `1` : `N` | `[ FLIGHTS ]` | Single Line (Optional) | A gate hosts multiple sequential flights; flights get assigned gates. |
| **`< requires >`** | `[ FLIGHTS ]` | Double Line (Total) | `1` : `N` | `[ TASKS ]` | Double Line (Total) | A turnaround flight MUST generate multiple ground tasks. |
| **`< performs >`** | `[ USERS ]` | Single Line (Optional) | `1` : `N` | `[ TASKS ]` | Single Line (Optional) | A user can be assigned to perform ground tasks. |
| **`<< triggers_delay >>`** | `[ FLIGHTS ]` | Single Line (Optional) | `1` : `N` | `[[ DELAY_LOGS ]]` | Double Line (Total) | Weak entity: `DELAY_LOGS` cannot exist without a parent `FLIGHTS`. |
| **`< supervises >`** | `[ USERS ]` *(Supervisor)* | Single Line (Optional) | `1` : `N` | `[ USERS ]` *(Staff)* | Single Line (Optional) | **Recursive Relationship**: A supervisor supervises staff members. |

---

## 3. Operational Scenario Data Flow: Refueling Technician & Pilot

To understand how human interactions directly alter the database during operations, here is a step-by-step trace of **Scenario: Fuel Calculation & Mutual Verification**.

### Scenario Context
* **Actors**: Pilot (In cockpit) & Refueling Technician (On tarmac apron).
* **Objective**: Calculate exact fuel weight needed, pump fuel, and verify safety before flight departure.

```
 [Pilot UI Terminal]                                           [Refueler Mobile UI]
   (Inputs Target Fuel)                                         (Inputs Density & Vol)
            │                                                            │
            └───────────────┐                          ┌─────────────────┘
                            ▼                          ▼
                  ┌──────────────────────────────────────────┐
                  │    Spring Boot Backend API Controller    │
                  │   - Computes: Liters = Net Weight / Density│
                  │   - Enforces Mutual Dual-Lock Verification │
                  └────────────────────┬─────────────────────┘
                                       │
                                       ▼
                  ┌──────────────────────────────────────────┐
                  │          PostgreSQL Database             │
                  │   - Updates `TASKS` status to COMPLETED  │
                  │   - Calculates Derived Task Duration     │
                  │   - Inserts row into `AUDIT_LOGS`        │
                  └──────────────────────────────────────────┘
```

---

### Step-by-Step Interaction & Database Operations

#### Step 1: Task Dispatching (`ON-BLOCK`)
* **System State:** Aircraft lands at Gate A1. Marshaller confirms On-Block.
* **Database Action:**
  * System creates a task row in `TASKS`: `task_name = 'REFUELING'`, `status = 'PENDING'`, `flight_id = 101`, `department_id = 3` (Refueling Dept).

#### Step 2: Input & Interactive Calculation
* **User Actions:**
  1. Pilot enters **Target Fuel Weight**: `12,000 kg` on cockpit UI.
  2. Refueling Technician inputs **Current Fuel Weight**: `4,000 kg` and **Fuel Batch Density**: `0.80 kg/L` on mobile tablet.
* **Backend Processing (Spring Boot):**
  * Net Fuel Required = `12,000 - 4,000 = 8,000 kg`.
  * Liters to Pump = `8,000 / 0.80 = 10,000 Liters`.
  * Status changes to `status = 'IN_PROGRESS'`, saving `actual_start = CURRENT_TIMESTAMP`.

#### Step 3: Pumping & Mutual Dual-Lock Verification
* **User Actions:**
  * Refueler pumps 10,000 Liters, taps **"Confirm Pumping Complete"**.
  * Pilot reviews calculated weight on cockpit screen, taps **"Pilot Sign-Off Lock"**.
* **Database SQL Transaction Executed:**
  ```sql
  BEGIN;
  
  -- Update refueling task status
  UPDATE tasks 
  SET status = 'COMPLETED', 
      actual_end = CURRENT_TIMESTAMP,
      notes = 'Target: 12000kg | Density: 0.80kg/L | Pumped: 10000L | Verified by Pilot & Refueler'
  WHERE task_id = 502 AND status = 'IN_PROGRESS';

  -- Record audit trail
  INSERT INTO audit_logs (user_id, action, target_entity, target_id, timestamp)
  VALUES (14, 'MUTUAL_REFUELING_VERIFICATION', 'TASKS', 502, CURRENT_TIMESTAMP);

  COMMIT;
  ```

#### Step 4: Real-time System Update & Trigger
* **Derived Attribute Updated:** `(: elapsed_time :)` for task calculated as `actual_end - actual_start`.
* **State Check Trigger:** Backend checks if all other tasks for `flight_id = 101` (Cleaning, Baggage, Catering) are `COMPLETED`.
* **Outcome:** Once 100% completed, `FLIGHTS.flight_status` transitions to `'READY'`, enabling the Pushback Tug Operator to begin departure!

---

## User Review Required

> [!IMPORTANT]
> Please review this document. It incorporates **Peter Chen (1976) ER Notation** using all 6 attribute types (Key, Partial Key, Atomic, Composite, Multivalued, Derived), double-line participation, weak entities, and a detailed operational interaction scenario for Refueling.
