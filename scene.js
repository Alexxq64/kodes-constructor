// Мы импортируем библиотеку Three.js, которую подключили в index.html
import * as THREE from 'three';

// Объявляем переменные на уровне модуля, чтобы к ним имели доступ разные функции
let scene, camera, renderer;

export function initScene() {
    console.log("1. Функция initScene запущена.");

    // 1. Создаем сцену (это наша "комната", где будут жить 3D-объекты)
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222); // Красим комнату в темно-серый цвет

    // 2. Создаем камеру (это наши "глаза")
    // Параметры: угол обзора (45), соотношение сторон (ширина/высота окна), ближняя граница, дальняя граница
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5); // Ставим камеру в координаты x=0, y=0, z=5 (отходим на 5 шагов назад)

    // 3. Создаем рендерер (это "художник", который рисует 3D на экране)
    renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias: true делает края объектов гладкими, без "лесенок"
    renderer.setSize(window.innerWidth, window.innerHeight); // Задаем размер холста на весь экран
    renderer.setPixelRatio(window.devicePixelRatio); // Делаем картинку четкой на экранах с высоким разрешением (Retina)

    // === ДОБАВЛЯЕМ СВЕТ ===
    // 1. AmbientLight (Общий свет). Он освещает все объекты равномерно со всех сторон.
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // 0xffffff - белый цвет, 1.5 - интенсивность
    scene.add(ambientLight);

    // 2. DirectionalLight (Направленный свет). Работает как солнце: светит с одной стороны.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5); // Ставим "солнце" в координаты x=5, y=5, z=5
    scene.add(directionalLight);

    // === ДОБАВЛЯЕМ ТЕСТОВЫЙ ОБЪЕКТ (КУБ) ===
    // 1. Геометрия (форма). BoxGeometry создает куб. Размеры 1x1x1.
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // 2. Материал (из чего сделан объект). MeshStandardMaterial реагирует на свет.
    const material = new THREE.MeshStandardMaterial({ color: 0x00aaff }); // Красим куб в голубой цвет
    
    // 3. Создаем сам объект (Mesh), объединяя геометрию и материал.
    const cube = new THREE.Mesh(geometry, material);
    
    // 4. Добавляем куб на сцену.
    scene.add(cube);    

    // 4. Добавляем холст рендерера на нашу HTML-страницу
    const container = document.getElementById('canvas-container');
    if (container) {
        container.appendChild(renderer.domElement); // Берем холст, который создал Three.js, и вставляем его в div с id="canvas-container"
    } else {
        console.error("Ошибка: Не найден контейнер #canvas-container в HTML!");
    }

    // 5. Запускаем анимацию
    animate();
}

// Функция анимации. Она будет вызываться браузером 60 раз в секунду
function animate() {
    requestAnimationFrame(animate); // Просим браузер вызвать эту функцию снова в следующем кадре

    // Пока мы ничего не рисуем внутри сцены, но команда render вызывается
    if (renderer && scene && camera) {
        renderer.render(scene, camera); // "Художник" смотрит на "комнату" через "глаза" и рисует картинку
    }
}