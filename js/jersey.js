import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene, jerseyMaterials } from './init.js';

export let jerseyBody = null;

export function loadJersey() {
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
                
                if (!jerseyBody) {
                    jerseyBody = newMesh; 
                }
                
                scene.add(newMesh);
            }
        });
    }, undefined, (error) => {
        console.error('Ошибка при загрузке модели:', error);
    });
}

export function setupColorButtons() {
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
            }
        });
    });
}