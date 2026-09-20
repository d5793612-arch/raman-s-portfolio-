import * as THREE from 'three';

export interface ThemeColors {
  sky: number;
  fog: number;
  groundGrass: number;
  groundRock: number;
  groundSand: number;
  groundPath: number;
  water: number;
  foliage1: number;
  foliage2: number;
  wood: number;
  buildingWall: number;
  buildingRoof: number;
  windowEmit: number;
  windowEmitIntensity: number;
  lighthouseBeamIntensity: number;
}

export const LIGHT_THEME_COLORS: ThemeColors = {
  sky: 0xd9e5f5,
  fog: 0xd9e5f5,
  groundGrass: 0x76c986,
  groundRock: 0xa0a8b4,
  groundSand: 0xf3d9aa,
  groundPath: 0xdecbb5,
  water: 0x5fa8eb,
  foliage1: 0x48b368,
  foliage2: 0x62cf82,
  wood: 0x936639,
  buildingWall: 0xf4f6f9,
  buildingRoof: 0x757bfd,
  windowEmit: 0xffffff,
  windowEmitIntensity: 0.2,
  lighthouseBeamIntensity: 0.15,
};

export const DARK_THEME_COLORS: ThemeColors = {
  sky: 0x090c1c,
  fog: 0x0c1024,
  groundGrass: 0x1b2e3e,
  groundRock: 0x222838,
  groundSand: 0x3d3936,
  groundPath: 0x313444,
  water: 0x0e172e,
  foliage1: 0x1e493e,
  foliage2: 0x2c6e5a,
  wood: 0x3a2c20,
  buildingWall: 0x1e243d,
  buildingRoof: 0x23008e,
  windowEmit: 0xffaa33,
  windowEmitIntensity: 1.8,
  lighthouseBeamIntensity: 1.2,
};

export class IslandBuilder {
  private materials: Map<string, THREE.MeshStandardMaterial> = new Map();
  public windowMaterials: THREE.MeshStandardMaterial[] = [];
  public lighthouseBeamMesh: THREE.Mesh | null = null;
  public lighthouseHeadGroup: THREE.Group | null = null;
  public interactiveObjects: THREE.Object3D[] = [];
  public rotatingObjects: { obj: THREE.Object3D; speedY: number; speedX?: number }[] = [];
  public campfireFlames: THREE.Mesh[] = [];

  constructor() {
    this.initMaterials();
  }

  private initMaterials() {
    // Base low poly materials (flat shading for that iconic Awwwards / Joshua's World aesthetic)
    this.createMaterial('grass', LIGHT_THEME_COLORS.groundGrass, 0.8, 0.1);
    this.createMaterial('sand', LIGHT_THEME_COLORS.groundSand, 0.9, 0.1);
    this.createMaterial('rock', LIGHT_THEME_COLORS.groundRock, 0.9, 0.1);
    this.createMaterial('path', LIGHT_THEME_COLORS.groundPath, 0.85, 0.1);
    this.createMaterial('wood', LIGHT_THEME_COLORS.wood, 0.7, 0.1);
    this.createMaterial('foliage1', LIGHT_THEME_COLORS.foliage1, 0.8, 0.1);
    this.createMaterial('foliage2', LIGHT_THEME_COLORS.foliage2, 0.8, 0.1);
    this.createMaterial('foliageCherry', 0xfca5a5, 0.8, 0.1);
    this.createMaterial('wall', LIGHT_THEME_COLORS.buildingWall, 0.6, 0.1);
    this.createMaterial('roof', LIGHT_THEME_COLORS.buildingRoof, 0.5, 0.1);
    this.createMaterial('coral', 0xff6464, 0.5, 0.1);
    this.createMaterial('gold', 0xffb703, 0.4, 0.3);
    this.createMaterial('white', 0xffffff, 0.5, 0.1);
    this.createMaterial('glass', 0x98c5e9, 0.1, 0.9, 0.6);
    this.createMaterial('trunk', 0x6e4e37, 0.85, 0.1);

    // Window material with emissive properties
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: LIGHT_THEME_COLORS.windowEmit,
      emissiveIntensity: LIGHT_THEME_COLORS.windowEmitIntensity,
      roughness: 0.3,
      metalness: 0.2,
      flatShading: true,
    });
    this.materials.set('window', windowMat);
    this.windowMaterials.push(windowMat);
  }

  private createMaterial(
    name: string,
    color: number,
    roughness: number = 0.8,
    metalness: number = 0.1,
    opacity: number = 1.0
  ): THREE.MeshStandardMaterial {
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      flatShading: true,
      transparent: opacity < 1.0,
      opacity,
    });
    this.materials.set(name, mat);
    return mat;
  }

  public getMaterial(name: string): THREE.MeshStandardMaterial {
    return this.materials.get(name) || this.materials.get('grass')!;
  }

  public updateTheme(colors: ThemeColors, isDark: boolean) {
    this.getMaterial('grass').color.setHex(colors.groundGrass);
    this.getMaterial('rock').color.setHex(colors.groundRock);
    this.getMaterial('sand').color.setHex(colors.groundSand);
    this.getMaterial('path').color.setHex(colors.groundPath);
    this.getMaterial('wood').color.setHex(colors.wood);
    this.getMaterial('wall').color.setHex(colors.buildingWall);
    this.getMaterial('roof').color.setHex(colors.buildingRoof);
    this.getMaterial('foliage1').color.setHex(colors.foliage1);
    this.getMaterial('foliage2').color.setHex(colors.foliage2);

    this.windowMaterials.forEach((mat) => {
      mat.emissive.setHex(colors.windowEmit);
      mat.emissiveIntensity = colors.windowEmitIntensity;
    });

    if (this.lighthouseBeamMesh) {
      const beamMat = this.lighthouseBeamMesh.material as THREE.MeshBasicMaterial;
      beamMat.opacity = colors.lighthouseBeamIntensity * 0.45;
    }
  }

  // --- Terrain Construction ---
  public buildArchipelago(): THREE.Group {
    const worldGroup = new THREE.Group();
    worldGroup.name = 'Archipelago';

    // 1. Main Island Terraces (Low-poly stylized archipelago)
    const islandBase = this.createLowPolyIslandMesh();
    worldGroup.add(islandBase);

    // 2. Winding Stone Path & Steps connecting the 6 stations
    const pathGroup = this.createPathSystem();
    worldGroup.add(pathGroup);

    // 3. Station 1: Genesis Harbor (Pier, boat, welcome arch)
    const genesisGroup = this.buildGenesisStation();
    worldGroup.add(genesisGroup);

    // 4. Station 2: The Workshop (Modern studio atelier, spinning polyhedra, workbench)
    const workshopGroup = this.buildWorkshopStation();
    worldGroup.add(workshopGroup);

    // 5. Station 3: Project Pavilions (Modern gallery pedestals, floating project cards)
    const galleryGroup = this.buildProjectStation();
    worldGroup.add(galleryGroup);

    // 6. Station 4: The Observatory (Dome, telescope, planetary gyro)
    const observatoryGroup = this.buildObservatoryStation();
    worldGroup.add(observatoryGroup);

    // 7. Station 5: Campfire Retreat (Tent, log bench, animated campfire, guitar, coffee)
    const campsiteGroup = this.buildCampsiteStation();
    worldGroup.add(campsiteGroup);

    // 8. Station 6: The Beacon (Lighthouse, rotating beam, ocean cliff)
    const beaconGroup = this.buildBeaconStation();
    worldGroup.add(beaconGroup);

    // 9. Natural Details (Trees, rocks, vegetation, flowers across the islands)
    const natureGroup = this.buildNaturalElements();
    worldGroup.add(natureGroup);

    return worldGroup;
  }

  private createLowPolyIslandMesh(): THREE.Group {
    const group = new THREE.Group();

    // Archipelago chunks positioned along the journey path
    // S-curve archipelago spanning from X: -35 to X: +38, Z: -15 to Z: +20
    const islandsConfig = [
      // 1. Genesis Pier Island
      { x: -30, y: 0.6, z: 6, rx: 11, rz: 11, h: 2.2, color: 'grass' },
      // 2. Workshop Island
      { x: -16, y: 1.2, z: -8, rx: 13, rz: 12, h: 3.2, color: 'grass' },
      // 3. Gallery Pavilion Island
      { x: -2, y: 1.6, z: 8, rx: 14, rz: 13, h: 3.6, color: 'grass' },
      // 4. Observatory Ridge
      { x: 12, y: 2.8, z: -6, rx: 13, rz: 11, h: 4.8, color: 'grass' },
      // 5. Campfire Pine Meadow
      { x: 25, y: 2.2, z: 7, rx: 12, rz: 11, h: 4.2, color: 'grass' },
      // 6. Lighthouse Cliff Bluff (High promontory)
      { x: 38, y: 4.0, z: -4, rx: 11, rz: 10, h: 6.5, color: 'rock' },
      // Connecting isthmus / stepping islands
      { x: -23, y: 0.4, z: -1, rx: 7, rz: 6, h: 1.8, color: 'sand' },
      { x: -9, y: 0.5, z: 0, rx: 8, rz: 7, h: 2.0, color: 'sand' },
      { x: 5, y: 0.8, z: 1, rx: 7, rz: 7, h: 2.4, color: 'sand' },
      { x: 19, y: 1.0, z: 0, rx: 8, rz: 7, h: 2.8, color: 'sand' },
      { x: 32, y: 1.8, z: 2, rx: 8, rz: 7, h: 3.8, color: 'rock' }
    ];

    islandsConfig.forEach((cfg) => {
      // Cylinder with randomized radial segments for low-poly stylized faceted look
      const segments = 10;
      const geom = new THREE.CylinderGeometry(cfg.rx, cfg.rx * 1.15, cfg.h, segments, 2);
      
      // Jitter vertices slightly for handcrafted low-poly organic terrain
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        // Only deform horizontal perimeter, keep bottom flat
        if (y > -cfg.h * 0.4) {
          pos.setX(i, pos.getX(i) + (Math.sin(i * 3.7) * 0.7));
          pos.setZ(i, pos.getZ(i) + (Math.cos(i * 2.3) * 0.7));
          pos.setY(i, pos.getY(i) + (Math.sin(i * 1.5) * 0.25));
        }
      }
      geom.computeVertexNormals();

      const mesh = new THREE.Mesh(geom, this.getMaterial(cfg.color));
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      // Sandy shoreline ring around the lower edge
      const sandGeom = new THREE.CylinderGeometry(cfg.rx * 1.25, cfg.rx * 1.4, 0.9, segments, 1);
      const sandMesh = new THREE.Mesh(sandGeom, this.getMaterial('sand'));
      sandMesh.position.set(cfg.x, cfg.y - cfg.h * 0.45, cfg.z);
      sandMesh.receiveShadow = true;
      group.add(sandMesh);
    });

    return group;
  }

  private createPathSystem(): THREE.Group {
    const group = new THREE.Group();
    const stoneGeom = new THREE.CylinderGeometry(0.75, 0.85, 0.25, 6);
    const pathMat = this.getMaterial('path');

    // Waypoints along the path
    const waypoints = [
      new THREE.Vector3(-31, 1.8, 6),
      new THREE.Vector3(-27, 1.7, 4),
      new THREE.Vector3(-24, 1.4, 1),
      new THREE.Vector3(-21, 1.6, -3),
      new THREE.Vector3(-17, 2.7, -6),
      new THREE.Vector3(-13, 2.4, -4),
      new THREE.Vector3(-9, 1.8, 0),
      new THREE.Vector3(-5, 2.2, 5),
      new THREE.Vector3(-2, 3.2, 7),
      new THREE.Vector3(2, 2.5, 5),
      new THREE.Vector3(6, 2.3, 1),
      new THREE.Vector3(9, 3.2, -3),
      new THREE.Vector3(12, 4.8, -5),
      new THREE.Vector3(16, 3.6, -1),
      new THREE.Vector3(20, 2.8, 4),
      new THREE.Vector3(24, 4.2, 6),
      new THREE.Vector3(29, 3.6, 4),
      new THREE.Vector3(33, 4.5, 0),
      new THREE.Vector3(37, 6.8, -3),
    ];

    // Interpolate stepping stones
    for (let i = 0; i < waypoints.length - 1; i++) {
      const p1 = waypoints[i];
      const p2 = waypoints[i + 1];
      const count = 3;
      for (let j = 0; j < count; j++) {
        const t = j / count;
        const pos = new THREE.Vector3().lerpVectors(p1, p2, t);
        const stone = new THREE.Mesh(stoneGeom, pathMat);
        stone.position.set(pos.x + (Math.random() - 0.5) * 0.3, pos.y + 0.05, pos.z + (Math.random() - 0.5) * 0.3);
        stone.rotation.y = Math.random() * Math.PI;
        stone.scale.set(0.8 + Math.random() * 0.4, 1, 0.8 + Math.random() * 0.4);
        stone.receiveShadow = true;
        group.add(stone);
      }
    }

    return group;
  }

  // --- Station 1: Genesis Pier ---
  private buildGenesisStation(): THREE.Group {
    const group = new THREE.Group();
    group.position.set(-30, 0, 6);

    // 1. Wooden Pier extending over the water
    const pierMat = this.getMaterial('wood');
    const pierDeckGeom = new THREE.BoxGeometry(4.5, 0.3, 1.8);
    const pierDeck = new THREE.Mesh(pierDeckGeom, pierMat);
    pierDeck.position.set(-3.5, 1.2, 0);
    pierDeck.castShadow = true;
    pierDeck.receiveShadow = true;
    group.add(pierDeck);

    // Pier wooden pilings
    const pileGeom = new THREE.CylinderGeometry(0.14, 0.14, 2.5, 6);
    [-5.2, -3.5, -1.8].forEach((px) => {
      [-0.75, 0.75].forEach((pz) => {
        const pile = new THREE.Mesh(pileGeom, pierMat);
        pile.position.set(px, 0.4, pz);
        pile.castShadow = true;
        group.add(pile);
      });
    });

    // 2. Moored low-poly rowing boat
    const boatGroup = new THREE.Group();
    boatGroup.position.set(-5.8, 0.4, 1.8);
    boatGroup.rotation.y = -0.35;

    // Boat hull
    const hullGeom = new THREE.BoxGeometry(2.4, 0.6, 1.1);
    const hullMesh = new THREE.Mesh(hullGeom, this.getMaterial('coral'));
    hullMesh.castShadow = true;
    boatGroup.add(hullMesh);

    // Boat seats & oars
    const seatGeom = new THREE.BoxGeometry(0.3, 0.1, 0.95);
    const seat1 = new THREE.Mesh(seatGeom, pierMat);
    seat1.position.set(-0.5, 0.25, 0);
    const seat2 = new THREE.Mesh(seatGeom, pierMat);
    seat2.position.set(0.5, 0.25, 0);
    boatGroup.add(seat1, seat2);

    const oarGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.6, 5);
    const oar = new THREE.Mesh(oarGeom, pierMat);
    oar.rotation.z = Math.PI / 3;
    oar.position.set(0, 0.3, 0.6);
    boatGroup.add(oar);

    this.rotatingObjects.push({ obj: boatGroup, speedY: 0.1, speedX: 0.05 });
    group.add(boatGroup);

    // 3. Welcome Signpost Arch
    const postGeom = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 6);
    const postLeft = new THREE.Mesh(postGeom, pierMat);
    postLeft.position.set(-0.8, 3.2, -1.2);
    const postRight = new THREE.Mesh(postGeom, pierMat);
    postRight.position.set(-0.8, 3.2, 1.2);
    group.add(postLeft, postRight);

    // Arch crossbeam with banner
    const crossGeom = new THREE.BoxGeometry(0.3, 0.4, 2.8);
    const crossMesh = new THREE.Mesh(crossGeom, this.getMaterial('roof'));
    crossMesh.position.set(-0.8, 4.6, 0);
    group.add(crossMesh);

    // Glowing welcome orb / checkpoint pin
    const orbGeom = new THREE.IcosahedronGeometry(0.4, 1);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x757bfd,
      emissive: 0x757bfd,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      flatShading: true,
    });
    const orb = new THREE.Mesh(orbGeom, orbMat);
    orb.position.set(-0.8, 5.3, 0);
    this.rotatingObjects.push({ obj: orb, speedY: 1.2 });
    this.interactiveObjects.push(orb);
    group.add(orb);

    // Little lantern on the pier
    const lantern = this.createLantern();
    lantern.position.set(-4.8, 1.8, -0.75);
    group.add(lantern);

    return group;
  }

  // --- Station 2: The Workshop (Craft & Skills) ---
  private buildWorkshopStation(): THREE.Group {
    const group = new THREE.Group();
    group.position.set(-16, 2.5, -8);

    // 1. Modernist Studio Atelier Building
    const studioGroup = new THREE.Group();

    // Studio base structure
    const buildingGeom = new THREE.BoxGeometry(5.2, 3.2, 4.2);
    const buildingMesh = new THREE.Mesh(buildingGeom, this.getMaterial('wall'));
    buildingMesh.position.set(0, 1.6, 0);
    buildingMesh.castShadow = true;
    buildingMesh.receiveShadow = true;
    studioGroup.add(buildingMesh);

    // Architectural angled roof
    const roofGeom = new THREE.ConeGeometry(4.2, 1.8, 4);
    const roofMesh = new THREE.Mesh(roofGeom, this.getMaterial('roof'));
    roofMesh.position.set(0, 4.0, 0);
    roofMesh.rotation.y = Math.PI / 4;
    roofMesh.castShadow = true;
    studioGroup.add(roofMesh);

    // Large glass studio window
    const windowGeom = new THREE.BoxGeometry(2.8, 1.6, 0.2);
    const windowMesh = new THREE.Mesh(windowGeom, this.getMaterial('window'));
    windowMesh.position.set(0, 1.8, 2.12);
    studioGroup.add(windowMesh);

    // Wooden door
    const doorGeom = new THREE.BoxGeometry(0.9, 1.8, 0.1);
    const doorMesh = new THREE.Mesh(doorGeom, this.getMaterial('wood'));
    doorMesh.position.set(1.6, 0.9, 2.12);
    studioGroup.add(doorMesh);

    group.add(studioGroup);

    // 2. Open-air creative workbench outside
    const benchGeom = new THREE.BoxGeometry(2.4, 0.8, 1.2);
    const benchMesh = new THREE.Mesh(benchGeom, this.getMaterial('wood'));
    benchMesh.position.set(0, 0.4, 4.2);
    benchMesh.castShadow = true;
    benchMesh.receiveShadow = true;
    group.add(benchMesh);

    // Stylized laptop on bench
    const laptopBaseGeom = new THREE.BoxGeometry(0.6, 0.04, 0.45);
    const laptopScreenGeom = new THREE.BoxGeometry(0.6, 0.45, 0.04);
    const laptopMat = this.getMaterial('white');
    const laptopBase = new THREE.Mesh(laptopBaseGeom, laptopMat);
    laptopBase.position.set(-0.5, 0.82, 4.2);
    const laptopScreen = new THREE.Mesh(laptopScreenGeom, this.getMaterial('window'));
    laptopScreen.position.set(-0.5, 1.05, 4.0);
    laptopScreen.rotation.x = -0.2;
    group.add(laptopBase, laptopScreen);

    // 3. Floating Interactive Tech Polyhedra (Skills Gems)
    const gemConfigs = [
      { geom: new THREE.IcosahedronGeometry(0.35, 0), color: 0x757bfd, x: -2.4, y: 1.9, z: 3.5, label: 'Three.js' },
      { geom: new THREE.OctahedronGeometry(0.32, 0), color: 0x3ddc97, x: 2.4, y: 2.1, z: 3.8, label: 'React & TS' },
      { geom: new THREE.DodecahedronGeometry(0.3, 0), color: 0xff6464, x: -1.8, y: 2.8, z: 5.0, label: 'Shaders & WebGL' },
      { geom: new THREE.BoxGeometry(0.45, 0.45, 0.45), color: 0xffb703, x: 1.9, y: 2.7, z: 5.2, label: 'Design Systems' },
    ];

    gemConfigs.forEach((cfg) => {
      const gemMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.3,
        flatShading: true,
      });
      const gem = new THREE.Mesh(cfg.geom, gemMat);
      gem.position.set(cfg.x, cfg.y, cfg.z);
      gem.userData = { skill: cfg.label, interactive: true };
      this.rotatingObjects.push({ obj: gem, speedY: 0.9, speedX: 0.5 });
      this.interactiveObjects.push(gem);
      group.add(gem);
    });

    return group;
  }

  // --- Station 3: Project Pavilions (Gallery) ---
  private buildProjectStation(): THREE.Group {
    const group = new THREE.Group();
    group.position.set(-2, 3.0, 8);

    // 4 Floating Project Plinths / Glass Pavilions
    const projectPedestals = [
      { x: -3.8, z: -1.2, color: 0x757bfd, rot: 0.2, title: 'Aetheria' },
      { x: -1.2, z: 1.8, color: 0x00f2fe, rot: -0.15, title: 'NovaFlow' },
      { x: 1.6, z: -0.8, color: 0xff6464, rot: 0.1, title: 'Kinetica' },
      { x: 4.2, z: 1.6, color: 0x3ddc97, rot: -0.25, title: 'Lumina' },
    ];

    projectPedestals.forEach((p, idx) => {
      const pedestalGroup = new THREE.Group();
      pedestalGroup.position.set(p.x, 0, p.z);
      pedestalGroup.rotation.y = p.rot;

      // Base cylinder
      const baseGeom = new THREE.CylinderGeometry(1.2, 1.4, 0.7, 7);
      const baseMesh = new THREE.Mesh(baseGeom, this.getMaterial('wall'));
      baseMesh.position.y = 0.35;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      pedestalGroup.add(baseMesh);

      // Glass frame pedestal
      const glassGeom = new THREE.BoxGeometry(1.4, 1.8, 0.15);
      const glassMat = new THREE.MeshStandardMaterial({
        color: p.color,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.85,
        flatShading: true,
      });
      const glassMesh = new THREE.Mesh(glassGeom, glassMat);
      glassMesh.position.set(0, 1.6, 0);
      glassMesh.castShadow = true;
      pedestalGroup.add(glassMesh);

      // Floating holographic showcase cube
      const cubeGeom = new THREE.BoxGeometry(0.55, 0.55, 0.55);
      const cubeMat = new THREE.MeshStandardMaterial({
        color: p.color,
        emissive: p.color,
        emissiveIntensity: 0.8,
        wireframe: false,
        flatShading: true,
      });
      const cube = new THREE.Mesh(cubeGeom, cubeMat);
      cube.position.set(0, 1.6, 0.3);
      cube.userData = { projectId: p.title.toLowerCase(), interactive: true };
      this.rotatingObjects.push({ obj: cube, speedY: 0.8 + idx * 0.2, speedX: 0.4 });
      this.interactiveObjects.push(cube);
      pedestalGroup.add(cube);

      // Top glowing indicator ring
      const ringGeom = new THREE.TorusGeometry(0.45, 0.05, 6, 12);
      const ringMat = new THREE.MeshBasicMaterial({ color: p.color });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.set(0, 2.7, 0);
      ring.rotation.x = Math.PI / 2;
      pedestalGroup.add(ring);

      group.add(pedestalGroup);
    });

    return group;
  }

  // --- Station 4: The Observatory & Physics Playground ---
  private buildObservatoryStation(): THREE.Group {
    const group = new THREE.Group();
    group.position.set(12, 4.4, -6);

    // 1. Classical Low-poly Observatory Dome Building
    const baseGeom = new THREE.CylinderGeometry(3.0, 3.4, 2.8, 10);
    const baseMesh = new THREE.Mesh(baseGeom, this.getMaterial('wall'));
    baseMesh.position.y = 1.4;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // Dome hemisphere
    const domeGeom = new THREE.SphereGeometry(2.9, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeom, this.getMaterial('roof'));
    domeMesh.position.y = 2.8;
    domeMesh.castShadow = true;
    group.add(domeMesh);

    // Slit & Telescope
    const teleTubeGeom = new THREE.CylinderGeometry(0.2, 0.3, 3.2, 7);
    const teleMat = this.getMaterial('gold');
    const teleTube = new THREE.Mesh(teleTubeGeom, teleMat);
    teleTube.position.set(0.6, 3.8, 0.6);
    teleTube.rotation.z = -Math.PI / 4;
    teleTube.rotation.y = Math.PI / 5;
    teleTube.castShadow = true;
    group.add(teleTube);

    // 2. Spinning Planetary Gyroscope Ring
    const gyroGroup = new THREE.Group();
    gyroGroup.position.set(-3.5, 3.2, 2.5);

    const gyroRing1Geom = new THREE.TorusGeometry(1.2, 0.08, 6, 16);
    const gyroRing1 = new THREE.Mesh(gyroRing1Geom, this.getMaterial('gold'));
    gyroGroup.add(gyroRing1);

    const gyroRing2Geom = new THREE.TorusGeometry(0.9, 0.06, 6, 16);
    const gyroRing2Mat = new THREE.MeshStandardMaterial({
      color: 0x757bfd,
      emissive: 0x757bfd,
      emissiveIntensity: 0.5,
      flatShading: true,
    });
    const gyroRing2 = new THREE.Mesh(gyroRing2Geom, gyroRing2Mat);
    gyroRing2.rotation.x = Math.PI / 3;
    gyroGroup.add(gyroRing2);

    const centerPlanetGeom = new THREE.IcosahedronGeometry(0.45, 1);
    const planetMat = new THREE.MeshStandardMaterial({
      color: 0x3ddc97,
      emissive: 0x3ddc97,
      emissiveIntensity: 0.6,
      flatShading: true,
    });
    const planetMesh = new THREE.Mesh(centerPlanetGeom, planetMat);
    gyroGroup.add(planetMesh);

    this.rotatingObjects.push({ obj: gyroRing1, speedY: 0.7, speedX: 0.4 });
    this.rotatingObjects.push({ obj: gyroRing2, speedY: -1.1, speedX: 0.8 });
    this.rotatingObjects.push({ obj: planetMesh, speedY: 0.5 });
    this.interactiveObjects.push(planetMesh);
    group.add(gyroGroup);

    return group;
  }

  // --- Station 5: The Campfire & Story Retreat ---
  private buildCampsiteStation(): THREE.Group {
    const group = new THREE.Group();
    group.position.set(25, 4.0, 7);

    // 1. Triangular Camping Tent
    const tentMat = this.getMaterial('coral');
    const tentGeom = new THREE.ConeGeometry(2.0, 2.2, 3);
    const tentMesh = new THREE.Mesh(tentGeom, tentMat);
    tentMesh.position.set(-2.2, 1.1, -1.0);
    tentMesh.rotation.y = Math.PI / 4;
    tentMesh.castShadow = true;
    tentMesh.receiveShadow = true;
    group.add(tentMesh);

    // Tent inner shadow opening
    const flapGeom = new THREE.ConeGeometry(1.2, 1.4, 3);
    const flapMat = new THREE.MeshBasicMaterial({ color: 0x221122 });
    const flapMesh = new THREE.Mesh(flapGeom, flapMat);
    flapMesh.position.set(-1.8, 0.7, -0.4);
    flapMesh.rotation.y = Math.PI / 4;
    group.add(flapMesh);

    // 2. Campfire with stones and dancing flame mesh
    const fireGroup = new THREE.Group();
    fireGroup.position.set(0.5, 0.1, 0.5);

    // Ring of stones
    const stoneGeom = new THREE.DodecahedronGeometry(0.2, 0);
    const stoneMat = this.getMaterial('rock');
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const s = new THREE.Mesh(stoneGeom, stoneMat);
      s.position.set(Math.cos(angle) * 0.75, 0.1, Math.sin(angle) * 0.75);
      fireGroup.add(s);
    }

    // Wooden campfire logs
    const logGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 5);
    const logMat = this.getMaterial('trunk');
    for (let i = 0; i < 3; i++) {
      const log = new THREE.Mesh(logGeom, logMat);
      log.rotation.z = Math.PI / 3;
      log.rotation.y = (i * Math.PI) / 3;
      log.position.y = 0.15;
      fireGroup.add(log);
    }

    // Glowing low-poly fire cones
    const flameMat1 = new THREE.MeshBasicMaterial({ color: 0xff6b35 });
    const flameMat2 = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    const flame1 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 5), flameMat1);
    flame1.position.y = 0.45;
    const flame2 = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.65, 4), flameMat2);
    flame2.position.set(0.05, 0.4, -0.05);
    fireGroup.add(flame1, flame2);
    this.campfireFlames.push(flame1, flame2);

    group.add(fireGroup);

    // 3. Wooden Log Benches
    const benchLogGeom = new THREE.CylinderGeometry(0.25, 0.25, 2.2, 6);
    const benchLog1 = new THREE.Mesh(benchLogGeom, this.getMaterial('wood'));
    benchLog1.position.set(0.5, 0.25, -1.2);
    benchLog1.rotation.z = Math.PI / 2;
    benchLog1.castShadow = true;
    group.add(benchLog1);

    // 4. Camping mug & guitar
    const mugGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.18, 6);
    const mug = new THREE.Mesh(mugGeom, this.getMaterial('white'));
    mug.position.set(0.8, 0.55, -1.1);
    group.add(mug);

    return group;
  }

  // --- Station 6: The Beacon (Lighthouse & World's End) ---
  private buildBeaconStation(): THREE.Group {
    const group = new THREE.Group();
    group.position.set(38, 7.2, -4);

    // 1. Towering Low-Poly Scandinavian Lighthouse
    const lhGroup = new THREE.Group();

    // Lighthouse base
    const baseGeom = new THREE.CylinderGeometry(1.6, 2.1, 1.8, 8);
    const baseMesh = new THREE.Mesh(baseGeom, this.getMaterial('rock'));
    baseMesh.position.y = 0.9;
    baseMesh.castShadow = true;
    lhGroup.add(baseMesh);

    // Alternating Red & White Tower Segments
    const segH = 1.3;
    const towerGeoms = [
      { rTop: 1.45, rBot: 1.6, mat: this.getMaterial('coral'), y: 2.45 },
      { rTop: 1.3, rBot: 1.45, mat: this.getMaterial('white'), y: 3.75 },
      { rTop: 1.15, rBot: 1.3, mat: this.getMaterial('coral'), y: 5.05 },
      { rTop: 1.0, rBot: 1.15, mat: this.getMaterial('white'), y: 6.35 },
      { rTop: 0.9, rBot: 1.0, mat: this.getMaterial('coral'), y: 7.65 },
    ];

    towerGeoms.forEach((t) => {
      const geom = new THREE.CylinderGeometry(t.rTop, t.rBot, segH, 8);
      const mesh = new THREE.Mesh(geom, t.mat);
      mesh.position.y = t.y;
      mesh.castShadow = true;
      lhGroup.add(mesh);
    });

    // Walkway Gallery Ring
    const galleryGeom = new THREE.CylinderGeometry(1.3, 1.3, 0.2, 8);
    const galleryMesh = new THREE.Mesh(galleryGeom, this.getMaterial('wood'));
    galleryMesh.position.y = 8.4;
    lhGroup.add(galleryMesh);

    // Lantern Room (Glass with glowing beacon core)
    const lanternGlassGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.0, 8);
    const lanternGlass = new THREE.Mesh(lanternGlassGeom, this.getMaterial('glass'));
    lanternGlass.position.y = 9.0;
    lhGroup.add(lanternGlass);

    // Lighthouse Roof Dome
    const roofGeom = new THREE.ConeGeometry(1.1, 1.0, 8);
    const roofMesh = new THREE.Mesh(roofGeom, this.getMaterial('roof'));
    roofMesh.position.y = 10.0;
    lhGroup.add(roofMesh);

    // Rotating Lighthouse Lamp Head & Volumetric Light Beam
    const lampHeadGroup = new THREE.Group();
    lampHeadGroup.position.set(0, 9.0, 0);

    // Glowing core bulb
    const bulbGeom = new THREE.IcosahedronGeometry(0.3, 1);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff4cc });
    const bulbMesh = new THREE.Mesh(bulbGeom, bulbMat);
    lampHeadGroup.add(bulbMesh);

    // Volumetric Beam Cone
    const beamGeom = new THREE.ConeGeometry(5.5, 24, 12, 1, true);
    // Orient cone horizontally forward along Z
    beamGeom.translate(0, 12, 0);
    beamGeom.rotateX(Math.PI / 2);

    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfff3aa,
      transparent: true,
      opacity: LIGHT_THEME_COLORS.lighthouseBeamIntensity * 0.45,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const beamMesh = new THREE.Mesh(beamGeom, beamMat);
    lampHeadGroup.add(beamMesh);

    this.lighthouseBeamMesh = beamMesh;
    this.lighthouseHeadGroup = lampHeadGroup;
    this.rotatingObjects.push({ obj: lampHeadGroup, speedY: 0.65 });
    lhGroup.add(lampHeadGroup);

    group.add(lhGroup);

    // 2. Mailbox / Contact Beacon Station
    const mailboxGroup = new THREE.Group();
    mailboxGroup.position.set(-2.4, 0.4, 2.5);

    const postGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 5);
    const post = new THREE.Mesh(postGeom, this.getMaterial('wood'));
    post.position.y = 0.7;
    mailboxGroup.add(post);

    const boxGeom = new THREE.BoxGeometry(0.7, 0.5, 0.9);
    const boxMesh = new THREE.Mesh(boxGeom, this.getMaterial('roof'));
    boxMesh.position.set(0, 1.4, 0);
    mailboxGroup.add(boxMesh);

    // Flag on mailbox
    const flagGeom = new THREE.BoxGeometry(0.05, 0.35, 0.15);
    const flagMesh = new THREE.Mesh(flagGeom, this.getMaterial('coral'));
    flagMesh.position.set(0.38, 1.6, 0.15);
    mailboxGroup.add(flagMesh);

    group.add(mailboxGroup);

    return group;
  }

  // --- Natural Details (Trees, Rocks, Vegetation) ---
  private buildNaturalElements(): THREE.Group {
    const group = new THREE.Group();

    // 1. Stylized Low-Poly Pine Trees
    const pineLocations = [
      { x: -28, y: 1.8, z: 9, s: 1.1 },
      { x: -33, y: 1.6, z: 3, s: 0.9 },
      { x: -20, y: 2.2, z: -10, s: 1.2 },
      { x: -13, y: 2.6, z: -11, s: 1.3 },
      { x: -9, y: 2.0, z: -7, s: 0.8 },
      { x: -6, y: 2.4, z: 9, s: 1.1 },
      { x: 3, y: 2.6, z: 10, s: 1.2 },
      { x: 8, y: 3.5, z: -8, s: 1.4 },
      { x: 15, y: 4.6, z: -9, s: 1.2 },
      { x: 18, y: 3.8, z: 6, s: 1.3 },
      { x: 22, y: 4.0, z: 10, s: 1.4 },
      { x: 28, y: 4.2, z: 8, s: 1.2 },
      { x: 35, y: 6.4, z: -8, s: 1.0 },
      { x: 41, y: 6.6, z: -1, s: 0.9 },
    ];

    pineLocations.forEach((loc) => {
      const tree = this.createPineTree(loc.s);
      tree.position.set(loc.x, loc.y, loc.z);
      group.add(tree);
    });

    // 2. Flowering Blossom / Cherry Trees (Near Genesis & Workshop)
    const cherryLocations = [
      { x: -26, y: 1.8, z: 7, s: 1.1 },
      { x: -14, y: 2.4, z: -4, s: 1.0 },
      { x: -1, y: 2.8, z: 11, s: 1.2 },
    ];

    cherryLocations.forEach((loc) => {
      const tree = this.createDeciduousTree('foliageCherry', loc.s);
      tree.position.set(loc.x, loc.y, loc.z);
      group.add(tree);
    });

    // 3. Low-Poly Boulders & Rocks
    const rockLocations = [
      { x: -35, y: 0.8, z: 8, s: 1.2 },
      { x: -22, y: 1.2, z: 2, s: 0.9 },
      { x: -4, y: 1.5, z: -4, s: 1.4 },
      { x: 7, y: 2.0, z: 6, s: 1.0 },
      { x: 17, y: 3.0, z: -3, s: 1.3 },
      { x: 31, y: 3.8, z: 5, s: 1.5 },
      { x: 42, y: 6.0, z: -6, s: 1.8 },
    ];

    rockLocations.forEach((loc) => {
      const rock = this.createLowPolyRock(loc.s);
      rock.position.set(loc.x, loc.y, loc.z);
      group.add(rock);
    });

    return group;
  }

  private createPineTree(scale: number = 1.0): THREE.Group {
    const tree = new THREE.Group();

    // Trunk
    const trunkGeom = new THREE.CylinderGeometry(0.14 * scale, 0.22 * scale, 1.4 * scale, 5);
    const trunk = new THREE.Mesh(trunkGeom, this.getMaterial('trunk'));
    trunk.position.y = (1.4 * scale) / 2;
    trunk.castShadow = true;
    tree.add(trunk);

    // 3 Tiered foliage cones
    const foliageMat = this.getMaterial('foliage1');
    const tiers = [
      { r: 1.2 * scale, h: 1.4 * scale, y: 1.2 * scale },
      { r: 0.95 * scale, h: 1.2 * scale, y: 1.9 * scale },
      { r: 0.65 * scale, h: 1.0 * scale, y: 2.5 * scale },
    ];

    tiers.forEach((t) => {
      const coneGeom = new THREE.ConeGeometry(t.r, t.h, 6);
      const cone = new THREE.Mesh(coneGeom, foliageMat);
      cone.position.y = t.y;
      cone.castShadow = true;
      cone.receiveShadow = true;
      tree.add(cone);
    });

    return tree;
  }

  private createDeciduousTree(materialName: string, scale: number = 1.0): THREE.Group {
    const tree = new THREE.Group();

    const trunkGeom = new THREE.CylinderGeometry(0.16 * scale, 0.24 * scale, 1.6 * scale, 6);
    const trunk = new THREE.Mesh(trunkGeom, this.getMaterial('trunk'));
    trunk.position.y = (1.6 * scale) / 2;
    trunk.castShadow = true;
    tree.add(trunk);

    // Puffy crown using icosahedrons
    const crownGeom = new THREE.IcosahedronGeometry(1.2 * scale, 1);
    const crown = new THREE.Mesh(crownGeom, this.getMaterial(materialName));
    crown.position.y = 2.2 * scale;
    crown.castShadow = true;
    crown.receiveShadow = true;
    tree.add(crown);

    return tree;
  }

  private createLowPolyRock(scale: number = 1.0): THREE.Mesh {
    const geom = new THREE.DodecahedronGeometry(0.9 * scale, 0);
    const mesh = new THREE.Mesh(geom, this.getMaterial('rock'));
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.scale.set(1.0 + Math.random() * 0.3, 0.7 + Math.random() * 0.4, 1.0 + Math.random() * 0.3);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  private createLantern(): THREE.Group {
    const group = new THREE.Group();

    const postGeom = new THREE.CylinderGeometry(0.06, 0.06, 1.1, 5);
    const post = new THREE.Mesh(postGeom, this.getMaterial('wood'));
    group.add(post);

    const lampGeom = new THREE.BoxGeometry(0.28, 0.35, 0.28);
    const lamp = new THREE.Mesh(lampGeom, this.getMaterial('window'));
    lamp.position.y = 0.65;
    group.add(lamp);

    return group;
  }

  // --- Dynamic Floating Sky Elements (Clouds, Balloon, Plane) ---
  public buildSkyElements(): { group: THREE.Group; clouds: THREE.Mesh[]; balloon: THREE.Group; plane: THREE.Group } {
    const group = new THREE.Group();
    const clouds: THREE.Mesh[] = [];

    // 1. Drifting Low-Poly Clouds
    const cloudGeom = new THREE.DodecahedronGeometry(2.2, 1);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.05,
      flatShading: true,
      transparent: true,
      opacity: 0.92,
    });

    const cloudCoords = [
      { x: -35, y: 15, z: -18, s: 1.2 },
      { x: -18, y: 18, z: 14, s: 1.5 },
      { x: 0, y: 14, z: -15, s: 1.3 },
      { x: 16, y: 19, z: 16, s: 1.6 },
      { x: 32, y: 16, z: -14, s: 1.4 },
      { x: 45, y: 20, z: 10, s: 1.1 },
    ];

    cloudCoords.forEach((c) => {
      const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
      cloudMesh.position.set(c.x, c.y, c.z);
      cloudMesh.scale.set(c.s * 1.6, c.s * 0.7, c.s);
      clouds.push(cloudMesh);
      group.add(cloudMesh);
    });

    // 2. Hot Air Balloon
    const balloon = new THREE.Group();
    balloon.position.set(6, 15, -22);

    // Balloon envelope (scaled sphere)
    const envelopeGeom = new THREE.SphereGeometry(2.4, 8, 8);
    envelopeGeom.scale(1, 1.4, 1);
    const envelopeMat = new THREE.MeshStandardMaterial({
      color: 0xff6464,
      roughness: 0.6,
      flatShading: true,
    });
    const envelope = new THREE.Mesh(envelopeGeom, envelopeMat);
    balloon.add(envelope);

    // Yellow stripe ring
    const stripeGeom = new THREE.TorusGeometry(2.35, 0.15, 6, 12);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffb703 });
    const stripe = new THREE.Mesh(stripeGeom, stripeMat);
    stripe.rotation.x = Math.PI / 2;
    balloon.add(stripe);

    // Basket
    const basketGeom = new THREE.BoxGeometry(0.8, 0.6, 0.8);
    const basket = new THREE.Mesh(basketGeom, this.getMaterial('wood'));
    basket.position.y = -3.8;
    balloon.add(basket);

    group.add(balloon);

    // 3. Cute Low-Poly Paper Airplane
    const plane = new THREE.Group();
    plane.position.set(-10, 12, 0);

    const planeGeom = new THREE.ConeGeometry(0.6, 2.0, 3);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      flatShading: true,
    });
    const planeMesh = new THREE.Mesh(planeGeom, planeMat);
    planeMesh.rotation.x = Math.PI / 2;
    plane.add(planeMesh);

    group.add(plane);

    return { group, clouds, balloon, plane };
  }

  // --- Water Ocean Surface ---
  public buildOceanSurface(): { mesh: THREE.Mesh; update: (time: number) => void } {
    const size = 180;
    const segments = 45;
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    geom.rotateX(-Math.PI / 2);

    const waterMat = new THREE.MeshStandardMaterial({
      color: LIGHT_THEME_COLORS.water,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88,
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geom, waterMat);
    mesh.position.y = -0.15;
    mesh.receiveShadow = true;

    // Cache initial vertex positions for wave displacement
    const pos = geom.attributes.position;
    const initialY = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      initialY[i] = pos.getY(i);
    }

    const update = (time: number) => {
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getZ(i);
        const wave = Math.sin(u * 0.15 + time * 1.8) * 0.25 + Math.cos(v * 0.18 + time * 1.5) * 0.22;
        pos.setY(i, initialY[i] + wave);
      }
      pos.needsUpdate = true;
      geom.computeVertexNormals();
    };

    return { mesh, update };
  }
}
