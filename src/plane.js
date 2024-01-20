import "./style.css";

import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import * as dat from 'dat.gui';
import { Physics} from './physics'

import gsap from "gsap";
import { isBreakStatement } from "typescript";
import { skybox } from "./skybox";



export class Plane{

    length=10;
      wing_length=4;
      roll_switch=1;
      ground_height = 300;
      plane_shape = 1;
      skybox_scaler = 10;  // each 100 unit of distance in skybox is approximetaly 1 meter.

      // main attributes for plan

      // possible positions:
    //   IN CITY: position_vector={x:-220915.966373123, y:this.ground_height, z:-441532.36823652463}        angles={yaw:-1.553, pitch:0, roll:0} 
    //   IN AIRPORT:  {x:1602.185315344099, y:this.ground_height, z:1015411.5253516517}            angles={yaw:Math.PI, pitch:-Math.PI/36, roll:0}     ground_height = 200;


      position_vector={x:1602.185315344099, y:this.ground_height, z:1015411.5253516517}
      velocity_vector={x:0, y:0, z:0}
      acceleration_vector={x:0, y:0, z:0}

      angles={yaw:Math.PI, pitch:-Math.PI/36, roll:0} 
      angles_velocity={yaw:0, pitch:0, roll:0}
      angles_acceleration={yaw:0, pitch:0, roll:0}

      wings_area = {leftWing:60, rightWing:60}

      fins={leftWing:1, rightWing:1, tail:0, elevators:0}   // can have values: -1  0  1

      variables={mass:100000, plane_mass:70000,I:0, length:10, wing_length:4, fuel:30000, max_fuel:30000, fuel_consumption:5, deltaTime:0, rotational_deltaTime:-1}
 
    
      

      I=1/12*this.variables.mass*Math.pow(this.length,2);

      keyboard=0;

    updateMass(){
        this.variables.mass = this.variables.plane_mass + this.variables.fuel*0.819;
        this.variables.I = 1/12*this.variables.mass*Math.pow(this.length,2);
    }

    updatingPlaneWithPhysics(){

        let sum = 0;
        let num = 0;
        let st = Date.now();

        let oldelapasedtime = 0;
        const clock = new THREE.Clock();
      const animating = ()=>{

        const elapsedtime = clock.getElapsedTime();
        this.variables.deltaTime = elapsedtime - oldelapasedtime;
        oldelapasedtime = elapsedtime;

        let en = Date.now();
        // console.log('delta:'+ Clock.getDelta());
        // num+=1;
        // sum+=(1/((en-st)/1000));

        // this.variables.deltaTime = ((en-st)/1000);
        // let frequency = (1/((en-st)/1000));
        
        // if((num%100)==0) console.log('avg:'+(1/((en-st)/1000)));

        st=en;


        // updating the speeds of the plane on each axis;
        this.velocity_vector.x += this.acceleration_vector.x * this.variables.deltaTime;
        this.velocity_vector.y += this.acceleration_vector.y * this.variables.deltaTime;
        this.velocity_vector.z += this.acceleration_vector.z * this.variables.deltaTime;
      
        // updating position depending on the velocity on each axis.
        this.position_vector.x += this.velocity_vector.x * this.variables.deltaTime * this.skybox_scaler;
        this.position_vector.y += this.velocity_vector.y * this.variables.deltaTime * this.skybox_scaler;
        this.position_vector.z += this.velocity_vector.z * this.variables.deltaTime * this.skybox_scaler;


        // updating angular velocity depending on angular acceleration
        this.angles_velocity.pitch += this.angles_acceleration.pitch * this.variables.deltaTime;
        this.angles_velocity.yaw += this.angles_acceleration.yaw * this.variables.deltaTime;
        this.angles_velocity.roll += this.angles_acceleration.roll * this.variables.deltaTime;


        // editing angles depending on the rotational velocity.
        this.angles.yaw += this.angles_velocity.yaw * this.variables.deltaTime;
        this.angles.pitch -=this.angles_velocity.pitch/2 * this.variables.deltaTime;  // negative sign before phi: because the positive incremention will rotate the plane towards down
        this.angles.roll +=this.angles_velocity.roll * this.variables.deltaTime;

        console.log("x:"+this.position_vector.x);
        console.log("y:"+this.position_vector.y);
        console.log("z:"+this.position_vector.z);


        // this.angles.pitch = Math.max(-1.5,Math.min(1.5,this.angles.pitch));     // don't exceed the angle: pi/2 (because exceeding it will reverse the scene)
        // if(this.angles.pitch == -1.5 || this.angles.pitch == 1.5) this.angles_velocity.pitch=0;


        // note: DeltaTime varies from device to another, and we can not take this deltaTime as its value changing in each second,
        // then the rotational movment will be shaking. A solution for this problem is to take the deltaTime before 5 seconds and fix it,
        // and make it special for rotational movement.

        if(elapsedtime<5) this.variables.rotational_deltaTime = this.variables.deltaTime;
        let deltaTime = this.variables.rotational_deltaTime;
        // console.log('r:'+this.variables.rotational_deltaTime);
        deltaTime = 0.0025;


        //centrifugal angle:
        if(this.roll_switch == 1) this.angles.roll =-Math.PI/2 + Math.atan(10/((Math.sqrt(Math.pow(this.velocity_vector.x*deltaTime*this.skybox_scaler*20,2)+Math.pow(this.velocity_vector.z*deltaTime*this.skybox_scaler*20,2))) * (this.angles_velocity.yaw*deltaTime*this.skybox_scaler*20))) - (this.angles_velocity.yaw <0 ? Math.PI:0);

        if(this.keyboard) this.keyboard--;
        
        requestAnimationFrame(animating);
      }
      animating();
    }


    controlPanel(gui){

    let isKeyPressed = false;
      gui.add(this.variables,'plane_mass',200,150000,0.001);

      window.addEventListener("keydown", (event) => {

        switch (event.key) {
            // case "q":
            //     if(this.fins.leftWing<1) this.fins.leftWing+=1;
            //     isKeyPressed=true;
            //     break;

            case "q":
                if(this.fins.leftWing>-1) this.fins.leftWing-=0.1;
                isKeyPressed=true;
                break;

            // case "e":
            //     if(this.fins.rightWing<1) this.fins.rightWing+=1;
            //     isKeyPressed=true;
            //     break;

            case "e":
                if(this.fins.rightWing>-1) this.fins.rightWing-=0.1;
                isKeyPressed=true;
                break;

            case "ArrowRight":
                if(this.fins.tail>-4) this.fins.tail-=0.01;
                if(this.fins.rightWing>-1) this.fins.rightWing-=0.1;
                isKeyPressed=true;
                break;

            case "ArrowLeft":
                if(this.fins.tail<4) this.fins.tail+=0.01;
                if(this.fins.leftWing>-1) this.fins.leftWing-=0.1;
                isKeyPressed=true;
                break;

            case "ArrowDown":
                if(this.fins.elevators<4) this.fins.elevators+=0.1;
                isKeyPressed=true;
                break;
            
            case "ArrowUp":    
                if(this.fins.elevators>-4) this.fins.elevators-=0.1;
                isKeyPressed=true;
                break;

            case "f":
                this.position_vector.y=10000;
                isKeyPressed=true;
                break;

            case "p":
                this.plane_shape ^= 1;
                break;

            case "r":
                this.variables.fuel = this.variables.max_fuel;
                break;

        }
    });

    // if neither button is pressed
    document.addEventListener("keyup", (event) => {
        isKeyPressed = false;
        this.fins.elevators = 0;
        this.fins.leftWing = 1;
        this.fins.rightWing = 1;
        this.fins.tail = 0;
    });

    }


}