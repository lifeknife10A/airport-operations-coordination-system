# User Requirements: Groups D & F

This document records what each user role in Group D and Group F requires to perform their daily operations and how they communicate with the system.

---

## Group D: Cabin & Catering Services (Aircraft Interior)

### 1. Cabin Cleaning Supervisor
* **What I need:** "When a flight lands, I need to know exactly when deboarding is complete so my crew doesn't wait at the gate. I need to assign my crew to different zones (First Class, Economy) and toggle the cabin status (Red = Unclean, Yellow = Cleaning, Green = Cabin Cleared) so the Ground Supervisor knows we are done."
* **Pointers to be Taken:**
  * Track live "Deboarding Completed" status from the gate.
  * Drag-and-drop board to assign crew members.
  * 3-state status toggle (Red / Yellow / Green) that updates the central dashboard.

### 2. Cabin Cleaning Crew Member
* **What I need:** "I clean the plane under a tight schedule. I don't want to type anything. I just need a simple checklist of my assigned rows and seat tasks. I want to check them off and tap a big 'Done' button. If I find a lost item, I need a quick way to log it and take a photo."
* **Pointers to be Taken:**
  * Simple task checklist (no typing).
  * Glove-friendly, large buttons.
  * Lost & Found logger with camera photo upload.

### 3. Catering Dispatcher
* **What I need:** "I need to see flight passenger counts and meal lists from the airlines so we can load the correct meals onto our kitchen trucks. If a flight is delayed, my dashboard needs to show it immediately so we don't dispatch meals too early."
* **Pointers to be Taken:**
  * Auto-sync passenger numbers and special meal counts.
  * Real-time flight schedule/delay dashboard.

### 4. Catering Loader
* **What I need:** "I drive the high-lift truck to the plane. I need to know which gate and galley door to dock with. When the carts are swapped, I want to tap a button to confirm catering is loaded. The app should verify that my truck's safety locks were engaged before letting me finish."
* **Pointers to be Taken:**
  * Display parking stand location and galley door info.
  * "Catering Completed" status toggle.
  * Safety lock sensor verification before task completion.

### 5. Water & Lavatory Service Operator
* **What I need:** "I need to know the aircraft model so I know where the service panels are. After draining waste and filling fresh water, I need to type the water volume filled. If waste line pressure is too high, the app should warn me about a potential block."
* **Pointers to be Taken:**
  * Display aircraft panel location diagrams.
  * Simple slider/input for water volume.
  * High-pressure sensor warning alerts.

---

## Group F: Security, Regulatory & Emergency Teams

### 6. Terminal Security Officer
* **What I need:** "I need to see the passenger load for upcoming departures so we can open more security lanes. If my checkpoint queues get backed up, I want a toggle to trigger a 'Security Congestion' alert to let the boarding gates know passengers are delayed."
* **Pointers to be Taken:**
  * Display hourly passenger departure load forecasts.
  * Toggle switch to broadcast a "Security Congestion Alert".

### 7. Aircraft Security Sweeper
* **What I need:** "We sweep the plane before boarding. When the cabin is clear, I want to type a quick 4-digit security PIN on my mobile screen to sign off clearance. This sign-off must automatically unlock the gate boarding screen so passenger boarding can start."
* **Pointers to be Taken:**
  * Checklist of cabin security zones.
  * Secure 4-digit PIN authorization field.
  * Automatic boarding gate unlock upon successful sweep submission.

### 8. Customs & Immigration Officer
* **What I need:** "I need to see incoming international flight arrival schedules, passenger counts, and origin countries so we can staff passport control booths during peak hours."
* **Pointers to be Taken:**
  * Live international arrival timeline.
  * Visual chart of passenger volume forecast.

### 9. Airport Emergency Services Liaison (Fire/Rescue)
* **What I need:** "If a fueling spill or aircraft emergency happens, our station terminal must ring a loud alarm and show a flashing map with the stand number and hazard details. I need a clear button to mark the stand safe when the emergency is over."
* **Pointers to be Taken:**
  * Sound and visual emergency alert system.
  * Flashing layout map showing incident coordinates.
  * Safety clearance override button.
