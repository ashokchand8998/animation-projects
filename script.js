import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as openSimplexNoise from 'open-simplex-noise'
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import { FontLoader } from 'three/addons/loaders/FontLoader.js';

const scene = new THREE.Scene();

// material and geometry as mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);

// const points = [];
// points.push(new THREE.Vector3(- 10, 0, 0));
// points.push(new THREE.Vector3(0, 10, 0));
// points.push(new THREE.Vector3(10, 0, 0));
// const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.MeshPhongMaterial({
    color: "blue"
})
const cube = new THREE.Mesh(geometry, material);
cube.position.x = 3;
cube.position.y = 3;
// const line = new THREE.Line(geometry, material);

// text model
// const loader = new FontLoader();

scene.add(cube);

let sphereGeometry = new THREE.SphereGeometry(1.5, 100, 100);

sphereGeometry.positionData = [];
let v3 = new THREE.Vector3();
for (let i = 0; i < sphereGeometry.attributes.position.count; i++) {
    v3.fromBufferAttribute(sphereGeometry.attributes.position, i);
    sphereGeometry.positionData.push(v3.clone());
}

const weirdSphere = new THREE.Mesh(sphereGeometry, new THREE.MeshPhongMaterial({ color: 'pink' }));
scene.add(weirdSphere);



const particleSystem = new THREE.Points(new THREE.SphereGeometry(3, 100, 100), new THREE.PointsMaterial({
    color: "yellow",
    size: 0.005
}));
particleSystem.name = "ParticlSystem";
particleSystem.position.x = 0;
particleSystem.position.y = 0;
scene.add(particleSystem)



const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);
scene.add(camera)

const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
light1.position.set(-3, -4, 3);
const light2 = new THREE.DirectionalLight(0xffffff, 2);
light1.position.set(-1, -1, -1);
scene.add(light1);
scene.add(light2);


// initating rederer with the canvas element and updating its size as well
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
document.body.appendChild(renderer.domElement);
renderer.setSize(sizes.width, sizes.height)
console.log("openSimplexNoise", openSimplexNoise)
let noise = openSimplexNoise.makeNoise4D(Date.now());
let clock = new THREE.Clock();
renderer.setClearColor ("dark-grey", 1)

new OrbitControls(camera, renderer.domElement);

// rendering the scene into renderer
function animate() {
    requestAnimationFrame(animate);

    // particleSystem.rotation.x += 0.01;
    // particleSystem.rotation.y += 0.01;

    let t = clock.getElapsedTime();
    sphereGeometry.positionData.forEach((p, idx) => {
        // Create noise for each point in our sphere
        let setNoise = noise(p.x, p.y, p.z, t * 1.05);
        // Using our Vector3 function, copy the point data, and multiply it by the noise
        // this looks confusing - but it's just multiplying noise by the position at each vertice
        v3.copy(p).addScaledVector(p, setNoise);
        // Update the positions
        sphereGeometry.attributes.position.setXYZ(idx, v3.x, v3.y, v3.z);
    })
    // Some housekeeping so that the sphere looks "right"
    sphereGeometry.computeVertexNormals();
    sphereGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();