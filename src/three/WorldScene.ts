import * as THREE from 'three';
import { IslandBuilder, LIGHT_THEME_COLORS, DARK_THEME_COLORS } from './IslandBuilder';

export interface StationCameraPoint {
  camPos: THREE.Vector3;
  targetPos: THREE.Vector3;
}

export class WorldScene {
  public container: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public islandBuilder: IslandBuilder;

  // Camera track spline curves
  private cameraSpline: THREE.CatmullRomCurve3;
  private targetSpline: THREE.CatmullRomCurve3;

  // Interaction & camera control
  public progress: number = 0; // 0.0 to 1.0
  public targetProgress: number = 0;
  public isFreeCamera: boolean = false;
  private freeOrbitAngles = { theta: 0.8, phi: 0.95, radius: 45 };
  private freeOrbitCenter = new THREE.Vector3(5, 4, 0);

  // Parallax
  public mouseNorm = { x: 0, y: 0 };
  public targetMouseNorm = { x: 0, y: 0 };

  // Theme
  public isDarkMode: boolean = false;
  private currentThemeLerp: number = 0; // 0 = light, 1 = dark
  private targetThemeLerp: number = 0;

  // Lighting
  private dirLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private campfireLight: THREE.PointLight;

  // Dynamic sky & water
  private oceanData: { mesh: THREE.Mesh; update: (time: number) => void } | null = null;
  private skyElements: { group: THREE.Group; clouds: THREE.Mesh[]; balloon: THREE.Group; plane: THREE.Group } | null = null;
  private starsParticles: THREE.Points | null = null;
  private firefliesParticles: THREE.Points | null = null;

  // Physics playground items
  private physicsObjects: { mesh: THREE.Mesh; velY: number; velX: number; velZ: number; rotVel: THREE.Vector3 }[] = [];

  // Animation frame
  private animationId: number = 0;
  private clock = new THREE.Clock();
  private raycaster = new THREE.Raycaster();
  private mouseVec = new THREE.Vector2();

  // Callbacks to UI
  public onStationChange?: (index: number) => void;
  public onObjectClick?: (type: string, id?: string) => void;
  private lastStationIndex: number = -1;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();

    // 1. Perspective Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 300);
    this.camera.position.set(-30, 6.0, 22);

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // 3. Fog & Background
    this.scene.background = new THREE.Color(LIGHT_THEME_COLORS.sky);
    this.scene.fog = new THREE.FogExp2(LIGHT_THEME_COLORS.fog, 0.012);

    // 4. Lighting
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.1);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xfff5e6, 1.6);
    this.dirLight.position.set(40, 50, 30);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 150;
    const d = 45;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // Cozy Campfire Light
    this.campfireLight = new THREE.PointLight(0xff7722, 1.8, 12);
    this.campfireLight.position.set(25.5, 4.6, 7.5);
    this.scene.add(this.campfireLight);

    // 5. Build Island and Environment
    this.islandBuilder = new IslandBuilder();
    const archipelago = this.islandBuilder.buildArchipelago();
    this.scene.add(archipelago);

    // Ocean Surface
    this.oceanData = this.islandBuilder.buildOceanSurface();
    this.scene.add(this.oceanData.mesh);

    // Sky Elements
    this.skyElements = this.islandBuilder.buildSkyElements();
    this.scene.add(this.skyElements.group);

    // Particles (Stars & Fireflies)
    this.initParticles();

    // 6. Camera Splines (6 story stations along the archipelago)
    const camPoints = [
      new THREE.Vector3(-31, 5.2, 22), // 0: Genesis Pier
      new THREE.Vector3(-16, 7.0, 7),  // 1: Workshop
      new THREE.Vector3(-2, 7.8, 22),  // 2: Project Gallery
      new THREE.Vector3(12, 9.4, 7),   // 3: Observatory
      new THREE.Vector3(25, 7.8, 21),  // 4: Campfire
      new THREE.Vector3(38, 12.5, 12), // 5: Beacon Lighthouse
    ];

    const targetPoints = [
      new THREE.Vector3(-30, 2.4, 6),  // Look at Pier
      new THREE.Vector3(-16, 3.2, -7), // Look at Workshop studio
      new THREE.Vector3(-2, 3.6, 8),   // Look at Project gallery
      new THREE.Vector3(12, 5.0, -6),  // Look at Observatory
      new THREE.Vector3(25, 4.4, 7),   // Look at Campfire
      new THREE.Vector3(38, 8.0, -4),  // Look at Lighthouse
    ];

    this.cameraSpline = new THREE.CatmullRomCurve3(camPoints, false, 'centripetal', 0.5);
    this.targetSpline = new THREE.CatmullRomCurve3(targetPoints, false, 'centripetal', 0.5);

    // Start loop
    this.startAnimation();
  }

  private initParticles() {
    // 1. Starfield Particles (visible mainly in dark mode)
    const starCount = 650;
    const starGeom = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 160;
      starPos[i + 1] = 12 + Math.random() * 45;
      starPos[i + 2] = (Math.random() - 0.5) * 160;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.05, // starts dim in light mode
    });
    this.starsParticles = new THREE.Points(starGeom, starMat);
    this.scene.add(this.starsParticles);

    // 2. Fireflies (floating near ground and trees)
    const ffCount = 80;
    const ffGeom = new THREE.BufferGeometry();
    const ffPos = new Float32Array(ffCount * 3);
    for (let i = 0; i < ffCount * 3; i += 3) {
      ffPos[i] = -32 + Math.random() * 72;
      ffPos[i + 1] = 1.5 + Math.random() * 6;
      ffPos[i + 2] = -12 + Math.random() * 26;
    }
    ffGeom.setAttribute('position', new THREE.BufferAttribute(ffPos, 3));
    const ffMat = new THREE.PointsMaterial({
      color: 0x757bfd,
      size: 0.45,
      transparent: true,
      opacity: 0.1,
    });
    this.firefliesParticles = new THREE.Points(ffGeom, ffMat);
    this.scene.add(this.firefliesParticles);
  }

  public setDarkMode(dark: boolean) {
    this.isDarkMode = dark;
    this.targetThemeLerp = dark ? 1 : 0;
  }

  public setProgress(t: number) {
    this.targetProgress = Math.max(0, Math.min(1, t));
  }

  public jumpToStation(index: number) {
    const t = Math.max(0, Math.min(1, index / 5));
    this.targetProgress = t;
  }

  // Interactive gravity physics playground
  public triggerPhysicsDrop() {
    const colors = [0xff6464, 0x757bfd, 0x3ddc97, 0xffb703, 0x00f2fe];
    const shapes = [
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.ConeGeometry(0.5, 0.9, 5),
    ];

    for (let i = 0; i < 6; i++) {
      const geom = shapes[i % shapes.length];
      const col = colors[i % colors.length];
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.3,
        metalness: 0.2,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geom, mat);
      // Spawn right above Observatory ridge
      mesh.position.set(10 + (Math.random() - 0.5) * 4, 14 + i * 1.5, -4 + (Math.random() - 0.5) * 4);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);

      this.physicsObjects.push({
        mesh,
        velY: -0.05,
        velX: (Math.random() - 0.5) * 0.1,
        velZ: (Math.random() - 0.5) * 0.1,
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ),
      });
    }
  }

  // Free camera orbit controls
  public rotateFreeOrbit(deltaX: number, deltaY: number) {
    if (!this.isFreeCamera) return;
    this.freeOrbitAngles.theta -= deltaX * 0.005;
    this.freeOrbitAngles.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, this.freeOrbitAngles.phi + deltaY * 0.005));
  }

  public zoomFreeOrbit(deltaZoom: number) {
    if (!this.isFreeCamera) return;
    this.freeOrbitAngles.radius = Math.max(18, Math.min(85, this.freeOrbitAngles.radius + deltaZoom * 0.02));
  }

  public panFreeOrbit(deltaX: number, deltaY: number) {
    if (!this.isFreeCamera) return;
    const right = new THREE.Vector3();
    this.camera.getWorldDirection(right);
    right.cross(this.camera.up).normalize();

    this.freeOrbitCenter.addScaledVector(right, -deltaX * 0.05);
    this.freeOrbitCenter.y += deltaY * 0.05;
  }

  public toggleFreeCamera(): boolean {
    this.isFreeCamera = !this.isFreeCamera;
    if (this.isFreeCamera) {
      // Initialize free orbit from current camera position
      const offset = this.camera.position.clone().sub(this.freeOrbitCenter);
      this.freeOrbitAngles.radius = Math.max(25, Math.min(75, offset.length()));
    }
    return this.isFreeCamera;
  }

  public handleRaycastClick(clientX: number, clientY: number) {
    const rect = this.container.getBoundingClientRect();
    this.mouseVec.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseVec.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    const intersects = this.raycaster.intersectObjects(this.islandBuilder.interactiveObjects, true);

    if (intersects.length > 0) {
      let hit: THREE.Object3D | null = intersects[0].object;
      while (hit && !hit.userData.interactive && hit.parent && hit.parent !== this.scene) {
        hit = hit.parent;
      }
      if (hit && hit.userData) {
        if (hit.userData.projectId) {
          this.onObjectClick?.('project', hit.userData.projectId);
        } else if (hit.userData.skill) {
          this.onObjectClick?.('skill', hit.userData.skill);
        } else {
          this.onObjectClick?.('general');
        }
      }
    }
  }

  private startAnimation() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      this.render();
    };
    this.animationId = requestAnimationFrame(animate);
  }

  private render() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // 1. Lerp Story Progress (Silky smooth inertia)
    this.progress += (this.targetProgress - this.progress) * 0.08;

    // Detect station index changes (0 to 5)
    const stationIndex = Math.round(this.progress * 5);
    if (stationIndex !== this.lastStationIndex) {
      this.lastStationIndex = stationIndex;
      this.onStationChange?.(stationIndex);
    }

    // 2. Parallax mouse interpolation
    this.mouseNorm.x += (this.targetMouseNorm.x - this.mouseNorm.x) * 0.05;
    this.mouseNorm.y += (this.targetMouseNorm.y - this.mouseNorm.y) * 0.05;

    // 3. Camera Positioning
    if (!this.isFreeCamera) {
      const p = Math.max(0.0001, Math.min(0.9999, this.progress));
      const camPos = this.cameraSpline.getPointAt(p);
      const targetPos = this.targetSpline.getPointAt(p);

      // Subtle mouse parallax
      camPos.x += this.mouseNorm.x * 2.2;
      camPos.y += -this.mouseNorm.y * 1.5;

      this.camera.position.lerp(camPos, 0.12);
      this.camera.lookAt(targetPos);
    } else {
      // Free Orbit Mode
      const x = this.freeOrbitCenter.x + this.freeOrbitAngles.radius * Math.sin(this.freeOrbitAngles.phi) * Math.sin(this.freeOrbitAngles.theta);
      const y = this.freeOrbitCenter.y + this.freeOrbitAngles.radius * Math.cos(this.freeOrbitAngles.phi);
      const z = this.freeOrbitCenter.z + this.freeOrbitAngles.radius * Math.sin(this.freeOrbitAngles.phi) * Math.cos(this.freeOrbitAngles.theta);

      this.camera.position.lerp(new THREE.Vector3(x, y, z), 0.1);
      this.camera.lookAt(this.freeOrbitCenter);
    }

    // 4. Smooth Day / Night Interpolation
    this.currentThemeLerp += (this.targetThemeLerp - this.currentThemeLerp) * 0.05;
    this.interpolateTheme(this.currentThemeLerp);

    // 5. Rotating Models (Propellers, Polyhedra, Boat bobbing, Gyroscope)
    this.islandBuilder.rotatingObjects.forEach((item) => {
      item.obj.rotation.y += item.speedY * delta;
      if (item.speedX) {
        item.obj.rotation.x += item.speedX * delta;
      }
    });

    // 6. Campfire flicker animation
    this.islandBuilder.campfireFlames.forEach((flame, i) => {
      const s = 1.0 + Math.sin(time * 12 + i * 2) * 0.2;
      flame.scale.set(s, 1.0 + Math.cos(time * 10 + i) * 0.25, s);
    });
    this.campfireLight.intensity = 1.6 + Math.sin(time * 15) * 0.45;

    // 7. Dynamic Ocean Waves
    if (this.oceanData) {
      this.oceanData.update(time);
    }

    // 8. Dynamic Sky Elements
    if (this.skyElements) {
      // Drifting clouds
      this.skyElements.clouds.forEach((cloud, idx) => {
        cloud.position.x += 0.4 * delta * (1 + (idx % 3) * 0.3);
        if (cloud.position.x > 50) {
          cloud.position.x = -50;
        }
      });

      // Hot air balloon bobbing
      this.skyElements.balloon.position.y = 15 + Math.sin(time * 0.8) * 0.8;
      this.skyElements.balloon.rotation.y = time * 0.05;

      // Paper airplane flight arc
      const planeRadius = 26;
      const planeAngle = time * 0.3;
      this.skyElements.plane.position.x = Math.sin(planeAngle) * planeRadius;
      this.skyElements.plane.position.z = Math.cos(planeAngle * 0.8) * 16;
      this.skyElements.plane.position.y = 11 + Math.sin(time * 1.2) * 1.5;
      this.skyElements.plane.rotation.y = -planeAngle - Math.PI / 2;
    }

    // 9. Fireflies gentle float
    if (this.firefliesParticles) {
      const pos = this.firefliesParticles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) + Math.sin(time * 2 + i) * 0.008;
        if (y < 1.0) y = 5.0;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // 10. Physics Simulation (interactive bouncing shapes)
    for (let i = this.physicsObjects.length - 1; i >= 0; i--) {
      const item = this.physicsObjects[i];
      item.velY -= 0.009; // gravity
      item.mesh.position.y += item.velY;
      item.mesh.position.x += item.velX;
      item.mesh.position.z += item.velZ;
      item.mesh.rotation.x += item.rotVel.x;
      item.mesh.rotation.y += item.rotVel.y;

      // Bounce on island plateau (Y ~ 4.6)
      if (item.mesh.position.y <= 4.8) {
        item.mesh.position.y = 4.8;
        item.velY = -item.velY * 0.65; // bounce damping
        item.velX *= 0.85;
        item.velZ *= 0.85;
        item.rotVel.multiplyScalar(0.85);

        // Slow down and settle
        if (Math.abs(item.velY) < 0.02) {
          item.velY = 0;
        }
      }

      // Remove if fell off the world into the sea
      if (item.mesh.position.y < -5) {
        this.scene.remove(item.mesh);
        this.physicsObjects.splice(i, 1);
      }
    }

    // Render
    this.renderer.render(this.scene, this.camera);
  }

  private interpolateTheme(factor: number) {
    // 0 = Light, 1 = Dark
    const lightSky = new THREE.Color(LIGHT_THEME_COLORS.sky);
    const darkSky = new THREE.Color(DARK_THEME_COLORS.sky);
    const currentSky = lightSky.clone().lerp(darkSky, factor);
    (this.scene.background as THREE.Color).copy(currentSky);

    const lightFog = new THREE.Color(LIGHT_THEME_COLORS.fog);
    const darkFog = new THREE.Color(DARK_THEME_COLORS.fog);
    const currentFog = lightFog.clone().lerp(darkFog, factor);
    (this.scene.fog as THREE.FogExp2).color.copy(currentFog);

    // Sun & Moon lights
    const lightDirCol = new THREE.Color(0xfff5e6);
    const darkDirCol = new THREE.Color(0x8899df);
    this.dirLight.color.copy(lightDirCol.clone().lerp(darkDirCol, factor));
    this.dirLight.intensity = THREE.MathUtils.lerp(1.6, 0.7, factor);

    const lightHemiSky = new THREE.Color(0xffffff);
    const darkHemiSky = new THREE.Color(0x1a193b);
    this.hemiLight.color.copy(lightHemiSky.clone().lerp(darkHemiSky, factor));
    this.hemiLight.intensity = THREE.MathUtils.lerp(1.1, 0.45, factor);

    // Particle visibility
    if (this.starsParticles) {
      (this.starsParticles.material as THREE.PointsMaterial).opacity = THREE.MathUtils.lerp(0.02, 0.75, factor);
    }
    if (this.firefliesParticles) {
      (this.firefliesParticles.material as THREE.PointsMaterial).opacity = THREE.MathUtils.lerp(0.08, 0.85, factor);
    }

    // Materials
    const blendedColors = {
      sky: currentSky.getHex(),
      fog: currentFog.getHex(),
      groundGrass: new THREE.Color(LIGHT_THEME_COLORS.groundGrass).lerp(new THREE.Color(DARK_THEME_COLORS.groundGrass), factor).getHex(),
      groundRock: new THREE.Color(LIGHT_THEME_COLORS.groundRock).lerp(new THREE.Color(DARK_THEME_COLORS.groundRock), factor).getHex(),
      groundSand: new THREE.Color(LIGHT_THEME_COLORS.groundSand).lerp(new THREE.Color(DARK_THEME_COLORS.groundSand), factor).getHex(),
      groundPath: new THREE.Color(LIGHT_THEME_COLORS.groundPath).lerp(new THREE.Color(DARK_THEME_COLORS.groundPath), factor).getHex(),
      water: new THREE.Color(LIGHT_THEME_COLORS.water).lerp(new THREE.Color(DARK_THEME_COLORS.water), factor).getHex(),
      foliage1: new THREE.Color(LIGHT_THEME_COLORS.foliage1).lerp(new THREE.Color(DARK_THEME_COLORS.foliage1), factor).getHex(),
      foliage2: new THREE.Color(LIGHT_THEME_COLORS.foliage2).lerp(new THREE.Color(DARK_THEME_COLORS.foliage2), factor).getHex(),
      wood: new THREE.Color(LIGHT_THEME_COLORS.wood).lerp(new THREE.Color(DARK_THEME_COLORS.wood), factor).getHex(),
      buildingWall: new THREE.Color(LIGHT_THEME_COLORS.buildingWall).lerp(new THREE.Color(DARK_THEME_COLORS.buildingWall), factor).getHex(),
      buildingRoof: new THREE.Color(LIGHT_THEME_COLORS.buildingRoof).lerp(new THREE.Color(DARK_THEME_COLORS.buildingRoof), factor).getHex(),
      windowEmit: new THREE.Color(LIGHT_THEME_COLORS.windowEmit).lerp(new THREE.Color(DARK_THEME_COLORS.windowEmit), factor).getHex(),
      windowEmitIntensity: THREE.MathUtils.lerp(LIGHT_THEME_COLORS.windowEmitIntensity, DARK_THEME_COLORS.windowEmitIntensity, factor),
      lighthouseBeamIntensity: THREE.MathUtils.lerp(LIGHT_THEME_COLORS.lighthouseBeamIntensity, DARK_THEME_COLORS.lighthouseBeamIntensity, factor),
    };

    this.islandBuilder.updateTheme(blendedColors, factor > 0.5);

    if (this.oceanData) {
      (this.oceanData.mesh.material as THREE.MeshStandardMaterial).color.setHex(blendedColors.water);
    }
  }

  public handleResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public destroy() {
    cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
