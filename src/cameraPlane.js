import { Vector3 } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from "gsap";
import { Plane} from './plane'
import { skybox } from './skybox'


export class CameraPlane {

  x=0;
  y=0;
  z=0;
  angle1=0;
  angle2=0;

  camState=0;
  camType1 = 0;

    createCamera(camera,plane,gui,scene,canvas){
        var data = {dist:500, cdist:400};
        gui.add(data,'dist',-1000,1000,0.001)
      


        const groupx = new THREE.Group();
        const groupy = new THREE.Group();
        const groupz = new THREE.Group();

        groupz.add(camera);
        groupx.add(groupz);
        groupy.add(groupx);

      
        // const controls = new OrbitControls(groupy, canvas);
        // controls.enableDamping = true; // Enable damping which is like an inertia
        // controls.dampingFactor = 0.05; // Requires the update call in your animation loop
        // controls.screenSpacePanning = false;
        // controls.minDistance = 1000;
        // controls.maxDistance = 1000;
        // controls.enableZoom = true;
        // controls.maxPolarAngle = Math.PI;

        const an = ()=>{
          if(this.camState==0){    // old camera
              
              // camera follows the plane
              groupy.position.z=plane.position_vector.z-Math.cos(plane.angles.pitch)*Math.cos(plane.angles.yaw)*data.dist;
              groupy.position.x=plane.position_vector.x-Math.cos(plane.angles.pitch)*Math.sin(plane.angles.yaw)*data.dist;
              groupy.position.y=plane.position_vector.y +Math.sin(plane.angles.pitch)*data.dist;

              // camera looks at plane
              groupx.rotation.x = (this.camType1 == 1 ? 1:-1) * plane.angles.pitch;
              groupy.rotation.y = (this.camType1 == 1 ? -1:1) * plane.angles.yaw + Math.PI;      // tita rotaion should be on the whole group
              // groupz.rotation.z = (this.camType1 == 1 ? 1:-1) * plane.angles.roll;
          }
          else if(this.camState == 1){     // orbit controls
            // this.camType1 = 1;
            // controls.minDistance = data.cdist; 
            // controls.maxDistance = data.cdist; 
            // camera.position.set(this.x,this.y,this.z);
            // camera.lookAt(plane.position_vector.x,plane.position_vector.y,plane.position_vector.z)
            // controls.target.set(plane.position_vector.x, plane.position_vector.y, plane.position_vector.z);
            // controls.update();
          }
          else if(this.camState == 2){   // inside plane
            // camera inside plane:

              // camera.position.z=-plane.position_vector.z+8158;
              // camera.position.x=plane.position_vector.x-279
              // camera.position.y=plane.position_vector.y-202;

              // // camera looks at plane
              // // camera.rotation.x = -(this.camType1 == 1 ? -1:1) * plane.angles.pitch;
              // // camera.rotation.y = (this.camType1 == 1 ? 1:-1) * plane.angles.yaw ;      // tita rotaion should be on the whole group
              // // camera.rotation.z = (this.camType1 == 1 ? -1:1) * (-plane.angles.roll);

              // if(data.dist > -60) data.dist -= 5;
          }
          
            
            requestAnimationFrame(an);
        }
        an();

        scene.add(groupy);
        window.addEventListener("keydown", (event) => {
          switch (event.key) {
              case "o":
                  data.cdist+=100;
                  break;
              case "l":
                  data.cdist-=100;
                  break;
          }
      });


      const sizes={
        width:window.innerWidth,
        height:window.innerHeight,
      }
  
  //res
  window.addEventListener('resize',()=>{
    
        sizes.width=window.innerWidth
        sizes.height=window.innerHeight
        camera.aspect=sizes.width/sizes.height
        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width,sizes.height)
  })
    }
}