import { Vector3 } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from "gsap";
//import { plane} from './plane'
import { skybox } from './skybox'
import { Plane } from './plane'
import { Lift } from './lift'
import { Push } from './push'
import { Drag } from './drag'
import { Weight } from './weight';
import { Rotation } from './rotation';
import { Wind } from './wind';
import { Centrifuge } from './centrifuge';
import { Friction } from './friction';
import { Earthreaction } from './earthreaction';

export class Physics {

    applyPhysics(plane,gui){

        const lift = new Lift();
        const push = new Push();
        const drag = new Drag();
        const weight = new Weight();
        const rotation = new Rotation();
        const centrifugal = new Centrifuge();
        const wind = new Wind();
        const friction = new Friction();
        const earthreaction = new Earthreaction();

        let data = {pushZ:0,pushM:0,pushL1:0,pushL2:0};

        this.push = data.pushZ;
        this.push = data.pushM;
        this.push = data.pushL1;
        this.push = data.pushL2;

        // gui.add(push,'variables',0,100,0.001);
        // gui.add(data,'pushZ',0,100,0.001);
        push.controlPanel(gui);
        drag.controlPanel(gui);
        weight.controlPanel(gui);
        lift.controlPanel(gui);
        wind.controlPanel(gui);


        const animate = ()=>{
            
            // updating each force on each axis in each frame (recalculating the force).
            plane.updateMass();
            wind.updateWind(plane);
            wind.updateRho(plane);
            lift.updateLeftLift(plane,wind);
            lift.updateRightLift(plane,wind);
            push.updatePush(plane);
            drag.updateDrag(plane,wind);
            weight.updateWeight(plane);
            centrifugal.updateCenterrifugalForce(plane);
            friction.updatefriction(plane,weight,push);
            earthreaction.updateEarthreaction(plane,weight,wind,lift,push,drag,friction,centrifugal);

            drag.updateCdrag();
            

            // the sum of all forces on each axis:
            let sigma_F_on_x = lift.leftVector.x + lift.rightVector.x + push.vector.x + drag.vector.x + weight.vector.x + centrifugal.vector.x + earthreaction.vector.x//+ friction.vector.x;
            let sigma_F_on_y = lift.leftVector.y + lift.rightVector.y + push.vector.y + drag.vector.y + weight.vector.y + centrifugal.vector.y + earthreaction.vector.y// + friction.vector.y  +earthreaction.vector.y;
            let sigma_F_on_z = lift.leftVector.z + lift.rightVector.z + push.vector.z + drag.vector.z + weight.vector.z + centrifugal.vector.z + earthreaction.vector.z//+ friction.vector.z;


            // the acceleration on each axis:
            plane.acceleration_vector.x = sigma_F_on_x/plane.variables.mass;
            plane.acceleration_vector.y = sigma_F_on_y/plane.variables.mass;
            plane.acceleration_vector.z = sigma_F_on_z/plane.variables.mass;


            // updating each torqe on each axis in each frame(recalculating the torques).
            // rotation.updateRoll(plane,data.pushL1,data.pushL2);
            rotation.updateRoll(plane,lift.getLeftLift(plane),lift.getRightLift(plane));
            // rotation.updateYaw(plane,data.pushZ);
            rotation.updateYaw(plane,lift.getTailForce(plane,wind));
            rotation.udpatePitch(plane,lift.getElevatorForce(plane,wind));

            // updating rotational drags:
            drag.updateRotationalDrag(plane,wind);

            //the sum of all torqes on each axis:
            let sigma_torques_on_Roll = rotation.torque.roll + drag.rotational_drag.roll;
            let sigma_torques_on_Pitch = rotation.torque.pitch + drag.rotational_drag.pitch;
            let segma_torques_on_Yaw = rotation.torque.yaw + drag.rotational_drag.yaw;

            //update plane angular acceleration:
            plane.angles_acceleration.roll = sigma_torques_on_Roll / plane.variables.I;
            plane.angles_acceleration.pitch = sigma_torques_on_Pitch / plane.variables.I;
            plane.angles_acceleration.yaw = segma_torques_on_Yaw / plane.variables.I;


            // printing some values:

            // console.log('ddddddddddddddd:'+drag.vector.y);
            // console.log('wwwwwwwwwwwwwww:'+weight.vector.y);
            // console.log('lllllllllllllll:'+ (lift.leftVector.y+lift.rightVector.y));
            // console.log('sgsgsgsgsgsgsgs:'+sigma_F_on_y);

            // console.log('xxxxxxx:'+plane.position_vector.x);
            // console.log('yyyyyyy:'+plane.position_vector.y);
            // console.log('zzzzzzz:'+plane.position_vector.z);


            let rho = document.getElementsByClassName("rho")[0];
            rho.innerText = wind.atmospheric_variables.rho;

            let weight_y = document.getElementsByClassName("weight_y")[0];
            weight_y.innerText = weight.vector.y.toFixed(0);

            let acceleration_x = document.getElementsByClassName("acceleration_x")[0];
            acceleration_x.innerText = (plane.acceleration_vector.x).toFixed(0);

            let acceleration_z = document.getElementsByClassName("acceleration_z")[0];
            acceleration_z.innerText = (plane.acceleration_vector.z).toFixed(0);

            let acceleration_y = document.getElementsByClassName("acceleration_y")[0];
            acceleration_y.innerText = plane.acceleration_vector.y.toFixed(0);

            let position_y = document.getElementsByClassName("position_y")[0];
            position_y.innerText = (plane.position_vector.y/plane.skybox_scaler).toFixed(0);

            let position_x = document.getElementsByClassName("position_x")[0];
            position_x.innerText = (plane.position_vector.x/plane.skybox_scaler).toFixed(0);;

            let position_z = document.getElementsByClassName("position_z")[0];
            position_z.innerText = (plane.position_vector.z/plane.skybox_scaler).toFixed(0);

            let velocity_x = document.getElementsByClassName("velocity_x")[0];
            velocity_x.innerText = plane.velocity_vector.x.toFixed(0);

            let velocity_y = document.getElementsByClassName("velocity_y")[0];
            velocity_y.innerText = plane.velocity_vector.y.toFixed(0);

            let velocity_z = document.getElementsByClassName("velocity_z")[0];
            velocity_z.innerText = plane.velocity_vector.z.toFixed(0);

            let start_eng = document.getElementsByClassName("start_eng")[0];
            start_eng.innerText = push.variables.start_eng;


            requestAnimationFrame(animate);
        }
        animate();

        window.addEventListener("keydown", (event) => {
          switch (event.key) {
              case "R":
                  this.resetPlane(plane,wind,lift,push,drag,weight,centrifugal,friction,earthreaction)
                  break;
              case "t":
                  wind.atmospheric_variables.air_rho
          }
      });
    }

    resetPlane(plane,wind,lift,push,drag,weight,centrifugal,friction,earthreaction){
        lift.leftVector.x = lift.leftVector.y = lift.leftVector.z = 0;
        lift.rightVector.x = lift.rightVector.y = lift.rightVector.z = 0;
        drag.vector.x = drag.vector.y = drag.vector.z = 0;
        drag.rotational_drag.roll = drag.rotational_drag.pitch = drag.rotational_drag.yaw = 0;
        push.vector.x = push.vector.y = push.vector.z = 0;
        push.variables.start_eng = 0;
        push.variables.push = 0;
        wind.speed_vector.x = wind.speed_vector.y = wind.speed_vector.z = 0;
        wind.relative_speed.x = wind.relative_speed.y = wind.relative_speed.z = 0;

        plane.velocity_vector.x = plane.velocity_vector.y = plane.velocity_vector.z = 0;
        plane.acceleration_vector.x = plane.acceleration_vector.y = plane.acceleration_vector.z = 0;
        plane.position_vector.x = 1602.185315344099;
        plane.position_vector.y = plane.ground_height;
        plane.position_vector.z = 1015411.5253516517;
//position_vector={x:1602.185315344099, y:this.ground_height, z:1015411.5253516517}
        plane.angles_acceleration.yaw = plane.angles_acceleration.pitch = plane.angles_acceleration.roll = 0;
        plane.angles_velocity.yaw = plane.angles_velocity.pitch = plane.angles_velocity.z = 0;
        
        plane.angles.yaw = Math.PI;
        plane.angles.pitch = -Math.PI/36;
        plane.angles.roll = 0;
    }
}