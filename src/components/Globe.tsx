import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Location {
  name: string;
  lat: number;
  lng: number;
  note: string;
}

const locations: Location[] = [
  { name: 'Santiago, Chile', lat: -33.45, lng: -70.67, note: 'Photos coming soon' },
  { name: 'Antigua, Guatemala', lat: 14.56, lng: -90.73, note: 'Photos coming soon' },
  { name: 'London, England', lat: 51.51, lng: -0.13, note: 'Photos coming soon' },
  // Add more locations here — just add to this array
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; note: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a1a2e,
      emissive: 0x0a0a15,
      specular: 0x333355,
      shininess: 25,
      transparent: true,
      opacity: 0.9,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Wireframe overlay
    const wireGeometry = new THREE.SphereGeometry(1.002, 36, 36);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x2a2a4a,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wireframe);

    // Atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a6fa5,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial));

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x8899bb, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Location markers
    const markers: THREE.Mesh[] = [];
    const markerGroup = new THREE.Group();

    locations.forEach((loc) => {
      const pos = latLngToVector3(loc.lat, loc.lng, 1.02);

      // Glowing marker
      const markerGeo = new THREE.SphereGeometry(0.02, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0xc8a87c });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      marker.userData = loc;
      markers.push(marker);
      markerGroup.add(marker);

      // Outer glow ring
      const ringGeo = new THREE.RingGeometry(0.03, 0.045, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc8a87c,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      markerGroup.add(ring);
    });

    scene.add(markerGroup);

    // Raycaster for hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markers);

      if (intersects.length > 0) {
        const loc = intersects[0].object.userData as Location;
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          name: loc.name,
          note: loc.note,
        });
        container.style.cursor = 'pointer';
      } else {
        setTooltip(null);
        container.style.cursor = 'grab';
      }
    };

    container.addEventListener('mousemove', onMouseMove);

    // Drag rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      container.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      container.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      rotationVelocity.x = deltaY * 0.005;
      rotationVelocity.y = deltaX * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Zoom
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      camera.position.z = Math.max(1.8, Math.min(5, camera.position.z + e.deltaY * 0.002));
    }, { passive: false });

    // Touch support
    let touchStart = { x: 0, y: 0 };
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStart.x;
      const deltaY = e.touches[0].clientY - touchStart.y;
      rotationVelocity.x = deltaY * 0.005;
      rotationVelocity.y = deltaX * 0.005;
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    container.addEventListener('touchend', () => { isDragging = false; }, { passive: true });

    // Animate
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!isDragging) {
        // Auto-rotate
        globe.rotation.y += 0.002;
        wireframe.rotation.y += 0.002;
        markerGroup.rotation.y += 0.002;
      }

      // Apply drag rotation
      globe.rotation.x += rotationVelocity.x;
      globe.rotation.y += rotationVelocity.y;
      wireframe.rotation.x = globe.rotation.x;
      wireframe.rotation.y = globe.rotation.y;
      markerGroup.rotation.x = globe.rotation.x;
      markerGroup.rotation.y = globe.rotation.y;

      // Damping
      rotationVelocity.x *= 0.95;
      rotationVelocity.y *= 0.95;

      // Pulse markers
      const time = Date.now() * 0.003;
      markers.forEach((m, i) => {
        const scale = 1 + Math.sin(time + i) * 0.2;
        m.scale.setScalar(scale);
      });

      renderer.render(scene, camera);
    };

    setIsLoading(false);
    animate();

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[600px]" style={{ cursor: 'grab' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
          Loading globe...
        </div>
      )}
      <div ref={mountRef} className="w-full h-full" />
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-black/90 border border-gray-700 rounded-lg px-4 py-3 text-sm z-10"
          style={{ left: tooltip.x + 16, top: tooltip.y - 16 }}
        >
          <div className="text-white font-medium">{tooltip.name}</div>
          <div className="text-gray-400 text-xs mt-1">{tooltip.note}</div>
        </div>
      )}
    </div>
  );
}
