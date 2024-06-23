import { useEffect } from "react"
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function FirstPost() {
    useEffect(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(w, h)
        document.body.appendChild(renderer.domElement)

        const fov = 75
        const aspect = w / h
        const near = 0.1
        const far = 10
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.position.z = 2;

        const scene = new THREE.Scene();

        // for controlling through mouse
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.03;

        // adding an element
        const geo = new THREE.IcosahedronGeometry(1.0, 2);
        const mat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            flatShading: true
        })
        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh)

        // creating another element and merging it on another element
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        })
        const wireMesh = new THREE.Mesh(geo, wireMat);
        wireMesh.scale.setScalar(1.001)
        mesh.add(wireMesh)

        // adding lightsource
        const hemLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500, 1)
        scene.add(hemLight)


        function animate(t = 0) {
            requestAnimationFrame(animate)
            mesh.rotation.y = t * 0.0001;
            controls.update();
            // mesh.scale.setScalar(Math.cos(t * 0.001) + 1.0);
            renderer.render(scene, camera)
        }

        animate();
    }, [])

    return <></>
}