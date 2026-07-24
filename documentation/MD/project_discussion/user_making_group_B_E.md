# Group B & E: User Stories and Acceptance Criteria (Refined)

This document contains the refined user stories and acceptance criteria for **Group B (Ramp & Turnaround Operations)** and **Group E (Passenger & Terminal Services)**. These requirements have been updated to resolve ambiguities, specify active system triggers, define clear notification targets, and establish inter-departmental dependencies.

---

## Group B: Ramp & Turnaround Operations

### 1. Turnaround Coordinator (TCO / Red Cap)
* **User Story:**  
  As a Turnaround Coordinator, I want to record the start time of each ground handling activity on a mobile tablet so that I can monitor turnaround progress accurately.
* **Acceptance Criteria 1 (Refueling Start Trigger):**  
  * **Given** that the aircraft is parked at the assigned stand, and the Ground Operations Supervisor has dispatched the refueling task,  
  * **When** the Turnaround Coordinator taps the "Start Refueling" button on the mobile tablet,  
  * **Then** the system shall record the current timestamp as "Refueling Started" and update the task status to "In Progress" in the database.
* **Acceptance Criteria 2 (Generic Activity Start):**  
  * **Given** that the flight turnaround checklist is loaded on the coordinator's terminal,  
  * **When** the coordinator selects an activity (e.g. cleaning, catering) from a pre-defined list and taps "Start",  
  * **Then** the system shall record the activity start time and update the flight turnaround timeline on the central dashboard.
* **Acceptance Criteria 3 (Dashboard Monitoring):**  
  * **Given** that multiple turnaround activities are in progress,  
  * **When** the coordinator views the turnaround dashboard screen,  
  * **Then** the system shall display the status (Pending, In Progress, Delayed, Completed) and elapsed duration for all active tasks.

### 2. Aircraft Marshaller
* **User Story:**  
  As an Aircraft Marshaller, I want to report the aircraft's On-Block time so that the AOCS can start the turnaround monitoring process.
* **Acceptance Criteria 1 (Confirming On-Block):**  
  * **Given** that the aircraft has taxied to its assigned stand,  
  * **When** the marshaller confirms wheel chocks are placed by tapping the "Confirm On-Block" button on their terminal,  
  * **Then** the system shall record the current timestamp as the flight's "On-Block Time" in the database.
* **Acceptance Criteria 2 (Automatic Timer Activation):**  
  * **Given** that the On-Block time has been successfully saved in the database,  
  * **When** the AOCS registers this timestamp,  
  * **Then** the system shall automatically initialize the turnaround countdown timer (e.g., a 45-minute countdown clock) for this flight.
* **Acceptance Criteria 3 (Visibility of On-Block Event):**  
  * **Given** that the flight is in "On-Block" status,  
  * **When** any authorized airport user (e.g., Ground Supervisor, Airline Representative) views the flight status screen,  
  * **Then** the system shall display the recorded On-Block timestamp and the active countdown timer.

### 3. Pushback Tug Operator
* **User Story:**  
  As a Pushback Tug Operator, I want to report the commencement of pushback so that stakeholders are informed that departure procedures have begun.
* **Acceptance Criteria 1 (Starting Pushback):**  
  * **Given** that the flight status is "Ready for Pushback" (indicating all turnaround tasks are completed),  
  * **When** the tug operator engages the towbar and taps the "Commence Pushback" button on their screen,  
  * **Then** the system shall update the flight status to "Pushback Commenced" and record the "Off-Block" timestamp.
* **Acceptance Criteria 2 (Operational Notifications):**  
  * **Given** that the tug operator has submitted the "Pushback Commenced" status update,  
  * **When** the system receives the update,  
  * **Then** the system shall broadcast a real-time notification to the Air Traffic Control (ATC) dashboard and the Ground Operations Supervisor's dashboard.
* **Acceptance Criteria 3 (Movement Verification):**  
  * **Given** that the pushback event is recorded,  
  * **When** users view the flight movement details page,  
  * **Then** the system shall display the pushback start time and change the flight status from "On-Block" to "Departed".

### 4. Baggage Loading Supervisor
* **User Story:**  
  As a Baggage Loading Supervisor, I want to update baggage offload and onload status so that baggage handling progress can be monitored in real time.
* **Acceptance Criteria 1 (Baggage Offload Start):**  
  * **Given** that the flight status is "On-Block",  
  * **When** the supervisor taps "Start Baggage Offloading" on their mobile device,  
  * **Then** the system shall update the task status to "Offloading In Progress" and display this status on the central dashboard.
* **Acceptance Criteria 2 (Baggage Onload Start):**  
  * **Given** that baggage offloading is completed,  
  * **When** the supervisor taps "Start Baggage Loading",  
  * **Then** the system shall update the status to "Loading In Progress" and display the target bag count from the check-in counter manifest.
* **Acceptance Criteria 3 (Completion & Count Validation):**  
  * **Given** that all baggage has been loaded,  
  * **When** the supervisor inputs the final count of loaded bags and taps "Complete Baggage Task",  
  * **Then** the system shall verify if the count matches the check-in count, store the final bag count, and mark the baggage task as "Completed".

### 5. Cargo Handling Specialist
* **User Story:**  
  As a Cargo Handling Specialist, I want to record commercial cargo loading activities so that cargo operations can be tracked efficiently.
* **Acceptance Criteria 1 (Cargo Loading Start):**  
  * **Given** that the aircraft cargo doors are opened,  
  * **When** the specialist taps "Start Cargo Loading" and enters the container ID,  
  * **Then** the system shall set the cargo status to "Loading In Progress" and associate the container with the flight.
* **Acceptance Criteria 2 (Weight and Balance Logging):**  
  * **Given** that cargo items are being loaded,  
  * **When** the specialist enters the weight (in kg) of each loaded cargo pallet and submits the record,  
  * **Then** the system shall store the cargo weight data in the database and recalculate the flight's total cargo load.
* **Acceptance Criteria 3 (Cargo Completion):**  
  * **Given** that all cargo containers are loaded and locked,  
  * **When** the specialist clicks "Complete Cargo Operations",  
  * **Then** the system shall update the task status to "Completed" and notify the Ground Operations Supervisor that cargo is cleared.

---

## Group E: Passenger & Terminal Services

### 1. Check-in Counter Agent
* **User Story:**  
  As a Check-in Counter Agent, I want to monitor passenger check-in status so that I can ensure all travelers are processed before departure.
* **Acceptance Criteria 1 (Passenger Check-in Update):**  
  * **Given** that the check-in counter is open for a flight,  
  * **When** the agent scans a passenger's passport/barcode or manually submits their details,  
  * **Then** the system shall update the individual passenger's status to "Checked-in" and update the flight's passenger manifest in the database.
* **Acceptance Criteria 2 (Real-time Manifest Progress):**  
  * **Given** that check-in is ongoing,  
  * **When** the agent views the flight overview screen,  
  * **Then** the system shall display the live ratio of checked-in passengers to booked passengers (e.g., 142 / 150 checked-in).
* **Acceptance Criteria 3 (Closing Check-in):**  
  * **Given** that the check-in closure deadline is reached,  
  * **When** the agent clicks the "Close Check-in" button,  
  * **Then** the system shall change the flight's check-in status to "Closed", generate the final passenger manifest, and transmit the final load numbers to the Catering Dispatcher and Boarding Gate Agent.

### 2. Boarding Gate Agent
* **User Story:**  
  As a Boarding Gate Agent, I want to update boarding milestones such as "Boarding Started", "Final Call", and "Boarding Closed" so that operational teams receive real-time passenger status updates.
* **Acceptance Criteria 1 (Boarding Start Dependency):**  
  * **Given** that the aircraft cabin is marked as "Completed" by the Cabin Cleaning Supervisor, and "Cleared" by the Aircraft Security Sweeper, and "Certified Safe" by the Line Maintenance Engineer,  
  * **When** the gate agent taps the "Start Boarding" button,  
  * **Then** the system shall change the flight boarding status to "Boarding Started" and broadcast a boarding notification to all system monitors.
* **Acceptance Criteria 2 (Final Call Milestone):**  
  * **Given** that boarding is underway and there are remaining unboarded passengers,  
  * **When** the agent clicks the "Trigger Final Call" button,  
  * **Then** the system shall update the flight status to "Final Call" and display a warning on terminal screens.
* **Acceptance Criteria 3 (Boarding Closed Validation):**  
  * **Given** that all checked-in passengers are accounted for (either boarded or marked as no-show),  
  * **When** the agent clicks "Complete Boarding",  
  * **Then** the system shall change the boarding status to "Closed", update the flight status to "Ready for Pushback", and notify the Ground Operations Supervisor and Pushback Tug Operator.

### 3. Terminal Manager
* **User Story:**  
  As a Terminal Manager, I want to report terminal incidents such as power failures and escalator breakdowns so that airport operations can respond quickly.
* **Acceptance Criteria 1 (Logging Incidents):**  
  * **When** the Terminal Manager logs a new incident by selecting the location (e.g. Terminal 2, Gate B10), severity (Low, Medium, Critical), and description,  
  * **Then** the system shall save the incident, assign a unique tracking ID, and record the current timestamp.
* **Acceptance Criteria 2 (Escalation & Notification):**  
  * **Given** that a critical incident (e.g., power failure at checkpoint) is logged,  
  * **When** the manager submits the report,  
  * **Then** the system shall immediately broadcast an emergency alert to the Airport Operations Control Center (AOCC) and the relevant maintenance team dashboard.
* **Acceptance Criteria 3 (Resolution Sign-off):**  
  * **Given** that an incident is marked as active,  
  * **When** the Terminal Manager inputs the repair details and clicks "Mark Resolved",  
  * **Then** the system shall set the status to "Resolved", save the resolution details, and clear the active alert from dashboards.
