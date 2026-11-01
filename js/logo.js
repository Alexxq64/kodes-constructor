// Управляет загрузкой логотипа, наложением его на поверхность (Decal), перетаскиванием и масштабированием
import * as THREE from 'three';
import { scene, camera, renderer, controls } from './init.js';
import { jerseyBody } from './jersey.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';

let logoMesh = null;
let isDragging = false;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Переменные для хранения текущих настроек логотипа
let currentDecalPosition = new THREE.Vector3();
let currentDecalSize = new THREE.Vector3(1, 1, 1); 
let currentDecalRotation = new THREE.Euler(0, 0, 0);

export function setupLogoUpload() {
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('logo-upload');

    if(!uploadBtn || !fileInput) return;

    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(e.target.result, (texture) => {
                applyDecalLogo(texture);
            });
        };
        reader.readAsDataURL(file);
    });
}

function applyDecalLogo(texture) {
    if (!jerseyBody) {
        console.error("Футболка еще не загружена!");
        return;
    }

    if (logoMesh) {
        scene.remove(logoMesh);
        logoMesh.geometry.dispose();
    }

    const decalMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
    });

    // Ищем центр груди (стреляем лучом из центра экрана)
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersects = raycaster.intersectObject(jerseyBody);

    if (intersects.length > 0) {
        // Нашли точку на футболке
        currentDecalPosition.copy(intersects[0].point);
        currentDecalPosition.z += 0.01; // Чуть выдвигаем вперед
        
        // Задаем размер (1 - это стандарт для этой модели)
        currentDecalSize.set(1, 1, 1);

        const decalGeometry = new DecalGeometry(
            jerseyBody,
            currentDecalPosition,
            currentDecalRotation,
            currentDecalSize
        );

        logoMesh = new THREE.Mesh(decalGeometry, decalMaterial);
        
        // Важно: добавляем в сцену, а не в футболку!
        scene.add(logoMesh);
        console.log("Логотип наложен.");
    } else {
        console.error("Не удалось найти поверхность футболки.");
    }
}

export function setupLogoInteraction() {
    const canvas = renderer.domElement;

    canvas.addEventListener('pointerdown', (event) => {
        if (!logoMesh) return;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        
        const intersects = raycaster.intersectObject(logoMesh);

        if (intersects.length > 0) {
            isDragging = true;
            controls.enabled = false; 
        }
    });

    canvas.addEventListener('pointerup', () => {
        isDragging = false;
        controls.enabled = true; 
    });

    canvas.addEventListener('pointermove', (event) => {
        // Перетаскивание
        if (isDragging && logoMesh) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObject(jerseyBody);

            if (intersects.length > 0) {
                currentDecalPosition.copy(intersects[0].point);
                currentDecalPosition.z += 0.01;

                const newDecalGeometry = new DecalGeometry(
                    jerseyBody,
                    currentDecalPosition,
                    currentDecalRotation,
                    currentDecalSize
                );

                logoMesh.geometry.dispose(); 
                logoMesh.geometry = newDecalGeometry; 
            }
            return; 
        }

        // Отключение зума камеры при наведении
        if (logoMesh) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(logoMesh);

            if (intersects.length > 0) {
                controls.enableZoom = false;
            } else {
                controls.enableZoom = true;
            }
        }
    });

    // Масштабирование
    canvas.addEventListener('wheel', (event) => {
        if (!logoMesh || controls.enableZoom) return; 

        event.preventDefault(); 
        const scaleAmount = event.deltaY > 0 ? 0.9 : 1.1;
        
        currentDecalSize.multiplyScalar(scaleAmount);
        if (currentDecalSize.x < 0.1) currentDecalSize.set(0.1, 0.1, 0.1);

        const newDecalGeometry = new DecalGeometry(
            jerseyBody,
            currentDecalPosition,
            currentDecalRotation,
            currentDecalSize
        );

        logoMesh.geometry.dispose(); 
        logoMesh.geometry = newDecalGeometry; 
    }, { passive: false });
}