/**
 * LTI EdTech - Interactive 3D Student Robot Viewer
 * High-Detail Solid 3D Models for Level 1, Level 2, and Level 3 Robotics
 * Powered by Three.js & WebGL
 */

class Robot3DViewer {
  constructor(containerId, options = {}) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!this.container) {
      console.error(`[Robot3DViewer] Container '#${containerId}' not found.`);
      return;
    }

    this.options = Object.assign({
      modelType: 'l1-line-following',
      autoRotate: true,
      wireframe: false,
      explodedProgress: 0,
      backgroundColor: 0x0c0c0e,
      onPartHover: null,
      onPartClick: null
    }, options);

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.robotGroup = null;
    this.parts = [];
    this.animationFrameId = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredPart = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 450;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.options.backgroundColor);
    this.scene.fog = new THREE.FogExp2(this.options.backgroundColor, 0.025);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(4, 3.5, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
      this.controls.minDistance = 2;
      this.controls.maxDistance = 14;
      this.controls.autoRotate = this.options.autoRotate;
      this.controls.autoRotateSpeed = 1.5;
    }

    this.setupLighting();
    this.setupEnvironment();
    this.buildRobotModel(this.options.modelType);

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClick = this.onClick.bind(this);

    window.addEventListener('resize', this.onWindowResize);
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove);
    this.renderer.domElement.addEventListener('click', this.onClick);

    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    const goldRim = new THREE.PointLight(0xFFC928, 1.3, 10);
    goldRim.position.set(-4, 3, -3);
    this.scene.add(goldRim);

    const cyanFill = new THREE.PointLight(0x00d2ff, 0.7, 8);
    cyanFill.position.set(4, 1.5, 4);
    this.scene.add(cyanFill);
  }

  setupEnvironment() {
    const gridHelper = new THREE.GridHelper(14, 28, 0xFFC928, 0x333333);
    gridHelper.position.y = -0.01;
    this.scene.add(gridHelper);

    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  buildRobotModel(type) {
    if (this.robotGroup) {
      this.scene.remove(this.robotGroup);
    }

    this.robotGroup = new THREE.Group();
    this.parts = [];

    // Shared Materials Palette
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xFFC928, metalness: 0.8, roughness: 0.2 });
    const yellowTireMat = new THREE.MeshStandardMaterial({ color: 0xFFCC00, metalness: 0.5, roughness: 0.3 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.95 });
    const darkChassisMat = new THREE.MeshStandardMaterial({ color: 0x18181c, metalness: 0.85, roughness: 0.25 });
    const pcbBlueMat = new THREE.MeshStandardMaterial({ color: 0x0055aa, roughness: 0.3 });
    const pcbRedMat = new THREE.MeshStandardMaterial({ color: 0xaa0000, roughness: 0.3 });
    const pcbGreenMat = new THREE.MeshStandardMaterial({ color: 0x008833, roughness: 0.3 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.15 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const sensorEyesMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });
    const ledBlueMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const sonarWaveMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff, wireframe: true, transparent: true, opacity: 0.6 });

    // Map 15 Presets & Aliases
    switch (type) {
      // LEVEL 1: SENSOR ROBOTICS
      case 'l1-line-following':
      case 'line-follower':
        this.buildL1LineFollower(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat);
        break;
      case 'l1-obstacle-avoiding':
      case 'obstacle-avoiding':
      case 'rover':
        this.buildL1ObstacleAvoider(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, sonarWaveMat);
        break;
      case 'l1-edge-avoiding':
      case 'edge-avoiding':
        this.buildL1EdgeAvoider(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, ledBlueMat);
        break;
      case 'l1-wall-following':
      case 'wall-following':
        this.buildL1WallFollower(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, sonarWaveMat);
        break;
      case 'l1-object-following':
      case 'object-following':
      case 'wall-object-following':
        this.buildL1ObjectFollower(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, sonarWaveMat);
        break;

      // LEVEL 2: BREADBOARD LOGIC & ROBOTICS
      case 'l2-line-following':
        this.buildL2BreadboardLineFollower(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat);
        break;
      case 'l2-obstacle-avoiding':
        this.buildL2BreadboardObstacleAvoider(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, sonarWaveMat);
        break;
      case 'l2-edge-avoiding':
        this.buildL2BreadboardEdgeAvoider(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, ledBlueMat);
        break;
      case 'l2-wall-following':
        this.buildL2BreadboardWallFollower(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, sonarWaveMat);
        break;
      case 'l2-wireless-rc-car':
      case 'wireless-rc-car':
        this.buildL2WirelessRCCar(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat);
        break;

      // LEVEL 3: CODING ROBOTICS WITH ARDUINO
      case 'l3-line-following':
        this.buildL3ArduinoLineFollower(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat);
        break;
      case 'l3-obstacle-avoiding':
        this.buildL3ArduinoObstacleAvoider(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, sonarWaveMat);
        break;
      case 'l3-ir-remote-controlled':
        this.buildL3IRRemoteRobot(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat);
        break;
      case 'l3-bluetooth-controlled':
        this.buildL3BluetoothRobot(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat);
        break;
      case 'l3-line-following-automation':
        this.buildL3AutomationSystem(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat);
        break;

      default:
        this.buildL1LineFollower(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat);
        break;
    }

    this.scene.add(this.robotGroup);

    if (this.options.wireframe) {
      this.setWireframe(true);
    }
  }

  // =========================================================================
  // LEVEL 1: SENSOR ROBOTICS (L293N / L293D DIRECT CONTROLLER)
  // =========================================================================

  // L1-1. LINE FOLLOWING ROBOT
  buildL1LineFollower(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat) {
    const trackGeo = new THREE.RingGeometry(2.4, 2.9, 64);
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.8, side: THREE.DoubleSide });
    const trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.rotation.x = -Math.PI / 2;
    trackMesh.position.y = 0.005;
    this.scene.add(trackMesh);

    // Chassis & Standoffs
    const lowerChassis = this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.6), darkChassisMat, 'Lower Black Acrylic Chassis', '3mm beveled laser-cut black acrylic base plate', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.5, 0));
    const upperChassis = this.createPart(new THREE.BoxGeometry(2.2, 0.08, 3.0), darkChassisMat, 'Upper Electronics Deck', 'Secondary deck plate supporting L293N motor driver', new THREE.Vector3(0, 1.15, 0), new THREE.Vector3(0, 0.5, 0));

    const brassGroup = new THREE.Group();
    [[-0.85, 0.8, -1.2], [0.85, 0.8, -1.2], [-0.85, 0.8, 1.2], [0.85, 0.8, 1.2]].forEach(([px, py, pz]) => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.62, 6), brassMat);
      pillar.position.set(px, py, pz);
      brassGroup.add(pillar);
    });
    this.createPartFromGroup(brassGroup, 'Brass Standoff Pillars', '4x M3 brass hex spacers holding dual chassis decks', new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.8, 1.0));

    // Wheels & Motors
    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);

    // L293N Red Motor Driver Module
    const l293nGroup = new THREE.Group();
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 1.2), new THREE.MeshStandardMaterial({ color: 0xaa0000 }));
    l293nGroup.add(pcb);
    const heatsink = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.4), darkChassisMat);
    heatsink.position.set(0, 0.2, 0);
    l293nGroup.add(heatsink);
    l293nGroup.position.set(0, 1.25, 0);
    this.createPartFromGroup(l293nGroup, 'L293N Dual H-Bridge Motor Driver Module', 'Drives dual DC TT gear motors based on IR sensor inputs', new THREE.Vector3(0, 1.25, 0), new THREE.Vector3(0, 0.7, 0));

    // Front IR Sensor Array (Ground-facing)
    this.buildFrontIRSensorBar(pcbBlueMat, darkChassisMat, metalMat, ledBlueMat, brassMat, 1.62, 0.26);

    // Power Pack
    this.buildBatteryPack(darkChassisMat);
  }

  // L1-2. OBSTACLE AVOIDANCE ROBOT
  buildL1ObstacleAvoider(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, sonarWaveMat) {
    this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.4), darkChassisMat, 'Black Acrylic Chassis', 'Dual-deck robotics base frame', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.4, 0));
    this.createPart(new THREE.BoxGeometry(2.2, 0.08, 2.8), darkChassisMat, 'Upper Deck', 'Control Deck', new THREE.Vector3(0, 1.15, 0), new THREE.Vector3(0, 0.5, 0));

    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);

    // Front HC-SR04 Sonar on Servo Turret
    const sonarGroup = new THREE.Group();
    sonarGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x0033cc }))); // Servo
    const sonarBracket = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.06), pcbBlueMat);
    sonarBracket.position.set(0, 0.3, 0.1);
    sonarGroup.add(sonarBracket);

    const eyeGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.28, 16).rotateX(Math.PI / 2);
    const eye1 = new THREE.Mesh(eyeGeo, sensorEyesMat);
    eye1.position.set(-0.24, 0.3, 0.22);
    const eye2 = new THREE.Mesh(eyeGeo, sensorEyesMat);
    eye2.position.set(0.24, 0.3, 0.22);
    sonarGroup.add(eye1);
    sonarGroup.add(eye2);

    sonarGroup.position.set(0, 1.35, 1.4);
    this.createPartFromGroup(sonarGroup, 'HC-SR04 Sonar Turret on SG90 Servo', 'Scans 180° ahead to detect obstacles and clear paths', new THREE.Vector3(0, 1.35, 1.4), new THREE.Vector3(0, 0.6, 0.8));

    // Target Obstacle Block
    const block = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 1.6), new THREE.MeshStandardMaterial({ color: 0x44444c, roughness: 0.6 }));
    block.position.set(0, 0.9, 4.2);
    this.createPart(block.geometry, block.material, 'Obstacle Barrier Block', 'Physical barrier detected at 20cm distance', new THREE.Vector3(0, 0.9, 4.2), new THREE.Vector3(0, 0, 1.5));
    this.buildBatteryPack(darkChassisMat);
  }

  // L1-3. EDGE AVOIDANCE ROBOT
  buildL1EdgeAvoider(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, ledBlueMat) {
    const table = new THREE.Mesh(new THREE.BoxGeometry(10, 0.6, 6), new THREE.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.3 }));
    table.position.set(0, -0.3, 1.5);
    table.receiveShadow = true;
    this.scene.add(table);

    this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.4), darkChassisMat, 'Black Acrylic Chassis', 'Robotics chassis with cliff brackets', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.4, 0));
    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);

    // Dual Bottom Front Cliff IR Sensors
    [-0.6, 0.6].forEach((x, i) => {
      const irGroup = new THREE.Group();
      irGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.15), pcbBlueMat));
      const beam = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.6, 16).rotateX(Math.PI), new THREE.MeshBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.5, wireframe: true }));
      beam.position.set(0, -0.4, 0);
      irGroup.add(beam);
      irGroup.position.set(x, 0.35, 1.55);
      this.createPartFromGroup(irGroup, `Cliff IR Sensor #${i+1}`, 'Detects table drop-off edge to trigger emergency reverse', new THREE.Vector3(x, 0.35, 1.55), new THREE.Vector3(x * 1.5, -0.3, 0.6));
    });

    this.buildBatteryPack(darkChassisMat);
  }

  // L1-4. WALL FOLLOWING ROBOT
  buildL1WallFollower(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, sonarWaveMat) {
    this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.4), darkChassisMat, '4WD Acrylic Chassis', '4-wheel drive chassis', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.4, 0));
    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);

    // Side-Facing Ultrasonic Sensor
    const sideSonarGroup = new THREE.Group();
    sideSonarGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.06), pcbBlueMat));
    const eyeGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.28, 16).rotateX(Math.PI / 2);
    sideSonarGroup.add(new THREE.Mesh(eyeGeo, sensorEyesMat).translateOnAxis(new THREE.Vector3(-0.22, 0, 0.14), 1));
    sideSonarGroup.add(new THREE.Mesh(eyeGeo, sensorEyesMat).translateOnAxis(new THREE.Vector3(0.22, 0, 0.14), 1));
    sideSonarGroup.rotateY(Math.PI / 2);
    sideSonarGroup.position.set(1.25, 1.25, 0);
    this.createPartFromGroup(sideSonarGroup, 'Side-Facing Wall Distance Sonar', 'Maintains constant 15cm side distance to wall', new THREE.Vector3(1.25, 1.25, 0), new THREE.Vector3(0.8, 0, 0));

    // Side Wall Reference Surface
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.5, 8), new THREE.MeshStandardMaterial({ color: 0x3a3a42, roughness: 0.4 }));
    wall.position.set(3.2, 1.75, 0);
    this.createPart(wall.geometry, wall.material, 'Side Wall Barrier', 'Reference surface for distance tracking', new THREE.Vector3(3.2, 1.75, 0), new THREE.Vector3(1.5, 0, 0));

    this.buildBatteryPack(darkChassisMat);
  }

  // L1-5. OBJECT FOLLOWING ROBOT
  buildL1ObjectFollower(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, sonarWaveMat) {
    this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.4), darkChassisMat, '4WD Acrylic Chassis', '4WD chassis', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.4, 0));
    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);

    // Front Sonar & Object Tracker
    const sonarGroup = new THREE.Group();
    sonarGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.06), pcbBlueMat));
    const eyeGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.28, 16).rotateX(Math.PI / 2);
    sonarGroup.add(new THREE.Mesh(eyeGeo, sensorEyesMat).translateOnAxis(new THREE.Vector3(-0.22, 0, 0.14), 1));
    sonarGroup.add(new THREE.Mesh(eyeGeo, sensorEyesMat).translateOnAxis(new THREE.Vector3(0.22, 0, 0.14), 1));
    sonarGroup.position.set(0, 1.35, 1.4);
    this.createPartFromGroup(sonarGroup, 'Front Object Tracker Sonar', 'Detects and follows target object motion', new THREE.Vector3(0, 1.35, 1.4), new THREE.Vector3(0, 0.6, 0.8));

    // Target Blue Cube Object
    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshStandardMaterial({ color: 0x0066ff, roughness: 0.2 }));
    cube.position.set(0, 0.4, 3.2);
    this.createPart(cube.geometry, cube.material, 'Target Object (Blue Cube)', 'Object tracked by front ultrasonic sensor', new THREE.Vector3(0, 0.4, 3.2), new THREE.Vector3(0, 0, 1.2));

    this.buildBatteryPack(darkChassisMat);
  }

  // =========================================================================
  // LEVEL 2: BREADBOARD LOGIC & ROBOTICS (FULL SOLDERLESS BREADBOARD + ICs)
  // =========================================================================

  // L2-1. LINE FOLLOWING ROBOT (BREADBOARD BUILD)
  buildL2BreadboardLineFollower(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat) {
    this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.6), darkChassisMat, 'Lower Black Acrylic Chassis', 'Chassis base plate', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.5, 0));
    this.createPart(new THREE.BoxGeometry(2.2, 0.08, 3.0), darkChassisMat, 'Upper Deck', 'Breadboard deck', new THREE.Vector3(0, 1.15, 0), new THREE.Vector3(0, 0.5, 0));

    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);

    // Full-Size White Solderless Breadboard
    this.buildSolderlessBreadboard(darkChassisMat, pcbBlueMat, metalMat, true);

    // Front IR Sensor Array
    this.buildFrontIRSensorBar(pcbBlueMat, darkChassisMat, metalMat, ledBlueMat, brassMat, 1.62, 0.26);
    this.buildBatteryPack(darkChassisMat);
  }

  // L2-2. OBSTACLE AVOIDANCE ROBOT (BREADBOARD BUILD)
  buildL2BreadboardObstacleAvoider(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, sonarWaveMat) {
    this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.4), darkChassisMat, 'Black Acrylic Chassis', 'Chassis base', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.4, 0));
    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);
    this.buildSolderlessBreadboard(darkChassisMat, pcbBlueMat, metalMat, false);

    // Front Sonar
    const sonarGroup = new THREE.Group();
    sonarGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.06), pcbBlueMat));
    const eyeGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.28, 16).rotateX(Math.PI / 2);
    sonarGroup.add(new THREE.Mesh(eyeGeo, sensorEyesMat).translateOnAxis(new THREE.Vector3(-0.22, 0, 0.14), 1));
    sonarGroup.add(new THREE.Mesh(eyeGeo, sensorEyesMat).translateOnAxis(new THREE.Vector3(0.22, 0, 0.14), 1));
    sonarGroup.position.set(0, 1.35, 1.4);
    this.createPartFromGroup(sonarGroup, 'HC-SR04 Sonar on Breadboard Logic', 'Ultrasonic sensor wired into breadboard 7404 logic IC', new THREE.Vector3(0, 1.35, 1.4), new THREE.Vector3(0, 0.6, 0.8));

    this.buildBatteryPack(darkChassisMat);
  }

  // L2-3. EDGE AVOIDANCE ROBOT (BREADBOARD BUILD)
  buildL2BreadboardEdgeAvoider(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, ledBlueMat) {
    this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.4), darkChassisMat, 'Black Acrylic Chassis', 'Chassis base', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.4, 0));
    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);
    this.buildSolderlessBreadboard(darkChassisMat, pcbBlueMat, metalMat, true);

    [-0.6, 0.6].forEach((x, i) => {
      const irGroup = new THREE.Group();
      irGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.15), pcbBlueMat));
      irGroup.position.set(x, 0.35, 1.55);
      this.createPartFromGroup(irGroup, `Discrete Cliff IR Sensor #${i+1}`, 'Discrete IR sensor circuit wired to breadboard ICs', new THREE.Vector3(x, 0.35, 1.55), new THREE.Vector3(x * 1.5, -0.3, 0.6));
    });

    this.buildBatteryPack(darkChassisMat);
  }

  // L2-4. WALL FOLLOWING ROBOT (BREADBOARD BUILD)
  buildL2BreadboardWallFollower(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, sonarWaveMat) {
    this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.4), darkChassisMat, 'Black Acrylic Chassis', 'Chassis base', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.4, 0));
    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);
    this.buildSolderlessBreadboard(darkChassisMat, pcbBlueMat, metalMat, false);

    const sideSonarGroup = new THREE.Group();
    sideSonarGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.06), pcbBlueMat));
    const eyeGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.28, 16).rotateX(Math.PI / 2);
    sideSonarGroup.add(new THREE.Mesh(eyeGeo, sensorEyesMat).translateOnAxis(new THREE.Vector3(-0.22, 0, 0.14), 1));
    sideSonarGroup.add(new THREE.Mesh(eyeGeo, sensorEyesMat).translateOnAxis(new THREE.Vector3(0.22, 0, 0.14), 1));
    sideSonarGroup.rotateY(Math.PI / 2);
    sideSonarGroup.position.set(1.25, 1.25, 0);
    this.createPartFromGroup(sideSonarGroup, 'Side-Facing Wall Distance Sonar', 'Wired into breadboard IC logic for wall distance control', new THREE.Vector3(1.25, 1.25, 0), new THREE.Vector3(0.8, 0, 0));

    this.buildBatteryPack(darkChassisMat);
  }

  // L2-5. WIRELESS REMOTE CONTROL CAR (433MHz RF & HT12E/HT12D)
  buildL2WirelessRCCar(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat) {
    this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.4), darkChassisMat, 'Breadboard RC Car Chassis', 'Dual-deck chassis with L293D & HT12D decoder IC', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.4, 0));
    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);

    // Breadboard with HT12D & 433MHz Receiver
    this.buildSolderlessBreadboard(darkChassisMat, pcbBlueMat, metalMat, false);

    // 433MHz RF Receiver Antenna Whip on Car
    const antennaWhip = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8), metalMat);
    antennaWhip.position.set(0.2, 1.85, 0.9);
    this.createPart(antennaWhip.geometry, metalMat, '433MHz RF Antenna Whip', 'Receives 433MHz wireless remote control signals', new THREE.Vector3(0.2, 1.85, 0.9), new THREE.Vector3(0, 0.6, 0));

    // Separate Handheld 433MHz RF Remote Controller Unit
    const remoteGroup = new THREE.Group();
    const remoteBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 2.0), darkChassisMat);
    remoteGroup.add(remoteBody);

    const btnMat = new THREE.MeshStandardMaterial({ color: 0xFFC928 });
    [[-0.3, 0.2, 0.4], [0.3, 0.2, 0.4], [-0.3, 0.2, -0.4], [0.3, 0.2, -0.4]].forEach(([bx, by, bz]) => {
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 12), btnMat);
      btn.position.set(bx, by, bz);
      remoteGroup.add(btn);
    });

    const rAntenna = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8), metalMat);
    rAntenna.position.set(0.45, 0.8, -0.8);
    remoteGroup.add(rAntenna);

    remoteGroup.position.set(-2.8, 0.6, 0);
    this.createPartFromGroup(remoteGroup, '433MHz RF Wireless Remote Controller (HT12E)', 'Handheld 4-button wireless transmitter giving manual RC driving control', new THREE.Vector3(-2.8, 0.6, 0), new THREE.Vector3(-1.2, 0.3, 0));

    this.buildBatteryPack(darkChassisMat);
  }

  // =========================================================================
  // LEVEL 3: CODING ROBOTICS WITH ARDUINO (ARDUINO UNO R3 MCU)
  // =========================================================================

  // L3-1. ARDUINO LINE FOLLOWING ROBOT
  buildL3ArduinoLineFollower(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat) {
    this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.6), darkChassisMat, 'Lower Black Acrylic Chassis', 'Chassis base plate', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.5, 0));
    this.createPart(new THREE.BoxGeometry(2.2, 0.08, 3.0), darkChassisMat, 'Upper Electronics Deck', 'Deck plate supporting Arduino Uno MCU', new THREE.Vector3(0, 1.15, 0), new THREE.Vector3(0, 0.5, 0));

    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);
    this.buildArduinoUnoR3Board(pcbBlueMat, darkChassisMat, metalMat);
    this.buildL293DShield(pcbBlueMat, darkChassisMat, metalMat);
    this.buildFrontIRSensorBar(pcbBlueMat, darkChassisMat, metalMat, ledBlueMat, brassMat, 1.62, 0.26);
    this.buildBatteryPack(darkChassisMat);
  }

  // L3-2. ARDUINO OBSTACLE AVOIDANCE ROBOT
  buildL3ArduinoObstacleAvoider(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, sensorEyesMat, sonarWaveMat) {
    this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.4), darkChassisMat, 'Black Acrylic Chassis', 'Chassis base', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.4, 0));
    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);
    this.buildArduinoUnoR3Board(pcbBlueMat, darkChassisMat, metalMat);

    const sonarGroup = new THREE.Group();
    sonarGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x0033cc }))); // Servo
    const sonarBracket = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.06), pcbBlueMat);
    sonarBracket.position.set(0, 0.3, 0.1);
    sonarGroup.add(sonarBracket);

    const eyeGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.28, 16).rotateX(Math.PI / 2);
    sonarGroup.add(new THREE.Mesh(eyeGeo, sensorEyesMat).translateOnAxis(new THREE.Vector3(-0.24, 0.3, 0.22), 1));
    sonarGroup.add(new THREE.Mesh(eyeGeo, sensorEyesMat).translateOnAxis(new THREE.Vector3(0.24, 0.3, 0.22), 1));

    sonarGroup.position.set(0, 1.35, 1.4);
    this.createPartFromGroup(sonarGroup, 'HC-SR04 Sonar Turret on Servo', 'Arduino C++ controlled 180° obstacle scanner', new THREE.Vector3(0, 1.35, 1.4), new THREE.Vector3(0, 0.6, 0.8));

    this.buildBatteryPack(darkChassisMat);
  }

  // L3-3. IR REMOTE CONTROLLED ROBOT
  buildL3IRRemoteRobot(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat) {
    this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.4), darkChassisMat, 'Black Acrylic Chassis', 'Chassis base', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.4, 0));
    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);
    this.buildArduinoUnoR3Board(pcbBlueMat, darkChassisMat, metalMat);

    // TSOP1838 IR Receiver Sensor Module
    const irRxGroup = new THREE.Group();
    const rxPcb = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.4), pcbBlueMat);
    irRxGroup.add(rxPcb);
    const tsopCap = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.15), metalMat);
    tsopCap.position.set(0, 0.15, 0);
    irRxGroup.add(tsopCap);
    irRxGroup.position.set(0, 1.45, 1.2);
    this.createPartFromGroup(irRxGroup, 'TSOP1838 38kHz IR Receiver Module', 'Decodes NEC protocol infrared pulses from remote controller', new THREE.Vector3(0, 1.45, 1.2), new THREE.Vector3(0, 0.6, 0));

    // Handheld Mini IR Remote Controller Keyfob
    const keyfobGroup = new THREE.Group();
    const keyfobBody = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.2, 1.8), darkChassisMat);
    keyfobGroup.add(keyfobBody);

    const redLed = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    redLed.position.set(0, 0, -0.9);
    keyfobGroup.add(redLed);

    const btnMat = new THREE.MeshStandardMaterial({ color: 0xFFC928 });
    [[-0.25, 0.12, 0.2], [0.25, 0.12, 0.2], [-0.25, 0.12, -0.2], [0.25, 0.12, -0.2]].forEach(([bx, by, bz]) => {
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.08, 12), btnMat);
      btn.position.set(bx, by, bz);
      keyfobGroup.add(btn);
    });

    keyfobGroup.position.set(-2.6, 0.5, 0);
    this.createPartFromGroup(keyfobGroup, 'Handheld IR Remote Keyfob', 'Infrared remote control sending NEC protocol driving commands', new THREE.Vector3(-2.6, 0.5, 0), new THREE.Vector3(-1.0, 0.3, 0));

    this.buildBatteryPack(darkChassisMat);
  }

  // L3-4. BLUETOOTH CONTROLLED ROBOT
  buildL3BluetoothRobot(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat) {
    this.createPart(new THREE.BoxGeometry(2.4, 0.08, 3.4), darkChassisMat, '4WD Acrylic Chassis', 'Chassis base', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.4, 0));
    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);
    this.buildArduinoUnoR3Board(pcbBlueMat, darkChassisMat, metalMat);

    // HC-05 Bluetooth Transceiver Module
    const btGroup = new THREE.Group();
    const btPcb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 1.1), pcbBlueMat);
    btGroup.add(btPcb);
    const btChip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.4), darkChassisMat);
    btChip.position.set(0, 0.08, 0);
    btGroup.add(btChip);
    const btLed = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), ledBlueMat);
    btLed.position.set(-0.15, 0.08, -0.45);
    btGroup.add(btLed);
    btGroup.position.set(-0.5, 1.45, 0.5);
    this.createPartFromGroup(btGroup, 'HC-05 Bluetooth Serial Module', 'Establishes 2.4GHz wireless serial link with Android/iOS smartphone app', new THREE.Vector3(-0.5, 1.45, 0.5), new THREE.Vector3(-0.6, 0.6, 0));

    // Smartphone Joystick Display
    const phoneGroup = new THREE.Group();
    const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 2.2), darkChassisMat);
    phoneGroup.add(phoneBody);
    const phoneScreen = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.02, 2.0), new THREE.MeshBasicMaterial({ color: 0x004488 }));
    phoneScreen.position.set(0, 0.09, 0);
    phoneGroup.add(phoneScreen);
    const joystickDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.04, 24), new THREE.MeshBasicMaterial({ color: 0xFFC928 }));
    joystickDisc.position.set(0, 0.12, 0.3);
    phoneGroup.add(joystickDisc);

    phoneGroup.position.set(-2.8, 0.5, 0);
    this.createPartFromGroup(phoneGroup, 'Smartphone Touch Joystick App', 'Runs custom mobile app sending Bluetooth directional serial strings', new THREE.Vector3(-2.8, 0.5, 0), new THREE.Vector3(-1.2, 0.3, 0));

    this.buildBatteryPack(darkChassisMat);
  }

  // L3-5. LINE-FOLLOWING AUTOMATION SYSTEM (INDUSTRIAL)
  buildL3AutomationSystem(goldMat, yellowTireMat, rubberMat, darkChassisMat, pcbBlueMat, metalMat, brassMat, ledBlueMat) {
    this.createPart(new THREE.BoxGeometry(2.6, 0.1, 3.8), darkChassisMat, 'Industrial Heavy Duty Chassis', 'Reinforced dual-tier chassis', new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0, -0.5, 0));
    this.build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat);
    this.buildArduinoUnoR3Board(pcbBlueMat, darkChassisMat, metalMat);

    // OLED Status Screen & Dual Wheel Encoder Disks
    const oledGroup = new THREE.Group();
    const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.7), pcbBlueMat);
    oledGroup.add(screenFrame);
    const screenGlass = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.02, 0.45), new THREE.MeshBasicMaterial({ color: 0x00ffcc }));
    screenGlass.position.set(0, 0.05, 0);
    oledGroup.add(screenGlass);
    oledGroup.position.set(0, 1.45, -0.5);
    this.createPartFromGroup(oledGroup, '0.96 inch I2C OLED Telemetry Display', 'Displays real-time sensor speed & track alignment data', new THREE.Vector3(0, 1.45, -0.5), new THREE.Vector3(0, 0.6, -0.4));

    this.buildFrontIRSensorBar(pcbBlueMat, darkChassisMat, metalMat, ledBlueMat, brassMat, 1.72, 0.26);
    this.buildBatteryPack(darkChassisMat);
  }

  // =========================================================================
  // COMMON COMPONENT BUILDERS (REUSABLE HIGH-DETAIL PARTS)
  // =========================================================================

  build4WDYellowWheels(yellowTireMat, rubberMat, metalMat, darkChassisMat) {
    const wheelsGroup = new THREE.Group();
    [[-1.4, 0.45, 1.0], [1.4, 0.45, 1.0], [-1.4, 0.45, -1.0], [1.4, 0.45, -1.0]].forEach(([wx, wy, wz]) => {
      const singleWheel = new THREE.Group();
      
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.36, 32).rotateZ(Math.PI / 2), rubberMat);
      singleWheel.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.38, 16).rotateZ(Math.PI / 2), yellowTireMat);
      singleWheel.add(rim);

      for (let s = 0; s < 5; s++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 0.39), yellowTireMat);
        spoke.rotation.x = (s * Math.PI * 2) / 5;
        singleWheel.add(spoke);
      }

      const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.42, 12).rotateZ(Math.PI / 2), metalMat);
      singleWheel.add(axle);

      singleWheel.position.set(wx, wy, wz);
      wheelsGroup.add(singleWheel);
    });
    this.createPartFromGroup(wheelsGroup, '4WD Yellow 5-Spoke Wheels & TT Motors', '65mm all-terrain rubber tires with yellow 5-spoke rims', new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.2, 0, 0));
  }

  buildArduinoUnoR3Board(pcbBlueMat, darkChassisMat, metalMat) {
    const arduinoGroup = new THREE.Group();
    arduinoGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.06, 1.7), pcbBlueMat));
    arduinoGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.09, 0.85), darkChassisMat).translateOnAxis(new THREE.Vector3(0.1, 0.08, 0.1), 1));
    arduinoGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.38), metalMat).translateOnAxis(new THREE.Vector3(-0.38, 0.13, -0.62), 1));
    arduinoGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.4), darkChassisMat).translateOnAxis(new THREE.Vector3(0.35, 0.13, -0.62), 1));
    arduinoGroup.position.set(0, 1.24, 0.1);
    this.createPartFromGroup(arduinoGroup, 'Arduino Uno R3 Microcontroller', 'ATmega328P core board running main C++ firmware', new THREE.Vector3(0, 1.24, 0.1), new THREE.Vector3(0, 0.8, 0));
  }

  buildL293DShield(pcbBlueMat, darkChassisMat, metalMat) {
    const l293dGroup = new THREE.Group();
    l293dGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 1.2), pcbBlueMat));
    const heatsink = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.28, 0.45), darkChassisMat);
    heatsink.position.set(0, 0.17, -0.1);
    l293dGroup.add(heatsink);
    l293dGroup.position.set(0, 1.34, 0.1);
    this.createPartFromGroup(l293dGroup, 'L293D Motor Driver Shield with Heatsink', 'High-current dual H-bridge motor driver with cooling heatsink & green screw terminals', new THREE.Vector3(0, 1.34, 0.1), new THREE.Vector3(0, 0.7, -0.6));
  }

  buildSolderlessBreadboard(darkChassisMat, pcbBlueMat, metalMat, includeLogicICs) {
    const bbGroup = new THREE.Group();
    const bbMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f5, roughness: 0.8 });
    bbGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 2.2), bbMat));

    if (includeLogicICs) {
      const ic1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.6), darkChassisMat);
      ic1.position.set(-0.3, 0.08, -0.3);
      bbGroup.add(ic1);

      const ic2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.6), darkChassisMat);
      ic2.position.set(0.3, 0.08, 0.3);
      bbGroup.add(ic2);
    }

    bbGroup.position.set(0, 1.25, 0);
    this.createPartFromGroup(bbGroup, 'Full-Size Solderless Breadboard & Logic ICs', 'Prototyping breadboard with IC 7404 (NOT Gate), IC 7400 (NAND Gate) & L293D IC', new THREE.Vector3(0, 1.25, 0), new THREE.Vector3(0, 0.7, 0));
  }

  buildFrontIRSensorBar(pcbBlueMat, darkChassisMat, metalMat, ledBlueMat, brassMat, barZ, pcbY) {
    const irGroup = new THREE.Group();
    const irPcb = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.26, 0.08), pcbBlueMat);
    irGroup.add(irPcb);

    [-0.52, -0.17, 0.17, 0.52].forEach((pos) => {
      const irHousing = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.18), darkChassisMat);
      irHousing.position.set(pos, -0.06, 0.08);
      irGroup.add(irHousing);

      const emitter = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), metalMat);
      emitter.position.set(pos - 0.04, -0.16, 0.1);
      irGroup.add(emitter);

      const receiver = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), darkChassisMat);
      receiver.position.set(pos + 0.04, -0.16, 0.1);
      irGroup.add(receiver);

      const blueLed = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), ledBlueMat);
      blueLed.position.set(pos, 0.11, 0.06);
      irGroup.add(blueLed);
    });

    irGroup.position.set(0, pcbY, barZ);
    this.createPartFromGroup(irGroup, '4-Channel IR Line Sensor Array', 'TCRT5000 infrared sensor array for high-speed track edge detection with status LEDs', new THREE.Vector3(0, pcbY, barZ), new THREE.Vector3(0, -0.3, 0.8));
  }

  buildBatteryPack(darkChassisMat) {
    const batGroup = new THREE.Group();
    const batBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 1.5), darkChassisMat);
    batGroup.add(batBox);

    const pWire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8).rotateZ(Math.PI / 4), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    pWire1.position.set(-0.4, 0.25, -0.6);
    batGroup.add(pWire1);

    const pWire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8).rotateZ(Math.PI / 4), new THREE.MeshBasicMaterial({ color: 0x111111 }));
    pWire2.position.set(-0.3, 0.25, -0.6);
    batGroup.add(pWire2);

    batGroup.position.set(0, 0.72, -0.7);
    this.createPartFromGroup(batGroup, '7.4V Dual 18650 Battery Pack', 'Rechargeable power supply for motors and electronics', new THREE.Vector3(0, 0.72, -0.7), new THREE.Vector3(0, 0.4, -0.8));
  }

  // Helpers to register parts
  createPart(geometry, material, name, description, origPos, explodeOffset) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(origPos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.userData = {
      name,
      description,
      origPos: origPos.clone(),
      explodeOffset: explodeOffset.clone(),
      originalMaterial: material
    };

    this.robotGroup.add(mesh);
    this.parts.push(mesh);
    return mesh;
  }

  createPartFromGroup(group, name, description, origPos, explodeOffset) {
    group.position.copy(origPos);
    group.userData = {
      name,
      description,
      origPos: origPos.clone(),
      explodeOffset: explodeOffset.clone()
    };

    group.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.userData = group.userData;
      }
    });

    this.robotGroup.add(group);
    this.parts.push(group);
    return group;
  }

  setWireframe(enabled) {
    this.options.wireframe = enabled;
    if (!this.robotGroup) return;

    this.robotGroup.traverse((child) => {
      if (child.isMesh) {
        if (enabled) {
          child.material = new THREE.MeshBasicMaterial({ color: 0xFFC928, wireframe: true });
        } else {
          child.material = child.userData.originalMaterial || child.material;
        }
      }
    });
  }

  setExplodedView(progress) {
    this.options.explodedProgress = progress;
    if (!this.parts) return;

    this.parts.forEach((part) => {
      const orig = part.userData.origPos;
      const offset = part.userData.explodeOffset;
      if (orig && offset) {
        part.position.x = orig.x + offset.x * progress;
        part.position.y = orig.y + offset.y * progress;
        part.position.z = orig.z + offset.z * progress;
      }
    });
  }

  setAutoRotate(enabled) {
    this.options.autoRotate = enabled;
    if (this.controls) {
      this.controls.autoRotate = enabled;
    }
  }

  resetCamera() {
    this.camera.position.set(4, 3.5, 5);
    if (this.controls) {
      this.controls.target.set(0, 1, 0);
      this.controls.update();
    }
  }

  onMouseMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.robotGroup.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      const data = object.userData;

      if (data && data.name) {
        this.container.style.cursor = 'pointer';
        if (this.hoveredPart !== data.name) {
          this.hoveredPart = data.name;
          if (typeof this.options.onPartHover === 'function') {
            this.options.onPartHover(data);
          }
        }
        return;
      }
    }

    this.container.style.cursor = 'default';
    if (this.hoveredPart !== null) {
      this.hoveredPart = null;
      if (typeof this.options.onPartHover === 'function') {
        this.options.onPartHover(null);
      }
    }
  }

  onClick(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.robotGroup.children, true);

    if (intersects.length > 0) {
      const data = intersects[0].object.userData;
      if (data && data.name && typeof this.options.onPartClick === 'function') {
        this.options.onPartClick(data);
      }
    }
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (this.controls) {
      this.controls.update();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove);
      this.renderer.domElement.removeEventListener('click', this.onClick);
      this.renderer.dispose();
    }
  }
}

window.Robot3DViewer = Robot3DViewer;
