**System Directive: 3D Interactive Vertical Timeline Webpage Generation**
**Objective:** Construct a responsive, single-file HTML/CSS webpage displaying an elegant, interactive vertical timeline for the "GulfCast 2024" conference planning schedule.

**Design Architecture & 3D Styling:**
1.  **Layout:** A central vertical axis line. Event nodes alternate left and right. On mobile (< 768px), collapse to a single-sided layout.
2.  **3D Depth & Elegance:** The page must feel tactile. Apply a `perspective` property to the main timeline container. Cards must appear to float above the background page using layered `box-shadow` properties (e.g., a soft ambient shadow combined with a sharper, directional drop shadow).
3.  **Interactive Cards:** Cards must have a smooth hover state (`transition: all 0.3s ease`) that physically lifts them closer to the user (e.g., `transform: translateY(-8px) scale(1.02)`) and deepens the shadow spread to enhance the 3D illusion.
4.  **Aesthetic:** Modern, sleek dark mode theme (e.g., deep charcoal background) so the floating cards and their colored frames pop cleanly.

**Data Payload & Native Color Mapping:**
Each card must feature a distinct structural frame (e.g., a thick left border or a full glowing border) corresponding to the original PDF's visual grammar.

* **Sept 2023:** First Meeting at ALBA.
    * *Frame Color:* Red (`#ef4444`)
* **Oct 15, 2023:** Finalizing the list of invitees.
    * *Frame Color:* Bright Blue (`#3b82f6`)
* **Oct 23, 2023:** Finalize the program and decision concerning Conference Fee.
    * *Frame Color:* Yellow (`#eab308`)
* **Oct 30, 2023:** Send invitations.
    * *Frame Color:* Bright Blue (`#3b82f6`)
* **Dec 15, 2023:** Registration deadline.
    * *Frame Color:* Dark Blue (`#1d4ed8`)
* **Feb 10, 2024:** Deadline for presentations.
    * *Frame Color:* Dark Blue (`#1d4ed8`)
* **March 2024:** GulfCast Conference (date to be decided).
    * *Frame Color:* Red (`#ef4444`)
* **April 2024:** Post Conference Work - Prepare post conf. greeting.
    * *Frame Color:* Red (`#ef4444`)

**Execution:** Output strictly pure, functional code (HTML with embedded CSS). Zero conversational filler. Generate the `index.html` file immediately.