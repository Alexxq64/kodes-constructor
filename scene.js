import { initBase, renderer, scene, camera, controls } from './js/init.js';
import { loadJersey, setupColorButtons } from './js/jersey.js';
import { setupLogoUpload, setupLogoInteraction } from './js/logo.js';

export function initScene() {
    console.log("Запуск модулей...");
    
    initBase(); // Сцена, свет, камера
    loadJersey(); // Футболка
    setupColorButtons(); // Кнопки цветов
    setupLogoUpload(); // Кнопка загрузки логотипа
    setupLogoInteraction(); // Управление логотипом мышкой

    animate();
}

function animate() {
    requestAnimationFrame(animate); 
    if (controls) controls.update(); 
    if (renderer && scene && camera) renderer.render(scene, camera); 
}