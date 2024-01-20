import "./style.css";

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import * as dat from "dat.gui";
import { Plane } from "./plane";
import gsap from "gsap";
import { Physics } from "./physics";

export class airport {
    loadingAirport(scene) {
        const loadingmanger = new THREE.LoadingManager();
        loadingmanger.onStart = function (url, item, total) {
            console.log("start ${url}");
        };

        loadingmanger.onProgress = function (url, loaded, total) {
            var progressBar = document.getElementById("progress_bar");
            // progressBar.value = (loaded / total) * 100;
        };
        loadingmanger.onLoad = function () {
            var progressBarcontainer = document.querySelector(
                ".progress_bar_container",
            );
            // progressBarcontainer.style.display='none';
        };
        loadingmanger.onError = function (url) {
            console.log("error ${url}");
        };

        var rgbeloader = new RGBELoader(loadingmanger);

        //modale
        var loader = new GLTFLoader(loadingmanger);

        loader.load("../modale/airport2/scene.gltf", function (gltf1) {
            gltf1.scene.scale.multiplyScalar(200);
            gltf1.scene.position.y = 100;
            gltf1.scene.rotation.y = Math.PI / 2;
            gltf1.scene.position.z = -160;

            scene.add(gltf1.scene);
        });
    }
    //loadingandmodale();

    airportBoarders(plane, height) {
        // const animate = ()=>{
        //       if(plane.position_vector.y<height) plane.position_vector.y=height,plane.velocity_vector.y=0;
        //       requestAnimationFrame(animate);
        // }
        // animate();
    }

    //loading plane model and connecting it with plane class which contains all attributes of the plane..

    loadingPlane1(scene, plane) {
        const loadingmanger = new THREE.LoadingManager();
        loadingmanger.onStart = function (url, item, total) {
            console.log("start ${url}");
        };

        loadingmanger.onProgress = function (url, loaded, total) {
            var progressBar = document.getElementById("progress_bar");
            // progressBar.value = (loaded / total) * 100;
        };
        loadingmanger.onLoad = function () {
            var progressBarcontainer = document.querySelector(
                ".progress_bar_container",
            );
            progressBarcontainer.style.display = "none";
        };
        loadingmanger.onError = function (url) {
            console.log("error ${url}");
        };

        var rgbeloader = new RGBELoader(loadingmanger);

        const groupx = new THREE.Group();
        const groupy = new THREE.Group();
        const groupz = new THREE.Group();

        //modale
        var loader = new GLTFLoader(loadingmanger);

        loader.load("../modale/plane20/scene.gltf", function (gltf) {
            gltf.scene.scale.multiplyScalar(10); //0.1
            groupz.add(gltf.scene);
            groupx.add(groupz);
            groupy.add(groupx);
            groupx.rotation.x = 0.1;
            groupy.rotation.y = -0.08;
            groupz.rotation.z = -0.9;
            //camera.lookAt(new THREE.Vector3(gltf.scene.position.x,gltf.scene.position.y,gltf.scene.position.z))
            scene.add(groupy);
        });

        // changing plane angles and position depending on plane class attributes

        const animate = () => {
            //scaling the plane in order to be visible from the second camera:
            groupy.scale.set(10, 10, 10);

            groupy.position.x = plane.position_vector.x;
            groupy.position.y = plane.position_vector.y;
            groupy.position.z = plane.position_vector.z;

            groupx.rotation.x = plane.angles.pitch + 0.1;
            groupy.rotation.y = plane.angles.yaw - 0.08; // tita rotaion should be on the whole group
            groupz.rotation.z = plane.angles.roll - 0.3;
            // groupz.rotation.z = -10*titaAccc-0.3;      // phi and bita should be only on the plane

            //     console.log('dddddddddddddddddddddddddddddd:'+plane.x);
            requestAnimationFrame(animate);
        };
        animate();
    }

    loadingPlane2(scene, plane, camera, ang3, ang4, ang5) {
        let currentModel;
        var gltfoo;
        let gltfo;

        const loadingmanger = new THREE.LoadingManager();
        loadingmanger.onStart = function (url, item, total) {
            console.log("start ${url}");
        };

        loadingmanger.onProgress = function (url, loaded, total) {
            var progressBar = document.getElementById("progress_bar");
            // progressBar.value = (loaded / total) * 100;
        };
        loadingmanger.onLoad = function () {
            var progressBarcontainer = document.querySelector(
                ".progress_bar_container",
            );
            progressBarcontainer.style.display = "none";
        };
        loadingmanger.onError = function (url) {
            console.log("error ${url}");
        };

        var rgbeloader = new RGBELoader(loadingmanger);

        const groupx = new THREE.Group();
        const groupy = new THREE.Group();
        const groupz = new THREE.Group();

        //modale
        //   var loader = new GLTFLoader(loadingmanger);

        //   loader.load("../modale/plane20/scene.gltf", function (gltf) {
        //       gltf.scene.scale.multiplyScalar(10); //0.1
        var pivot = new THREE.Object3D();
        var boxGeometry = new THREE.BoxGeometry(1 / 6, 5 / 6, 0); // Width: 5, Height: 5, Depth: 5
        var boxMaterial = new THREE.MeshBasicMaterial({
            color: "#0E2954",
        }); // Red color
        var boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        const group1 = new THREE.Group();
        const group2 = new THREE.Group();
        group1.add(boxMesh);
        group2.add(group1);

        var pivot2 = new THREE.Object3D();
        var boxGeometry2 = new THREE.BoxGeometry(0, 1 / 8, 1.6); // Width: 5, Height: 5, Depth: 5
        var boxMaterial2 = new THREE.MeshBasicMaterial({
            color: "white",
        }); // Red color
        var boxMesh2 = new THREE.Mesh(boxGeometry2, boxMaterial2);

        var pivot3 = new THREE.Object3D();
        var boxGeometry3 = new THREE.BoxGeometry(0, 1 / 8, 1.6); // Width: 5, Height: 5, Depth: 5
        var boxMaterial3 = new THREE.MeshBasicMaterial({
            color: "white",
        }); // Red color
        var boxMesh3 = new THREE.Mesh(boxGeometry3, boxMaterial3);

        var pivot4 = new THREE.Object3D();
        var boxGeometry4 = new THREE.BoxGeometry(0, 1 / 16, 0.8); // Width: 5, Height: 5, Depth: 5
        var boxMaterial4 = new THREE.MeshBasicMaterial({
            color: "white",
        }); // Red color
        var boxMesh4 = new THREE.Mesh(boxGeometry4, boxMaterial4);

        var pivot5 = new THREE.Object3D();
        var boxGeometry5 = new THREE.BoxGeometry(0, 1 / 16, 0.8); // Width: 5, Height: 5, Depth: 5
        var boxMaterial5 = new THREE.MeshBasicMaterial({
            color: "white",
        }); // Red color
        var boxMesh5 = new THREE.Mesh(boxGeometry5, boxMaterial5);

        new GLTFLoader()
            .setPath("../modale/bassam2/")
            .load("scene.gltf", function (gltf) {
                gltf.scene.scale.multiplyScalar(6); //0.1
                gltf.scene.rotation.y = -Math.PI / 2;
                gltf.scene.position.y = -5;
                // gltf.scene.position.z = -500;

                gltfo = gltf.scene;

                // adding tail to the plane
                boxMesh.position.x = -0.1;
                gltfo.add(group2);
                group2.position.set(-3.3, 0.65, 0);
                group2.rotation.z = 0.25;

                // adding right wing to plane
                boxMesh2.position.set(0, 1 / 16, 0);
                pivot2.rotation.x -= 0.1;
                pivot2.rotation.y -= 0.3;
                gltfo.add(pivot2);
                pivot2.add(boxMesh2);
                pivot2.position.x -= 1.2;
                pivot2.position.z += 1.5;

                // adding left wing to plane
                boxMesh3.position.set(0, 1 / 16, 0);
                pivot3.rotation.x += 0.1;
                pivot3.rotation.y += 0.3;
                gltfo.add(pivot3);
                pivot3.add(boxMesh3);
                pivot3.position.x -= 1.2;
                pivot3.position.z -= 1.5;

                // adding right elevator to the plane
                boxMesh4.position.set(0, 1 / 32, 0);
                pivot4.rotation.x += 0.1;
                pivot4.rotation.y += 0.2;
                gltfo.add(pivot4);
                pivot4.add(boxMesh4);
                pivot4.position.x -= 3.33;
                pivot4.position.z -= 0.4;
                pivot4.position.y += 1 / 6;

                // adding left elevator to the plane
                boxMesh5.position.set(0, 1 / 32, 0);
                pivot5.rotation.x -= 0.1;
                pivot5.rotation.y -= 0.2;
                gltfo.add(pivot5);
                pivot5.add(boxMesh5);
                pivot5.position.x -= 3.33;
                pivot5.position.z += 0.4;
                pivot5.position.y += 1 / 6;

                // adding plane to groupz, groupz to groupx, groupx to groupy to enable rotating on three axis
                groupz.add(gltfo);
                groupx.add(groupz);
                groupy.add(groupx);
                groupx.rotation.x = 0.1;
                groupy.rotation.y = -0.08;
                groupz.rotation.z = -0.9;
                scene.add(groupy);
                currentModel = gltfo;
            });
        new GLTFLoader()
            .setPath("../modale/explosive/")
            .load("scene.gltf", function (gltf) {
                gltf.scene.scale.multiplyScalar(6); //0.1
                gltf.scene.rotation.y = -Math.PI / 2;
                gltf.scene.position.y = -5;
                // gltf.scene.position.z = -500;
                gltfoo = gltf.scene;
                gltfoo.visible = false;

                groupz.add(gltfoo);
                groupx.add(groupz);
                groupy.add(groupx);
                groupx.rotation.x = 0.1;
                groupy.rotation.y = -0.08;
                groupz.rotation.z = -0.9;
                scene.add(groupy);
            });

        // changing plane angles and position depending on plane class attributes
        let converting_mps_to_kmph = 3600 / 1000;
        let boomb = 0;
        const animate = () => {
            // scaling the plane in order to be visible from the second camera:
            groupy.scale.set(10, 10, 10);

            // tiing plane values with the modale
            groupy.position.x = plane.position_vector.x;
            groupy.position.y = plane.position_vector.y;
            groupy.position.z = plane.position_vector.z;

            groupx.rotation.x = plane.angles.pitch;
            groupy.rotation.y = plane.angles.yaw;
            groupz.rotation.z = plane.angles.roll;

            // tiing the fins of the plane
            group1.rotation.y = -plane.fins.tail / 2; // tail
            pivot2.rotation.z = plane.fins.rightWing + Math.PI / 2; // right wing
            pivot3.rotation.z = plane.fins.leftWing + Math.PI / 2; // left wing
            pivot4.rotation.z =
                Math.min(
                    Math.max(-plane.fins.elevators / 2, -Math.PI / 3),
                    Math.PI / 3,
                ) +
                Math.PI / 2; // right elevator
            pivot5.rotation.z =
                Math.min(
                    Math.max(-plane.fins.elevators / 2, -Math.PI / 3),
                    Math.PI / 3,
                ) +
                Math.PI / 2; // left elevator

            if (currentModel) {
                if (plane.position_vector.y <= plane.ground_height+200 && plane.velocity_vector.y < -50){
                    const gltfoPosition = gltfo.position.clone();

                    gltfo.visible = false;
                    gltfoo.visible = true;
                    currentModel = gltfoo;

                    gltfoo.position.copy(gltfoPosition);
                    boomb = 1;
                }
            }
            if (boomb) {
                plane.velocity_vector.x = 0;
                plane.velocity_vector.y = 0;
                plane.velocity_vector.z = 0;
                camera.position.y += 50;
                gltfoo.position.y -= 0.3;
                camera.lookAt(
                    new THREE.Vector3(
                        plane.position_vector.x,
                        plane.position_vector.y,
                        plane.position_vector.z,
                    ),
                );
            }
            requestAnimationFrame(animate);
        };

        animate();
    }
}
