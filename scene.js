import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let testCube; // <-- 1. Сохраняем сам куб, а не только материал

export function initScene() {
    console.log("1. Инициализация сцены...");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222); 

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5); 

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;

    setupLighting();
    addTestCube();
    setupUI();    

    const container = document.getElementById('canvas-container');
    if (container) {
        container.appendChild(renderer.domElement); 
    } else {
        console.error("Ошибка: Не найден контейнер #canvas-container в HTML!");
    }

    animate();
}

function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
}

function addTestCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00aaff }); 
    testCube = new THREE.Mesh(geometry, material); // <-- 2. Сохраняем куб
    scene.add(testCube);
}

function setupUI() {
    const buttons = document.querySelectorAll('.color-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            let newColor = event.target.getAttribute('data-color');
            
            if (testCube && newColor) {
                // Превращаем строку "0xff3333" в число 0xff3333
                const hexColor = parseInt(newColor, 16); 

                // Создаем новый материал с правильным числовым цветом
                const newMaterial = new THREE.MeshStandardMaterial({ color: hexColor });
                
                // Удаляем старый материал, чтобы не забивать память
                testCube.material.dispose();
                
                // Присваиваем кубу новый материал
                testCube.material = newMaterial; 
                
                console.log("Цвет куба изменен на:", newColor);
            }
        });
    });
}

function animate() {
    requestAnimationFrame(animate); 

    if (controls) {
        controls.update(); 
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera); 
    }
}