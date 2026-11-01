import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, controls;
let jerseyMaterials = []; 

export function initScene() {
    console.log("1. Инициализация сцены...");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd); 

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5); 

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;

    setupLighting();
    setupFloor();
    loadJersey();
    setupUI();    

    const container = document.getElementById('canvas-container');
    if (container) {
        container.appendChild(renderer.domElement); 
    }

    animate();
}

function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 5);
    
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;

    scene.add(directionalLight);
}

function setupFloor() {
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2; 
    floor.receiveShadow = true;
    
    scene.add(floor);
}

function loadJersey() {
    const loader = new GLTFLoader();

    loader.load('./assets/t-shirt_-_lengan_pendek.glb', (gltf) => {
        
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                const geometry = child.geometry;
                
                geometry.computeBoundingBox();
                const center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                geometry.translate(-center.x, -center.y, -center.z);

                const material = new THREE.MeshStandardMaterial({ 
                    color: 0xffffff,
                    side: THREE.DoubleSide,
                    roughness: 0.7,
                    metalness: 0.1
                });
                
                jerseyMaterials.push(material);
                
                const newMesh = new THREE.Mesh(geometry, material);
                newMesh.scale.set(0.003, 0.003, 0.003);
                newMesh.rotation.x = -Math.PI / 2;

                newMesh.castShadow = true;
                newMesh.receiveShadow = true; 
                
                scene.add(newMesh);
            }
        });

        camera.position.set(0, 0, 5); 
        controls.target.set(0, 0, 0);
        controls.update();
    }, undefined, (error) => {
        console.error('Ошибка при загрузке модели:', error);
    });
}

function setupUI() {
    const buttons = document.querySelectorAll('.color-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            let newColor = event.target.getAttribute('data-color');
            
            if (jerseyMaterials.length > 0 && newColor) {
                const hexColor = parseInt(newColor, 16); 
                
                jerseyMaterials.forEach(mat => {
                    mat.color.set(hexColor);
                    mat.needsUpdate = true;
                });
                
                console.log("Цвет изменен на:", newColor);
            }
        });
    });
}

function animate() {
    requestAnimationFrame(animate); 
    if (controls) controls.update(); 
    if (renderer && scene && camera) renderer.render(scene, camera); 
}