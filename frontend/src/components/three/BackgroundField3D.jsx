import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BackgroundField3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let pointerX = 0;
    let pointerY = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 260;
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 15;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xf4f0e8,
        size: 0.018,
        transparent: true,
        opacity: 0.38,
      }),
    );
    group.add(particles);

    const ribbonMaterial = new THREE.MeshBasicMaterial({
      color: 0x8ee1d1,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const ribbons = [
      new THREE.Mesh(new THREE.TorusKnotGeometry(2.8, 0.035, 260, 8, 2, 5), ribbonMaterial),
      new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.018, 8, 220), ribbonMaterial.clone()),
      new THREE.Mesh(new THREE.TorusGeometry(4.18, 0.012, 8, 220), ribbonMaterial.clone()),
    ];
    ribbons[0].position.set(-3.2, 1.25, -1.8);
    ribbons[1].position.set(3.55, -0.75, -2.4);
    ribbons[1].rotation.set(1.2, 0.25, 0.5);
    ribbons[2].position.set(0.7, -1.85, -3.2);
    ribbons[2].rotation.set(0.2, 1.05, 0.1);
    group.add(...ribbons);

    function resize() {
      const width = mount.clientWidth || window.innerWidth || 1;
      const height = mount.clientHeight || window.innerHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function onPointerMove(event) {
      pointerX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointerY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();

    let frameId = 0;
    const clock = new THREE.Clock();
    function animate() {
      const elapsed = clock.getElapsedTime();
      const scroll = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      group.rotation.x += (pointerY * 0.12 - group.rotation.x) * 0.035;
      group.rotation.y += (pointerX * 0.16 + scroll * 1.1 - group.rotation.y) * 0.035;
      particles.rotation.z = elapsed * 0.012;
      ribbons.forEach((ribbon, index) => {
        ribbon.rotation.x += 0.0016 + index * 0.0007;
        ribbon.rotation.y += 0.0012 + index * 0.0005;
      });
      renderer.render(scene, camera);
      if (!reducedMotion.matches) frameId = window.requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      particleGeometry.dispose();
      particles.material.dispose();
      ribbons.forEach((ribbon) => {
        ribbon.geometry.dispose();
        ribbon.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return <div className="background-scene" ref={mountRef} aria-hidden="true" />;
}
