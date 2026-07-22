# Group A & C: User Stories and Acceptance Criteria (Refined)

This document contains the user stories and acceptance criteria compiled by Anay for **Group A (System Administration & Control Center)** and **Group C (Maintenance & Fueling Services)**, followed by a **Software Engineering & Architectural Critique**, and finally the **Refined Requirements**.

---

## 1. Documented Requirements (Anay's Work)

### Group C: Maintenance & Fueling Services

#### 10. Line Maintenance Engineer
* **User Story 1: Perform Pre-flight Inspection**  
  As a Line Maintenance Engineer, I want to record the results of a pre-flight inspection so that the aircraft is confirmed safe for departure.  
  *Acceptance Criteria:*  
  Given an aircraft is scheduled for departure,  
  When I complete the inspection checklist,  
  Then the inspection status should be saved in the system.  
  Any defects found should be recorded before submission.  
  The aircraft should remain "Pending Clearance" until all required checks are completed.
* **User Story 2: Sign Technical Logbook**  
  As a Line Maintenance Engineer, I want to digitally sign the aircraft's technical logbook so that maintenance activities are officially documented.  
  *Acceptance Criteria:*  
  Given all maintenance tasks are completed,  
  When I sign the technical logbook,  
  Then the system should record my digital signature and timestamp.  
  The logbook should become read-only after approval.  
  The action should be stored in the audit log.
* **User Story 3: Issue Maintenance Clearance**  
  As a Line Maintenance Engineer, I want to approve maintenance clearance so that the aircraft can proceed for boarding and departure.  
  *Acceptance Criteria:*  
  Given all inspections have passed,  
  When I issue maintenance clearance,  
  Then the aircraft status should change to "Maintenance Cleared."  
  Operations staff should receive an automatic notification.  
  Clearance history should be stored.

#### 11. Avionics Technician
* **User Story 1: Record Electronic System Inspection**  
  As an Avionics Technician, I want to log inspection results of electronic systems so that all avionics components are verified before departure.  
  *Acceptance Criteria:*  
  Given an aircraft is available for inspection,  
  When I complete the avionics checklist,  
  Then the inspection report should be saved.  
  Failed components should be highlighted.  
  The report should be accessible to maintenance engineers.
* **User Story 2: Report Electrical Faults**  
  As an Avionics Technician, I want to report electrical issues so that repairs can be scheduled immediately.  
  *Acceptance Criteria:*  
  Given an electrical fault is detected,  
  When I submit the fault report,  
  Then the issue should receive a unique ticket ID.  
  The aircraft status should change to "Technical Issue."  
  Maintenance supervisors should be notified.
* **User Story 3: Request Technical Standby**  
  As an Avionics Technician, I want to request technical standby support so that additional assistance is available during complex repairs.  
  *Acceptance Criteria:*  
  Given additional technical support is required,  
  When I submit a standby request,  
  Then the request should be forwarded to the maintenance control team.  
  The request status should be trackable.  
  Assigned engineers should receive notifications.

#### 12. Aviation Refuelling Operator
* **User Story 1: Record Fuel Quantity**  
  As an Aviation Refuelling Operator, I want to record the amount of fuel pumped into the aircraft so that fuel records remain accurate.  
  *Acceptance Criteria:*  
  Given refueling is completed,  
  When I enter the fuel quantity,  
  Then the system should save the exact liters/gallons pumped.  
  Fuel quantity should be validated against aircraft limits.  
  Fuel records should be available for reporting.
* **User Story 2: Mark Refueling Complete**  
  As an Aviation Refuelling Operator, I want to mark the refueling task as completed so that ground operations know the aircraft is ready for the next process.  
  *Acceptance Criteria:*  
  Given refueling has finished,  
  When I mark the task as complete,  
  Then the task status should change to "Completed."  
  The Ground Operations Supervisor should receive the update.  
  Completion time should be recorded.
* **User Story 3: View Assigned Refueling Tasks**  
  As an Aviation Refuelling Operator, I want to view my assigned refueling jobs so that I can complete them in the correct order.  
  *Acceptance Criteria:*  
  Given I am logged into the system,  
  When I access my task dashboard,  
  Then I should see all assigned refueling tasks.  
  Tasks should display aircraft number, stand number, and scheduled time.  
  Completed tasks should move to the history section.

#### 13. Fuel Safety Inspector
* **User Story 1: Record Fuel Quality Test**  
  As a Fuel Safety Inspector, I want to record fuel quality test results so that only approved fuel is supplied to aircraft.  
  *Acceptance Criteria:*  
  Given fuel samples have been collected,  
  When I enter the test results,  
  Then the system should save the inspection report.  
  Failed quality tests should trigger an alert.  
  Reports should be available for audits.
* **User Story 2: Approve Refueling Safety Clearance**  
  As a Fuel Safety Inspector, I want to approve refueling safety clearance so that refueling can begin only after safety verification.  
  *Acceptance Criteria:*  
  Given all safety checks are completed,  
  When I approve the clearance,  
  Then the system should allow the refueling process to begin.  
  Approval should include inspector details and timestamp.  
  Clearance should be visible to the refueling operator.
* **User Story 3: Reject Unsafe Fuel**  
  As a Fuel Safety Inspector, I want to reject unsafe fuel batches so that contaminated fuel is not used in aircraft.  
  *Acceptance Criteria:*  
  Given a fuel quality test has failed,  
  When I reject the fuel batch,  
  Then the batch should be marked as "Rejected."  
  Refueling operations should be blocked automatically.  
  Airport maintenance and fuel management teams should receive an alert.

---

### Group A: System Administration & Control Center

#### 1. Airport Administrator
* **User Story 1: Create Staff Accounts**  
  As an Airport Administrator, I want to create staff accounts so that authorized personnel can access the Airport Operations Control System (AOCS).  
  *Acceptance Criteria:*  
  Given I am logged in as an Airport Administrator,  
  When I enter valid staff information and assign a role,  
  Then a new account should be created successfully.  
  The system should generate a unique User ID.  
  The staff member should receive login credentials.  
  The action should be recorded in the audit log.
* **User Story 2: Manage User Permissions**  
  As an Airport Administrator, I want to update user permissions so that employees only have access to features relevant to their roles.  
  *Acceptance Criteria:*  
  Given a user account exists,  
  When I modify the user's permissions,  
  Then the changes should take effect immediately.  
  Unauthorized permissions should not be assigned.  
  The modification should be stored in the audit log.
* **User Story 3: View System Audit Logs**  
  As an Airport Administrator, I want to view system audit logs so that I can monitor all critical activities performed in the system.  
  *Acceptance Criteria:*  
  Given I have administrator privileges,  
  When I open the Audit Log module,  
  Then I should see all recorded activities.  
  Logs should include user name, timestamp, action performed, and affected module.  
  Logs should be searchable and filterable.
* **User Story 4: Assign Role-Based Permissions**  
  As an Airport Administrator, I want to assign role-based permissions to users so that each employee can access only the modules relevant to their responsibilities.  
  *Acceptance Criteria:*  
  Given I am logged in as an Airport Administrator,  
  When I select a user account and assign or modify their role-based permissions,  
  Then the user should only be able to access the modules and features permitted for their assigned role.  
  The system should prevent assigning permissions beyond the administrator's authorization level.  
  Changes to permissions should take effect immediately after they are saved.  
  The system should record the permission changes, including the administrator's name, timestamp, and modified permissions, in the audit log.  
  If invalid or conflicting permissions are selected, the system should display an appropriate validation message and prevent the changes from being saved.

#### 2. AOCC Director (Airport Operations Control Center)
* **User Story 1: Monitor Airport Operations**  
  As an AOCC Director, I want to monitor airport-wide operational metrics so that I can ensure smooth airport operations.  
  *Acceptance Criteria:*  
  Given I am logged into the dashboard,  
  When I open the Operations Overview,  
  Then I should see runway status, gate occupancy, flight status, and operational alerts.  
  The dashboard should refresh automatically.  
  Critical alerts should be highlighted.
* **User Story 2: Modify Flight Schedules**  
  As an AOCC Director, I want to update flight schedules so that airport operations remain coordinated during delays or emergencies.  
  *Acceptance Criteria:*  
  Given a flight exists in the schedule,  
  When I modify its departure or arrival time,  
  Then the updated schedule should be visible to all authorized users.  
  Any scheduling conflicts should be detected.  
  Changes should be logged.
* **User Story 3: Manage Runway Availability**  
  As an AOCC Director, I want to mark runways as available or unavailable so that aircraft operations remain safe.  
  *Acceptance Criteria:*  
  Given I have director privileges,  
  When I update the runway status,  
  Then all affected flights should receive the updated information.  
  Closed runways should not be assigned to flights.  
  The change should trigger notifications to relevant departments.

#### 3. Gate & Stand Planner
* **User Story 1: Assign Gates**  
  As a Gate & Stand Planner, I want to assign gates to flights so that passengers can board and disembark efficiently.  
  *Acceptance Criteria:*  
  Given a scheduled flight exists,  
  When I assign an available gate,  
  Then the gate should be reserved for that flight.  
  Double booking should not be allowed.  
  The assignment should appear in the airport schedule.
* **User Story 2: Allocate Aircraft Parking Stands**  
  As a Gate & Stand Planner, I want to assign parking stands to aircraft so that aircraft are parked safely after arrival.  
  *Acceptance Criteria:*  
  Given an arriving aircraft requires parking,  
  When I assign an available stand,  
  Then the stand should be reserved.  
  Occupied stands should not be selectable.  
  Stand availability should update automatically.
* **User Story 3: Reassign Gates During Operational Changes**  
  As a Gate & Stand Planner, I want to change gate assignments so that operational disruptions can be managed efficiently.  
  *Acceptance Criteria:*  
  Given a gate reassignment is required,  
  When I select a new available gate,  
  Then the previous reservation should be released.  
  The new assignment should be reflected immediately.  
  Relevant airport staff should receive notifications.

#### 4. Ground Operations Supervisor
* **User Story 1: Assign Ground Handling Tasks**  
  As a Ground Operations Supervisor, I want to assign turnaround tasks to ground staff so that aircraft are serviced efficiently before departure.  
  *Acceptance Criteria:*  
  Given an aircraft has arrived,  
  When I assign servicing tasks,  
  Then each task should be allocated to the appropriate team.  
  Task status should initially be marked as "Pending."  
  Assigned staff should receive notifications.
* **User Story 2: Set Task Priorities**  
  As a Ground Operations Supervisor, I want to prioritize turnaround tasks so that critical activities are completed first.  
  *Acceptance Criteria:*  
  Given multiple tasks are scheduled,  
  When I assign priority levels,  
  Then high-priority tasks should appear at the top of the task list.  
  Priority changes should be visible to all assigned staff.  
  The system should save the updated priority.
* **User Story 3: Record Operational Delays**  
  As a Ground Operations Supervisor, I want to record delays in turnaround activities so that airport management can monitor operational performance.  
  *Acceptance Criteria:*  
  Given a turnaround task is delayed,  
  When I record the reason for the delay,  
  Then the delay should be displayed on the operations dashboard.  
  Delay duration and reason should be stored.  
  AOCC officials should receive the updated information.

---

## 2. Review and Constructive Criticism (Software Engineering Critique)

### Group C (Maintenance & Fueling) Gaps
1. **Critical Defect Blocking Logic:** In *Line Maintenance Engineer -> US 1*, if defects are found, the system should automatically change the aircraft status to "AOG" (Aircraft on Ground) or "Technical Issue" and **prevent** the issuance of "Maintenance Clearance" until resolved.
2. **Missing Security PIN Pad for Logbook Signatures:** Digital signatures (US 2) should require explicit authentication (like entering a secure PIN) rather than just clicking a button, for security audit compliance.
3. **Refueling Quantity Mutual Verification (The Calculator):** The Refueling Operator (US 1) should not just type quantities. Refueling requires input of target fuel mass (from Pilot/Flight Dispatch) and fuel density (measured on-site), using a calculator to determine volume pumped. 
4. **Refueling and Fuel Safety Dependencies:** The Refueling Operator (US 2) should be **prevented** from marking refueling complete (or starting refueling) if the **Fuel Safety Inspector** has not submitted a passing safety clearance token first.

### Group A (Administration & Control) Gaps
1. **Gate & Stand Physical Compatibility Checks:** The Gate Planner (US 1 & 2) should not allow assigning any stand. The stand dimensions must match the aircraft wingspan and length (derived from the aircraft registry table).
2. **Automatic Real-time Update Mechanism:** The AOCC Director (US 1) monitoring system needs explicit technical constraints (e.g., using WebSockets or server-sent events for instant dashboard updates rather than standard REST queries).
3. **Cascade Effects of Schedules/Runways:** Closure of a runway (US 3) or modifying schedules (US 2) should automatically trigger a calculation showing conflicting flights, and automatically alert the Ground Supervisors of affected flights.

---

## 3. Refined Requirements

### Group C: Maintenance & Fueling Services

#### 10. Line Maintenance Engineer
* **User Story 1: Perform Pre-flight Inspection**  
  As a Line Maintenance Engineer, I want to record the results of a pre-flight inspection so that the aircraft is confirmed safe for departure.  
  *Acceptance Criteria:*  
  * **Given** a flight turnaround checklist is loaded on the mobile terminal,  
  * **When** the engineer submits the inspection checklist,  
  * **Then** the system shall save the inspection status in the database, and if any defects are marked, automatically update the flight status to "Technical Issue" and block departure clearance.
* **User Story 2: Sign Technical Logbook**  
  As a Line Maintenance Engineer, I want to digitally sign the aircraft's technical logbook so that maintenance activities are officially documented.  
  *Acceptance Criteria:*  
  * **Given** all required maintenance checklist items are marked as completed,  
  * **When** the engineer inputs their secure 4-digit PIN to sign the logbook,  
  * **Then** the system shall store the encrypted signature and timestamp, lock the logbook to read-only status, and create an audit log entry.
* **User Story 3: Issue Maintenance Clearance**  
  As a Line Maintenance Engineer, I want to approve maintenance clearance so that the aircraft can proceed for boarding and departure.  
  *Acceptance Criteria:*  
  * **Given** that all inspections have passed and there are zero outstanding critical defect tickets on the aircraft,  
  * **When** the engineer clicks "Approve Maintenance Clearance",  
  * **Then** the system shall update the aircraft status to "Maintenance Cleared" and send an alert notification to the Ground Operations Supervisor and Boarding Gate Agent.

#### 11. Avionics Technician
* **User Story 1: Record Electronic System Inspection**  
  As an Avionics Technician, I want to log inspection results of electronic systems so that all avionics components are verified before departure.  
  *Acceptance Criteria:*  
  * **Given** the aircraft avionics checklist is open,  
  * **When** the technician submits the inspection results,  
  * **Then** the system shall save the report, highlight failed systems in red on the maintenance panel, and notify the Line Maintenance Engineer of failures.
* **User Story 2: Report Electrical Faults**  
  As an Avionics Technician, I want to report electrical issues so that repairs can be scheduled immediately.  
  *Acceptance Criteria:*  
  * **Given** a defect has been identified during avionics inspection,  
  * **When** the technician submits a fault ticket with severity (Minor/Critical) and category,  
  * **Then** the system shall generate a unique defect ID, change the aircraft status to "Technical Issue", and display the ticket on the Maintenance Supervisor's work-list.
* **User Story 3: Request Technical Standby**  
  As an Avionics Technician, I want to request technical standby support so that additional assistance is available during complex repairs.  
  *Acceptance Criteria:*  
  * **Given** a repair ticket is active and requires secondary verification or support,  
  * **When** the technician taps "Request Standby Support" on their terminal,  
  * **Then** the system shall broadcast a priority alert to the Maintenance Control Team and update the ticket status to "Standby Requested".

#### 12. Aviation Refuelling Operator
* **User Story 1: Record Fuel Quantity**  
  As an Aviation Refuelling Operator, I want to calculate and record the amount of fuel pumped into the aircraft so that fuel records remain accurate.  
  *Acceptance Criteria:*  
  * **Given** the pilot has submitted a target fuel load (in kg) and the Fuel Safety Inspector has approved clearance,  
  * **When** the operator inputs the actual fuel volume loaded (in liters) and the fuel density,  
  * **Then** the system shall compute the final fuel weight in kilograms, verify that it falls within ±1% of the pilot's target load, and store the quantity.
* **User Story 2: Mark Refueling Complete**  
  As an Aviation Refuelling Operator, I want to mark the refueling task as completed so that ground operations know the aircraft is ready for the next process.  
  *Acceptance Criteria:*  
  * **Given** the fueling hose is safely disconnected and fuel weights are saved,  
  * **When** the operator clicks "Refueling Completed",  
  * **Then** the system shall change the task status to "Completed", record the timestamp, and remove the refueling block from the Ground Operations Supervisor's dashboard.
* **User Story 3: View Assigned Refueling Tasks**  
  As an Aviation Refuelling Operator, I want to view my assigned refueling jobs so that I can complete them in the correct order.  
  *Acceptance Criteria:*  
  * **Given** the operator is logged into their mobile terminal,  
  * **When** they access the job queue,  
  * **Then** the system shall display all active refueling assignments sorted by flight schedule departure times, showing gate/stand location and target fuel requirements.

#### 13. Fuel Safety Inspector
* **User Story 1: Record Fuel Quality Test**  
  As a Fuel Safety Inspector, I want to record fuel quality test results so that only approved fuel is supplied to aircraft.  
  *Acceptance Criteria:*  
  * **Given** chemical test samples have been drawn from the fuel batch,  
  * **When** the inspector inputs test parameters (water content, visual clarity, flashpoint) and submits,  
  * **Then** the system shall store the test record and flag the batch as "Pass" or "Fail".
* **User Story 2: Approve Refueling Safety Clearance**  
  As a Fuel Safety Inspector, I want to approve refueling safety clearance so that refueling can begin only after safety verification.  
  *Acceptance Criteria:*  
  * **Given** the fuel quality test has passed and the safety grounding cables are confirmed attached,  
  * **When** the inspector taps "Approve Refueling Safety Clearance" and enters their security PIN,  
  * **Then** the system shall record the safety token and unlock the refueling controls on the Refueling Operator's terminal.
* **User Story 3: Reject Unsafe Fuel**  
  As a Fuel Safety Inspector, I want to reject unsafe fuel batches so that contaminated fuel is not used in aircraft.  
  *Acceptance Criteria:*  
  * **Given** a fuel quality test has failed,  
  * **When** the inspector clicks "Reject Batch",  
  * **Then** the system shall set the batch status to "Contaminated", trigger a high-severity alert to the AOCC, and programmatically lock the refueling task for the affected flight.

---

### Group A: System Administration & Control Center

#### 1. Airport Administrator
* **User Story 1: Create Staff Accounts**  
  As an Airport Administrator, I want to create staff accounts so that authorized personnel can access the AOCS.  
  *Acceptance Criteria:*  
  * **Given** the administrator is logged in,  
  * **When** the admin submits the new user form (name, email, role, department),  
  * **Then** the system shall generate a unique User ID, assign default permissions, create the database record, and send activation credentials to the user's email.
* **User Story 2: Manage User Permissions**  
  As an Airport Administrator, I want to update user permissions so that employees only have access to features relevant to their roles.  
  *Acceptance Criteria:*  
  * **Given** a user profile is loaded on the screen,  
  * **When** the administrator adjusts specific permission checkboxes and clicks save,  
  * **Then** the system shall update the user's access token in real-time, write the old vs new permissions to the audit logs table, and apply the rules on the user's next API request.
* **User Story 3: View System Audit Logs**  
  As an Airport Administrator, I want to view system audit logs so that I can monitor all critical activities performed in the system.  
  *Acceptance Criteria:*  
  * **Given** the admin access is validated,  
  * **When** the admin accesses the audit log panel and applies filters (by User ID, Module, Date range),  
  * **Then** the system shall display the matching audit records showing timestamp, user IP, action type, and database change description.

#### 2. AOCC Director (Airport Operations Control Center)
* **User Story 1: Monitor Airport Operations**  
  As an AOCC Director, I want to monitor airport-wide operational metrics so that I can ensure smooth airport operations.  
  *Acceptance Criteria:*  
  * **Given** the director's dashboard is active,  
  * **When** any operational event changes (e.g., flight landing, gate delay, incident),  
  * **Then** the system shall push real-time updates via WebSockets to automatically refresh charts, gate occupancy graphs, and flash alerts without manual reload.
* **User Story 2: Modify Flight Schedules**  
  As an AOCC Director, I want to update flight schedules so that airport operations remain coordinated during delays or emergencies.  
  *Acceptance Criteria:*  
  * **Given** a flight schedule exists in the database,  
  * **When** the director inputs a modified departure/arrival time (ETD/ETA),  
  * **Then** the system shall check for gate/runway scheduling conflicts, update the ETA/ETD across all client views, and recalculate dependent turnaround task deadlines.
* **User Story 3: Manage Runway Availability**  
  As an AOCC Director, I want to mark runways as available or unavailable so that aircraft operations remain safe.  
  *Acceptance Criteria:*  
  * **Given** a runway is active,  
  * **When** the director toggles the runway status to "Closed" due to maintenance or weather,  
  * **Then** the system shall flag a critical conflict on all incoming flights scheduled on that runway within the next 2 hours and notify the ATC and Stand Planner dashboards.

#### 3. Gate & Stand Planner
* **User Story 1: Assign Gates**  
  As a Gate & Stand Planner, I want to assign gates to flights so that passengers can board and disembark efficiently.  
  *Acceptance Criteria:*  
  * **Given** a scheduled flight with a registered aircraft type is loaded,  
  * **When** the planner assigns a gate,  
  * **Then** the system shall verify the stand's physical sizing matches the aircraft wing-span and length parameters, reserve the stand, and publish the gate number to the flight timeline.
* **User Story 2: Allocate Aircraft Parking Stands**  
  As a Gate & Stand Planner, I want to assign parking stands to aircraft so that aircraft are parked safely after arrival.  
  *Acceptance Criteria:*  
  * **Given** an arriving aircraft,  
  * **When** the planner selects a stand from the interactive map,  
  * **Then** the system shall check that the stand status is "Unoccupied" at the landing time, lock the stand for the flight duration, and update the stand status to "Reserved".
* **User Story 3: Reassign Gates During Operational Changes**  
  As a Gate & Stand Planner, I want to change gate assignments so that operational disruptions can be managed efficiently.  
  *Acceptance Criteria:*  
  * **Given** a flight is parked or scheduled at Gate A1,  
  * **When** the planner reassigns the flight to Gate B3,  
  * **Then** the system shall release the reservation on Gate A1, block Gate B3, update the flight status, and broadcast a real-time "Gate Change Alert" to all ground staff assigned to that flight.

#### 4. Ground Operations Supervisor
* **User Story 1: Assign Ground Handling Tasks**  
  As a Ground Operations Supervisor, I want to assign turnaround tasks to ground staff so that aircraft are serviced efficiently before departure.  
  *Acceptance Criteria:*  
  * **Given** a flight is marked "On-Block",  
  * **When** the supervisor selects turnaround tasks (cleaning, fueling, catering) and assigns them to department leads,  
  * **Then** the system shall set task statuses to "Pending", record the assignment, and notify the designated team leads.
* **User Story 2: Set Task Priorities**  
  As a Ground Operations Supervisor, I want to prioritize turnaround tasks so that critical activities are completed first.  
  *Acceptance Criteria:*  
  * **Given** multiple tasks are assigned,  
  * **When** the supervisor changes a task priority to "High" or "Critical",  
  * **Then** the system shall update the task priority in the database and automatically bump the task to the top of the assigned team member's mobile work queue.
* **User Story 3: Record Operational Delays**  
  As a Ground Operations Supervisor, I want to record delays in turnaround activities so that airport management can monitor operational performance.  
  *Acceptance Criteria:*  
  * **Given** a task has exceeded its scheduled completion window,  
  * **When** the supervisor enters the delay duration and select a standardized delay reason code (e.g. Weather, Tech, Late Deboarding),  
  * **Then** the system shall store the data, display a warning icon on the central dashboard, and recalculate the estimated departure time (ETD) for the flight.
