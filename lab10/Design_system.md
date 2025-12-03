# Hospital Triage Design System

## 1. Fonts
**Primary Font Family:** *Roboto*
* **Headings (H1/H2):** Bold, 700 weight. Used for main titles and step indicators.
* **Body Text:** Regular, 400 weight. Used for instructions and general data.
* **Labels/Buttons:** Medium, 500 weight. Used for interactive elements to ensure readability against colored backgrounds.

**Reasoning:**
In a medical context, clarity is important; the clean lines of *Roboto* prevent character confusion (e.g., distinguishing '1' from 'l'). The clear distinction between Bold headers and Regular body text establishes a strong hierarchy, allowing users to scan instructions quickly.

## 2. Colour Palette

### Palette Breakdown
* **Calm Teal (`#009688`)**:
    * **Usage:** Primary brand color, "Next" buttons, low-priority status badges.
    * **Reasoning:** Teal is associated with calmness and healing in medical design. It reduces anxiety for patients filling out the form.
* **Alert Red (`#E53935`)**:
    * **Usage:** "High Priority" indicators, Pain Level 8-10, Error messages.
    * **Reasoning:** Semantic color reserved strictly for urgency. It draws the Admin's eye immediately to critical cases.
* **Warning Amber (`#FFC107`)**:
    * **Usage:** "Medium Priority" indicators, Pain Level 4-7.
    * **Reasoning:** Distinct from red, indicating caution without panic.
* **Clinical Gray (`#F5F5F5`)**:
    * **Usage:** App background.
    * **Reasoning:** A slightly off-white background reduces eye strain for Admins looking at the screen for long shifts.

## 3. App Components

### A. Patient Interface Components
* **Injury Selection Cards:**
    * **Design:** Large, square cards containing an icon (e.g., a Heart icon) and text.
    * **Reasoning:** Larger touch targets are significantly easier for injured or distressed patients to tap than small text buttons.
* **Dynamic Pain Slider:**
    * **Design:** A draggable slider range (1-10) that changes color (Green -> Yellow -> Red) as the value increases.
    * **Reasoning:** Provides visual feedback on the severity of the pain, making the abstract number feel more concrete.

### B. Admin Interface Components
* **Heads-Up Stats Bar:**
    * **Design:** A top row displaying "Waiting: X", "Urgent: Y", and "Avg Wait Time".
    * **Reasoning:** Gives the Admin immediate situational awareness without needing to count rows in the table.
* **Inline Action Controls:**
    * **Design:** `[+]`, `[-]`, and `[Discharge]` buttons located directly within the patient row.
    * **Reasoning:** Inline controls reduce the time to manage each row, preventing Admins from selecting the wrong row.

## 4. Layout and Navigation

A. Patient Workflow (The Wizard)
We utilize a **Step-by-Step Wizard** layout to focus the patient's attention on one task at a time.

+---------------------------------------------------------------+
|   Hospital Triage                           [Step 1/2]        |
+---------------------------------------------------------------+
|                                                               |
|   Where does it hurt?                                         |
|   (Select one area)                                           |
|                                                               |
|   +-----------+   +-----------+   +-----------+               |
|   |   (icon)  |   |  (icon)   |   |   (icon)  |               |
|   |   Head    |   |   Chest   |   |   Stomach |               |
|   +-----------+   +-----------+   +-----------+               |
|                                                               |
|   +-----------+   +-----------+   +-----------+               |
|   |   (icon)  |   |  (icon)   |   |  (icon)   |               |
|   |   Limbs   |   |   Skin    |   |   Other   |               |
|   +-----------+   +-----------+   +-----------+               |
|                                                               |
|                                              [ Next -> ]      |
+---------------------------------------------------------------+
+---------------------------------------------------------------+
|   Hospital Triage                           [Step 2/2]        |
+---------------------------------------------------------------+
|                                                               |
|   How severe is the pain?                                     |
|                                                               |
|                        Moderate         Severe                |
|                           |                |                  |
|   [1]-------[3]-----------[5]-------------[8]-----[10]        |
|                                                               |
|   Current Level: 8 - Very High                                |
|   (Slider changes color: Green -> Yellow -> Red)              |
|                                                               |
|   +-------------------------------------------------------+   |
|   |               SUBMIT CHECK-IN                         |   |
|   +-------------------------------------------------------+   |
+---------------------------------------------------------------+

B. Admin Workflow (The Dashboard)
We utilize a Single-View Dashboard layout for maximum data visibility.

+---------------------------------------------------------------+
|  Hospital Triage                Admin: Dr. Who                |
+---------------------------------------------------------------+
|  Stats:  WAITING: 4  |  URGENT: 2  |  AVG WAIT: 12m           |
+---------------------------------------------------------------+
|                                                               |
|  LIVE TRIAGE QUEUE                                            |
|                                                               |
|  +---------------------------------------------------------+  |
|  | #   | Injury  | Pain | Priority | Actions               |  |
|  +-----+---------+------+----------+-----------------------+  |
|  | 104 | CHEST   | 9/10 | [10] HIGH| [-] [+]  [✔ DISCHARGE]| |  <-- Row is Red (based on priority)
|  +---------------------------------------------------------+  |
|  | 102 | LIMBS   | 7/10 | [ 6] MED | [-] [+]  [✔ DISCHARGE]| |  <-- Row is Yellow
|  +---------------------------------------------------------+  |
|  | 105 | SKIN    | 3/10 | [ 3] LOW | [-] [+]  [✔ DISCHARGE]  |  <-- Row is White
|  +---------------------------------------------------------+  |
|                                                               |
+---------------------------------------------------------------+