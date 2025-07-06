<template>
  <div class="home">
    <div ref="canvasContainer" class="canvas-container"></div>
    <div class="content">
      <h1 class="title">Welcome to MediCare+</h1>
      <p class="subtitle">Your personalized healthcare companion</p>
      <router-link to="/login" class="login-btn">
        <span>Get Started</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </router-link>
    </div>
  </div>
</template>
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from 'vue';

export default {
  name: 'HomePage',
  setup() {
    const canvasContainer = ref(null);

    onMounted(() => {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f4ff);
      
      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      canvasContainer.value.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      // Create different shaped tablets
      const createTablet = (colorHex, size, shape, x, y, z) => {
        const color = new THREE.Color(colorHex);
        let geometry;
        
        switch(shape) {
          case 'round':
            geometry = new THREE.CylinderGeometry(size.width/2, size.width/2, size.height, 32);
            break;
          case 'capsule':
            geometry = new THREE.CapsuleGeometry(size.width/2, size.height, 4, 8);
            break;
          case 'oval':
            geometry = new THREE.SphereGeometry(size.width/2, 32, 16, 0, Math.PI * 2, 0, Math.PI);
            break;
          default:
            geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        }
        
        const material = new THREE.MeshPhongMaterial({ 
          color: color,
          emissive: color.clone().multiplyScalar(0.2),
          specular: 0xffffff,
          shininess: 30,
          transparent: true,
          opacity: 0.9
        });
        
        const tablet = new THREE.Mesh(geometry, material);
        tablet.position.set(x, y, z);
        tablet.userData = {
          speed: Math.random() * 0.01 + 0.005,
          angle: Math.random() * Math.PI * 2
        };
        return tablet;
      };

      // Create medical injection
      const createInjection = (x, y, z) => {
        const group = new THREE.Group();
        
        // Syringe body
        const syringeGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 32);
        const syringeMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          shininess: 50
        });
        const syringe = new THREE.Mesh(syringeGeometry, syringeMaterial);
        syringe.position.y = 0.4;
        group.add(syringe);
        
        // Plunger
        const plungerGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 32);
        const plungerMaterial = new THREE.MeshPhongMaterial({
          color: 0xdddddd
        });
        const plunger = new THREE.Mesh(plungerGeometry, plungerMaterial);
        plunger.position.y = 0.9;
        group.add(plunger);
        
        // Needle
        const needleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
        const needleMaterial = new THREE.MeshPhongMaterial({
          color: 0xaaaaaa,
          metalness: 0.8
        });
        const needle = new THREE.Mesh(needleGeometry, needleMaterial);
        needle.position.y = -0.2;
        needle.rotation.x = Math.PI/2;
        group.add(needle);
        
        // Medicine in syringe
        const medicineGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.6, 32);
        const medicineMaterial = new THREE.MeshPhongMaterial({
          color: 0x00ff00,
          transparent: true,
          opacity: 0.7
        });
        const medicine = new THREE.Mesh(medicineGeometry, medicineMaterial);
        medicine.position.y = 0.2;
        group.add(medicine);
        
        group.position.set(x, y, z);
        group.userData = {
          speed: Math.random() * 0.008 + 0.003,
          angle: Math.random() * Math.PI * 2
        };
        return group;
      };

      // Create multiple medical objects
      const medicalObjects = [];
      
      // Left side objects
      medicalObjects.push(createTablet(0x512da8, {width: 0.4, height: 0.2}, 'round', -2, 0.5, 0));
      medicalObjects.push(createTablet(0xff5733, {width: 0.6, height: 0.3}, 'capsule', -1.8, -0.3, 0.5));
      medicalObjects.push(createInjection(-2.5, 0, -0.5));
      
      // Right side objects
      medicalObjects.push(createTablet(0x5e35b1, {width: 0.5, height: 0.15}, 'oval', 2, 0.7, 0));
      medicalObjects.push(createTablet(0x00b894, {width: 0.3, height: 0.3, depth: 0.1}, 'box', 1.8, -0.4, 0.3));
      medicalObjects.push(createInjection(2.5, -0.2, -0.3));
      
      // Add to scene
      medicalObjects.forEach(obj => scene.add(obj));

      // Controls - subtle auto-rotation
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.maxPolarAngle = Math.PI * 0.5;
      controls.minPolarAngle = Math.PI * 0.25;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        
        // Float animation for medical objects
        medicalObjects.forEach(obj => {
          obj.rotation.x += obj.userData.speed * 0.5;
          obj.rotation.y += obj.userData.speed;
          
          // Gentle floating movement
          obj.userData.angle += obj.userData.speed * 0.3;
          obj.position.y = obj.position.y + Math.sin(obj.userData.angle) * 0.005;
        });
        
        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        canvasContainer.value?.removeChild(renderer.domElement);
      };
    });

    return { canvasContainer };
  }
};
</script>

<style scoped>

.home {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 20px;
}

.title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #2d3748;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background: linear-gradient(90deg, #512da8 0%, #5e35b1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 2rem;
  max-width: 600px;
}

.login-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 15px 30px;
  background-color: #512da8;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(81, 45, 168, 0.3);
}

.login-btn:hover {
  background-color: #5e35b1;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(81, 45, 168, 0.4);
}

.login-btn svg {
  margin-left: 10px;
  transition: transform 0.3s ease;
}

.login-btn:hover svg {
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
}
</style>