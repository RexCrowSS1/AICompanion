import { useEffect, useRef } from "react";
import * as THREE from "three";
import { variantStyles } from "../../constants/sceneVariants";

function makeMainGeometry(type) {
  if (type === "ribbon") return new THREE.TorusKnotGeometry(1.18, 0.12, 240, 18, 3, 7);
  if (type === "crystal") return new THREE.IcosahedronGeometry(1.42, 1);
  if (type === "halo") return new THREE.TorusGeometry(1.48, 0.12, 20, 180);
  if (type === "vault") return new THREE.BoxGeometry(1.86, 1.86, 1.86, 5, 5, 5);
  if (type === "wave") return new THREE.TorusKnotGeometry(1.08, 0.22, 180, 16, 2, 5);
  if (type === "prism") return new THREE.OctahedronGeometry(1.6, 2);
  return new THREE.IcosahedronGeometry(1.46, 3);
}

export default function CompanionScene3D({ className = "", variant = "hero", intensity = 1 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const style = variantStyles[variant] || variantStyles.hero;
    let isVisible = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.08, 6.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.55));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const mainGeometry = makeMainGeometry(style.geometry);
    const mainMaterial = new THREE.MeshBasicMaterial({
      color: style.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.72,
    });
    const main = new THREE.Mesh(mainGeometry, mainMaterial);
    main.scale.setScalar(style.scale || 1);
    group.add(main);

    const glassGeometry =
      style.geometry === "vault"
        ? new THREE.DodecahedronGeometry(1.82, 1)
        : new THREE.BoxGeometry(2.34, 2.34, 2.34, 5, 5, 5);
    const glassMaterial = new THREE.MeshBasicMaterial({
      color: style.ghost,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.rotation.set(0.65, 0.4, 0.22);
    group.add(glass);

    const satelliteGroup = new THREE.Group();
    const satelliteMaterial = new THREE.MeshBasicMaterial({
      color: style.secondary,
      wireframe: style.geometry !== "halo",
      transparent: true,
      opacity: 0.42,
    });
    const satelliteGeometry =
      style.geometry === "crystal"
        ? new THREE.TetrahedronGeometry(0.22, 0)
        : style.geometry === "halo"
          ? new THREE.SphereGeometry(0.075, 16, 16)
          : new THREE.OctahedronGeometry(0.16, 0);
    for (let index = 0; index < 10; index += 1) {
      const angle = (index / 10) * Math.PI * 2;
      const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
      satellite.position.set(Math.cos(angle) * 2.55, Math.sin(angle * 1.7) * 0.72, Math.sin(angle) * 2.1);
      satellite.rotation.set(angle, angle * 0.5, angle * 0.3);
      satelliteGroup.add(satellite);
    }
    group.add(satelliteGroup);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: style.secondary,
      wireframe: true,
      transparent: true,
      opacity: 0.54,
    });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.28, 0.014, 8, 160), ringMaterial);
    const ringB = ringA.clone();
    const ringC = ringA.clone();
    ringA.rotation.x = Math.PI / 2.25;
    ringB.rotation.y = Math.PI / 2.85;
    ringC.rotation.set(Math.PI / 3.2, Math.PI / 4.2, 0);
    group.add(ringA, ringB, ringC);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: style.primary,
      transparent: true,
      opacity: 0.24,
    });
    const lineGroup = new THREE.Group();
    for (let index = 0; index < 18; index += 1) {
      const radius = 1.8 + (index % 6) * 0.11;
      const angle = (index / 18) * Math.PI * 2;
      const points = [
        new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, -1.2),
        new THREE.Vector3(Math.cos(angle + 0.45) * (radius + 0.32), Math.sin(angle + 0.45) * (radius + 0.32), 1.2),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lineGroup.add(new THREE.Line(geometry, lineMaterial));
    }
    group.add(lineGroup);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 160;
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 2.35 + Math.random() * 1.75;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: style.ghost,
        size: 0.026,
        transparent: true,
        opacity: 0.46,
      }),
    );
    group.add(particles);

    function resize() {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true;
      },
      { rootMargin: "260px" },
    );
    visibilityObserver.observe(mount);

    let frameId = 0;
    const clock = new THREE.Clock();
    function animate() {
      const elapsed = clock.getElapsedTime();
      const rect = mount.getBoundingClientRect();
      const localProgress = Math.min(
        1,
        Math.max(0, 1 - rect.top / Math.max(1, window.innerHeight)),
      );
      const eased = localProgress * localProgress * (3 - 2 * localProgress);

      group.rotation.y = elapsed * 0.16 * intensity + eased * Math.PI * 1.35;
      group.rotation.x = -0.34 + Math.sin(eased * Math.PI) * 0.72;
      main.rotation.z = elapsed * 0.22 * intensity + eased * 1.4;
      glass.rotation.x = 0.65 + elapsed * 0.08;
      glass.rotation.y = 0.4 + eased * Math.PI;
      particles.rotation.y = -elapsed * 0.045;
      satelliteGroup.rotation.y = -elapsed * 0.2 + eased * 1.9;
      satelliteGroup.rotation.x = Math.sin(elapsed * 0.45) * 0.18;
      lineGroup.rotation.z = elapsed * 0.06 + eased * 0.8;
      ringA.rotation.z = elapsed * 0.19 + eased * 1.7;
      ringB.rotation.x = elapsed * 0.15 + eased * 1.2;
      ringC.rotation.y = -elapsed * 0.11 + eased * 1.5;

      if (isVisible) renderer.render(scene, camera);
      if (!reducedMotion.matches) frameId = window.requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      mainGeometry.dispose();
      mainMaterial.dispose();
      glassGeometry.dispose();
      glassMaterial.dispose();
      satelliteGeometry.dispose();
      satelliteMaterial.dispose();
      ringA.geometry.dispose();
      ringMaterial.dispose();
      lineGroup.children.forEach((line) => line.geometry.dispose());
      lineMaterial.dispose();
      particleGeometry.dispose();
      renderer.dispose();
    };
  }, [intensity, variant]);

  return <div className={`scene-canvas ${className}`} ref={mountRef} aria-hidden="true" />;
}
