import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { Plane } from "./plane";
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";

export class skybox {
    //skybox
    makeSkybox(scene, renderer, gui) {
        let mesh3;
        //water:
        const waterGeometry = new THREE.PlaneGeometry(10000000, 7000000);
        let water = new Water(waterGeometry, {
            textureWidth: 1024,
            textureHeight: 1024,
            waterNormals: new THREE.TextureLoader().load(
                "../image/waternormals.jpg",
                function (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                },
            ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e5f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined,
        });
        water.position.z = 150000;
        water.rotation.x = -Math.PI / 2;
        water.renderDepth = 1;
        scene.add(water);
        //endWater:

        //skybox:
        const sky = new Sky();
        sky.scale.setScalar(10000000);
        scene.add(sky);

        const skyUniforms = sky.material.uniforms;

        skyUniforms["turbidity"].value = 10;
        skyUniforms["rayleigh"].value = 2;
        skyUniforms["mieCoefficient"].value = 0.005;
        skyUniforms["mieDirectionalG"].value = 0.8;

        const parameters = {
            elevation: 6.3,
            azimuth: -34,
        };

        let sun = new THREE.Vector3();

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        let renderTarget;

        function updateSun() {
            const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
            const theta = THREE.MathUtils.degToRad(parameters.azimuth);

            sun.setFromSphericalCoords(1, phi, theta);

            sky.material.uniforms["sunPosition"].value.copy(sun);
            // water.material.uniforms["sunDirection"].value.copy(sun).normalize();

            //object.material.uniforms["sunDirection"].value.copy(sun).normalize();

            if (renderTarget !== undefined) renderTarget.dispose();

            renderTarget = pmremGenerator.fromScene(sky);

            scene.environment = renderTarget.texture;
        }
        updateSun();
        // end skybox

        // GUI

        const folderSky = gui.addFolder("Sky");
        folderSky.add(parameters, "elevation", 0, 90, 0.1).onChange(updateSun);
        folderSky
            .add(parameters, "azimuth", -180, 180, 0.1)
            .onChange(updateSun);
        folderSky.open();
        const waterUniforms = water.material.uniforms;
        waterUniforms.size.value = 3;
        const rainconunt = { value: 0 };

        const folderWater = gui.addFolder("Water");
        folderWater
            .add(waterUniforms.distortionScale, "value", 0, 8, 0.1)
            .name("distortionScale");
        folderWater.add(waterUniforms.size, "value", 0.1, 10, 0.1).name("size");
        folderWater.add(rainconunt, "value", 0, 100000, 0.1).name("rain");
        folderWater.open();

        // city -------------------------------------------------------------------------
        const city1 = new GLTFLoader().setPath("../modale/city/").load(
            "scene.gltf",
            function (gltf) {
                let mesh = gltf.scene;
                mesh.scale.multiplyScalar(100000);
                mesh.position.set(1000000, 1000, -900000);
                mesh.rotation.set(0, Math.PI, 0);
                scene.add(mesh);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
        );
        new GLTFLoader().setPath("../modale/city/").load(
            "scene.gltf",
            function (gltf) {
                let mesh2 = gltf.scene;
                mesh2.scale.multiplyScalar(100000);
                mesh2.position.set(-1000000, 1000, -900000);
                scene.add(mesh2);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
        );

        new GLTFLoader().setPath("../modale/airport/").load(
            "scene.gltf",
            function (gltf1) {
                let mesh2 = gltf1.scene;
                mesh2.scale.multiplyScalar(8);
                mesh2.position.y = 118;
                mesh2.rotation.y = -Math.PI / 2;
                mesh2.position.x = -1000;
                mesh2.position.z = 1000000;

                scene.add(mesh2);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
        );

        //مطر
        const particlesGeometry = new THREE.BufferGeometry();
        const count = 100000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = Math.random() * 1000000 - 500000;
        }
        particlesGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3),
        );
        let rainmaterial = new THREE.PointsMaterial({
            color: 0x999999,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
        });
        const rain = new THREE.Points(particlesGeometry, rainmaterial);
        scene.add(rain);

        function animate() {
            requestAnimationFrame(animate);
            const time = performance.now() * 0.01;
            water.material.uniforms["time"].value += 2.0 / 60.0;

            //مطر
            const positions = rain.geometry.attributes.position.array;

            for (let i = 0; i < count * 3; i += 3) {
                positions[i + 1] -= 2000 + Math.random() * 0.1;
                if (positions[i + 1] < -500000) {
                    positions[i + 1] = 500000;
                }
                rain.geometry.attributes.position.needsUpdate = true;
                rain.geometry.attributes.position.count = rainconunt.value;
            }
        }
        setTimeout(() => {
            animate();
        }, 5000);
    }
}
