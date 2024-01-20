import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from "gsap";
import { Plane} from './plane'
import { skybox } from './skybox'
import { Lift} from './lift'
import { Physics } from './physics'
import { CameraPlane } from './cameraPlane'
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";
import { airport } from './airport';




///scene
const scene=new THREE.Scene();
const gui=new dat.GUI();


// <<<<<<<<<<<<<<<<<< SKYBOX >>>>>>>>>>>>>>>>>>>>
// const skys = new skybox()
// skys.mountainSkybox(scene);
// <<< END SKYBOX >>>



// <<<<<<<<<<<<<<<<< LIGHT >>>>>>>>>>>>>>>>>>>>>>
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(0,1,0);
scene.add( directionalLight );
// <<< END LIGHT >>>




// <<<<<<<<<<<<<<<<< PLANE >>>>>>>>>>>>>>>>>>>>
const plane1 = new Plane();
plane1.updatingPlaneWithPhysics();
plane1.controlPanel(gui);
// plane1.loadingPlane(scene);

const ph=new Physics();
ph.applyPhysics(plane1,gui);


// ph.applyPhysics(plane2,gui);
// <<< END PLANE >>>



// <<<<<<<<<<<<<<<<< ADDING AIRPORT >>>>>>>>>>>>>>>>>>>>
const airport1 = new airport();
airport1.airportBoarders(plane1,plane1.ground_height);

// plane:
// airport1.loadingPlane1(scene,plane1);

if(plane1.plane_shape == 0) airport1.loadingPlane1(scene,plane1);
else airport1.loadingPlane2(scene,plane1);
// <<< END ADDING AIRPORT >>> 




// <<<<<<<<<<<<<<<<<<<  CAMERA  >>>>>>>>>>>>>>>>>>>>
const sizes={
      width:window.innerWidth,
      height:window.innerHeight,
}
const camera=new THREE.PerspectiveCamera(75,sizes.width/sizes.height,3,3000000)//degree,aspectratio
// <<< CAMERA >>>


const canvas=document.querySelector('.webgl')
const renderer=new THREE.WebGLRenderer({
                      canvas:canvas

})
renderer.setSize(sizes.width,sizes.height)


// <<<<<<<<<<<<<<<<<<< CAMERA FOLLOWING PLANE >>>>>>>>>>>>>>>>>>>>>
const newCamera = new CameraPlane();
newCamera.createCamera(camera,plane1,gui,scene,canvas);
// scene.add(camera)
// <<< END CAMERA PLANE >>>


let sky = new skybox();
sky.makeSkybox(scene, renderer, gui);




//mouse camera
const cursor={
      x:0,
      y:0,
}
window.addEventListener('dblclick',()=>{
      if(!document.fullscreenElement){
            canvas.requestFullscreen()
      }else{
            document.exitFullscreen();
      }
})

//keyboard
console.log(plane1.z);
window.addEventListener("keydown", (event) => {
      switch (event.key) {
            case "c":
                  if(newCamera.camState < 2) newCamera.camState+=1;
                  else newCamera.camState = 0;
                  break;
            
            // case "ArrowUp":
            //     if(newCamera.camState==0)
            //     plane1.angles.pitch+=0.07;
            //     break;
            // case "ArrowDown":
            //     if(newCamera.camState==0)
            //     plane1.angles.pitch-=0.07;
            //     break;
            // case "ArrowLeft":
            //     if(newCamera.camState==0)
            //     plane1.angles.yaw+=0.07;
            //     break;
            // case "ArrowRight":
            //     if(newCamera.camState==0)
            //     plane1.angles.yaw-=0.07;
            //     break;
            // case "W":
            //     if(newCamera.camState==0)
            //     {let pl = 10000;
            //     plane1.position_vector.x += pl * Math.cos(-plane1.angles.pitch) * Math.sin(plane1.angles.yaw);
            //     plane1.position_vector.z += pl * Math.cos(-plane1.angles.pitch) * Math.cos(plane1.angles.yaw);
            //     plane1.position_vector.y +=pl * Math.sin(-plane1.angles.pitch);}
            //     break;
            // case "S":
            //     if(newCamera.camState==0)
            //     {let pls = 10000;
            //     plane1.position_vector.x -= pls * Math.cos(-plane1.angles.pitch) * Math.sin(plane1.angles.yaw);
            //     plane1.position_vector.z -= pls * Math.cos(-plane1.angles.pitch) * Math.cos(plane1.angles.yaw);
            //     plane1.position_vector.y -=pls * Math.sin(-plane1.angles.pitch);}
            //     break;
                

      }
    });

    

//controlles camera
function controlscamera(){
const controls = new OrbitControls( camera, canvas );
controls.update();
//controls.target(new THREE.Vector3(planePos.x,planePos.y,planePos.z));

let st = Date.now();

animate();
function animate() {

	requestAnimationFrame( animate );

	controls.update();
      //controls.target(new THREE.Vector3(planePos.x,planePos.y,planePos.z));

	renderer.render( scene, camera );
}
}
//controlscamera();

const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( '../music/aeroplane sound.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop(true);
	sound.setVolume(0.2);
	sound.play();
});


let time = Date.now();
//
let oldelapasedtime = 0;
const clock = new THREE.Clock();
var plus = 0;
var currentscale = 0;

const tick=()=>{
      renderer.render(scene,camera)
      window.requestAnimationFrame(tick)
      const elapsedtime = clock.getElapsedTime();
      const deltatime = elapsedtime - oldelapasedtime;
  
      //posla
      Posla();
  
      //speedometer
      speedometer(deltatime);
  
      //fuelmeter
      fuelmeter(deltatime);
}
tick()

function Posla() {
      var element = document.getElementById("indicator2");
      var element2 = document.getElementById("indicator1");
      element.style.transform = "rotate(" + (-plane1.angles.yaw + Math.PI / 2) * (180 / Math.PI) + "deg)";
      element2.style.transform = "rotate(" + (-plane1.angles.yaw + Math.PI / 2) * (180 / Math.PI) + "deg)";
  }
  
  function speedometer(deltatime) {
      var element3 = document.getElementById("arrow");
    //   if (deltatime * 10 < 181) {
          element3.style.transform = "rotate(" + (Math.min(Math.sqrt(Math.pow(plane1.velocity_vector.x,2)+Math.pow(plane1.velocity_vector.z,2)),4000)) + "deg)";
          let el = document.getElementsByClassName("km")[0];
          let converting_mps_to_kmph = 3600/1000;
          el.innerText = (Math.min((Math.sqrt(Math.pow(plane1.velocity_vector.x,2)+Math.pow(plane1.velocity_vector.z,2)) * converting_mps_to_kmph),4000)).toFixed(0);
          let tempclass = "speedometer-scale-" + currentscale;
          currentscale++;
          let elo = document.getElementsByClassName(tempclass)[0];
          if (elo) {
              elo.classList.toggle("active");
          }
    //   }
  }
  function fuelmeter(deltatime) {
        var element4 = document.getElementById("needle");
        element4.style.transform = "rotate(" + (((plane1.variables.fuel*360)/plane1.variables.max_fuel)+180) + "deg)";
        console.log('f:'+plane1.variables.fuel)
  }

//   function tick2() {
//       const elapsedtime = clock.getElapsedTime();
//       const deltatime = elapsedtime - oldelapasedtime;
//       // let speedz = document.getElementsByClassName("speedzvalue")[0];
//       // speedz.innerText = elapsedtime;
//       // let speedy = document.getElementsByClassName("speedyvalue")[0];
//       // speedy.innerText = deltatime + 5;
//       // let thrust = document.getElementsByClassName("thrustvalue")[0];
//       // thrust.innerText = deltatime + 4;
//       // let drag = document.getElementsByClassName("dragvalue")[0];
//       // drag.innerText = deltatime + 20.022;
//       // let aoa = document.getElementsByClassName("aoavalue")[0];
//       // aoa.innerText = deltatime + 10.88;
//       // let a = document.getElementsByClassName("avalue")[0];
//       // a.innerText = deltatime + 30.01;
//       // let left = document.getElementsByClassName("leftvalue")[0];
//       // left.innerText = deltatime + 0.1;
//   }
  
  const button = document.querySelector(".outerbox");
  const box = document.querySelector(".outerbox");
  button.addEventListener("click", () => {
      if (box.style.top == "-521px") {
          box.style.top = "0px";
      } else {
          box.style.top = "-521px";
      }
  });

