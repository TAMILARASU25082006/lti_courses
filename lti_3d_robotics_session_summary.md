# LTI Courses - Interactive 3D Student Robotics Session Summary

## 📌 Project Overview & Repository
- **GitHub Repository**: [https://github.com/TAMILARASU25082006/lti_courses.git](https://github.com/TAMILARASU25082006/lti_courses.git)
- **Git Branch**: `main`
- **Latest Commit**: `22affe1` (*Add high-detail 3D student robot models for Level 1, Level 2, and Level 3*)
- **Local Host URL**: [http://localhost:5000](http://localhost:5000)
- **Admin Account**: `admin@lticourses.com` / `AdminPassword123!`

---

## 🤖 Integrated 3D Robot Viewer System Architecture

### 1. 3D Model Renderer (`public/js/robot3dViewer.js`)
- Powered by **Three.js** and **WebGL**.
- Renders solid, high-detail 3D geometry for **15 distinct student robot presets**.
- Features:
  - **360° Free Orbit Rotation** (mouse/touch drag)
  - **Zoom In / Out** (scroll / pinch)
  - **Exploded Assembly View (0-100% Slider)**: Separates chassis plates, motors, sensors, microcontrollers, and wiring harness in 3D space.
  - **Wireframe / X-Ray Mode Toggle** (OFF by default for solid shaded render)
  - **Auto-Spin Mode Toggle** & **Reset View Camera**
  - **Part Hover & Raycasting**: Displays part name & function tooltips on hover/click.

### 2. Interactive Modal Component (`views/partials/robot3dModal.ejs`)
- Fullscreen/popup modal containing the WebGL 3D Canvas, Model Preset Selector, Physical Build Photo Thumbnail, Exploded Slider, Wireframe/Auto-Spin controls, and Hardware Specifications Panel.

### 3. Database & Seeding Schema (`models/Project.js` & `utils/seedDataHelper.js`)
- Extended `Project` schema with `has3DModel`, `model3DType`, `studentAuthor`, and `modelSpecs`.
- Auto-seeds all student robotics projects with photos, specs, and 3D preset configurations.

---

## 📚 Complete List of 15 Student Robot Presets (Levels 1 - 3)

### **LEVEL 1 — SENSOR ROBOTICS (L293N/L293D)**
1. `l1-line-following`: 4-wheel black acrylic chassis, DC motors, L293N driver, front TCRT5000 IR sensor array close to ground with cyan optical rays.
2. `l1-obstacle-avoiding`: 4-wheel chassis, L293N driver, front HC-SR04 ultrasonic sonar on SG90 servo turret + obstacle block target.
3. `l1-edge-avoiding`: 4-wheel chassis, L293N driver, top sonar, dual downward cliff IR sensors + table platform edge.
4. `l1-wall-following`: 4-wheel chassis, L293N driver, side-facing HC-SR04 ultrasonic sonar sensor + side wall barrier reference.
5. `l1-object-following`: 4-wheel chassis, L293N driver, front HC-SR04 sonar + IR object tracker + target blue cube.

### **LEVEL 2 — BREADBOARD LOGIC & ROBOTICS**
6. `l2-line-following`: Full-size white solderless breadboard clearly mounted on top deck, discrete IR circuit, L293D motor driver IC, 7404 NOT IC, 7400 NAND IC, resistors, jumper wires, front IR sensor array.
7. `l2-obstacle-avoiding`: White solderless breadboard, 7404 logic IC, L293D IC, HC-SR04 ultrasonic sonar, jumper wires, obstacle block.
8. `l2-edge-avoiding`: White solderless breadboard, discrete IR edge detector circuit, L293D IC, bottom cliff IR sensors, table platform.
9. `l2-wall-following`: White solderless breadboard, logic ICs, L293D IC, side-facing HC-SR04 ultrasonic sonar, side wall barrier.
10. `l2-wireless-rc-car`: 4WD chassis, solderless breadboard, HT12D decoder IC, L293D IC, 433MHz RF receiver module with antenna whip + **Handheld 433MHz RF Remote Controller Unit** beside the car with joysticks, 4 buttons, antenna.

### **LEVEL 3 — CODING ROBOTICS WITH ARDUINO**
11. `l3-line-following`: Deep blue Arduino Uno R3 board (ATmega328P DIP chip, USB Type-B port, DC jack, headers, crystal), L293D shield with heatsink & green terminals, front 4-channel IR sensor array, rainbow wiring harness.
12. `l3-obstacle-avoiding`: Arduino Uno R3 board, L293D shield, front HC-SR04 ultrasonic sonar mounted on SG90 servo turret with 180° scanning.
13. `l3-ir-remote-controlled`: Arduino Uno R3 board, L293D shield, TSOP1838 IR sensor module with metal shield + **Handheld IR Keyfob Remote Controller** with directional buttons & red IR emitter bulb.
14. `l3-bluetooth-controlled`: Arduino Uno R3 board, L293D shield, HC-05 Bluetooth transceiver module + **Smartphone Controller Display** showing digital touch joystick.
15. `l3-line-following-automation`: Advanced 4WD heavy industrial chassis, Arduino Uno R3 board, L293D shield, 5-channel precision IR sensor array, dual optical wheel encoder disks, mini OLED status screen, industrial wiring loom.

---

## 🖼️ Physical Student Build Reference Images
- `public/images/line_follower_robot.jpg`
- `public/images/obstacle_avoiding_robot.jpg`
- `public/images/edge_avoiding_robot.jpg`
- `public/images/wall_object_following_robot.jpg`

---

## 💡 How to Use This Summary in a New Chat or Export as PDF
1. **To Feed into a New AI Chat**: Copy & paste this text file or upload `lti_3d_robotics_session_summary.md` into your prompt window.
2. **To Save as PDF**: Open `lti_3d_robotics_session_summary.md` in VS Code / Markdown viewer and click **Print to PDF** or **Export as PDF**.
