import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Переменные уровня модуля
let scene, camera, renderer, controls;

export function initScene() {
    console.log("1. Инициализация сцены...");

    // 1. Создаем фундамент (сцена, камера, рендерер)
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222); 

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5); 

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 2. Управление мышкой
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;

    // 3. Добавляем свет (вызываем отдельную функцию)
    setupLighting();

    // 4. Добавляем тестовый куб (вызываем отдельную функцию)
    addTestCube();

    // 5. Вставляем холст в HTML
    const container = document.getElementById('canvas-container');
    if (container) {
        container.appendChild(renderer.domElement); 
    } else {
        console.error("Ошибка: Не найден контейнер #canvas-container в HTML!");
    }

    // 6. Запускаем анимацию
    animate();
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

function setupLighting() {
    // Общий свет
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // Направленный свет (солнце)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
}

function addTestCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00aaff }); 
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}

// Функция анимации
function animate() {
    requestAnimationFrame(animate); 

    if (controls) {
        controls.update(); 
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera); 
    }
}