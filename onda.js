let scene, camera, renderer, controls;
let waveX, waveY, waveGeometryX, waveGeometryY, materialX, materialY;
let incrementX = 0, incrementY = 0;

let waveParamsX = { amplitude: 100, length: 0.01, frequency: 0.02 };
let waveParamsY = { amplitude: 100, length: 0.01, frequency: 0.02 };

function init() {
    const canvasContainer = document.getElementById('waveCanvas');

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 100, 400);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
    canvasContainer.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 200;
    controls.maxDistance = 800;

    materialX = new THREE.LineBasicMaterial({ color: 0x00bfff });
    materialY = new THREE.LineBasicMaterial({ color: 0x8a2be2 });

    waveGeometryX = new THREE.BufferGeometry();
    const positionsX = new Float32Array(500 * 3);
    waveGeometryX.setAttribute('position', new THREE.BufferAttribute(positionsX, 3));

    waveGeometryY = new THREE.BufferGeometry();
    const positionsY = new Float32Array(500 * 3);
    waveGeometryY.setAttribute('position', new THREE.BufferAttribute(positionsY, 3));

    waveX = new THREE.Line(waveGeometryX, materialX);
    waveY = new THREE.Line(waveGeometryY, materialY);

    scene.add(waveX);
    scene.add(waveY);

    createCartesianPlane();

    window.addEventListener('resize', onWindowResize, false);
}

function createCartesianPlane() {
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    const points = [];

    points.push(new THREE.Vector3(-300, 0, 0));
    points.push(new THREE.Vector3(300, 0, 0));

    points.push(new THREE.Vector3(0, -300, 0));
    points.push(new THREE.Vector3(0, 300, 0));

    points.push(new THREE.Vector3(0, 0, -300));
    points.push(new THREE.Vector3(0, 0, 300));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineSegments(geometry, material);

    scene.add(line);
}

function updateWave() {
    const positionsX = waveGeometryX.attributes.position.array;
    const positionsY = waveGeometryY.attributes.position.array;

    for (let i = 0; i < 500; i++) {
        const x = i - 250;
        positionsX[i * 3] = x;
        positionsX[i * 3 + 1] = Math.sin(x * waveParamsX.length + incrementX) * waveParamsX.amplitude;
        positionsX[i * 3 + 2] = 0;
    }

    for (let i = 0; i < 500; i++) {
        const y = i - 250;
        positionsY[i * 3] = 0;
        positionsY[i * 3 + 1] = Math.sin(y * waveParamsY.length + incrementY) * waveParamsY.amplitude;
        positionsY[i * 3 + 2] = y;
    }

    waveGeometryX.attributes.position.needsUpdate = true;
    waveGeometryY.attributes.position.needsUpdate = true;

    incrementX += waveParamsX.frequency;
    incrementY += waveParamsY.frequency;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
}

document.getElementById('amplitudeX').addEventListener('input', function() {
    waveParamsX.amplitude = +this.value;
});

document.getElementById('lengthX').addEventListener('input', function() {
    waveParamsX.length = +this.value;
});

document.getElementById('frequencyX').addEventListener('input', function() {
    waveParamsX.frequency = +this.value;
});

document.getElementById('amplitudeY').addEventListener('input', function() {
    waveParamsY.amplitude = +this.value;
});

document.getElementById('lengthY').addEventListener('input', function() {
    waveParamsY.length = +this.value;
});

document.getElementById('frequencyY').addEventListener('input', function() {
    waveParamsY.frequency = +this.value;
});

function animate() {
    requestAnimationFrame(animate);
    updateWave();
    controls.update();
    renderer.render(scene, camera);
}

init();
animate();

// ©Elian projects [2024]. Todos los derechos reservados.
