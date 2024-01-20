import { Vector3 } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from "gsap";
import { Plane} from './plane'
import { skybox } from './skybox'

export class Lift {

    leftVector = {x:0, y:0, z:0};
    rightVector = {x:0, y:0, z:0};
    // variables = {a:1, cl:0.8, rho:0.01};
    variables = {a:0.1, cl:1, pitch_cl:0};    // cl: 0.12,   rho:0.01

    // getCL(pitch){
    //     return Math.sin(2*pitch);
    // }


    updateLeftLift(plane,wind){
        
        this.variables.pitch_cl = this.variables.cl * (plane.angles.pitch<=0 && plane.angles.pitch>=-1.5 ? Math.sin(-2*plane.angles.pitch+(Math.PI/3)):this.variables.cl);

        let v= Math.sqrt(Math.pow(wind.relative_speed.x,2)+Math.pow(wind.relative_speed.z,2));
        
        let magnitude = 0.5 * plane.fins.leftWing * this.variables.pitch_cl * plane.wings_area.leftWing * wind.atmospheric_variables.rho * Math.pow(v,2);
        
        this.leftVector.y = magnitude * Math.cos(-plane.angles.pitch) * Math.cos(plane.angles.roll);
    }

    updateRightLift(plane,wind){
        this.variables.pitch_cl = (plane.angles.pitch<=0 && plane.angles.pitch>=-1.5 ? Math.sin(-2*plane.angles.pitch):this.variables.cl);

        let v= Math.sqrt(Math.pow(wind.relative_speed.x,2)+Math.pow(wind.relative_speed.z,2));
        
        let magnitude = 0.5 * plane.fins.rightWing * this.variables.pitch_cl * plane.wings_area.rightWing * wind.atmospheric_variables.rho * Math.pow(v,2);
        
        this.rightVector.y = magnitude * Math.cos(-plane.angles.pitch) * Math.cos(plane.angles.roll);
    }

    getLeftLift(plane){
        return this.leftVector.y;   // divide on 1000
    }

    getRightLift(plane){
        return this.rightVector.y;  // divide on 1000
    }

    getTailForce(plane,wind){
        let v = Math.sqrt(plane.velocity_vector.x*plane.velocity_vector.x + plane.velocity_vector.z*plane.velocity_vector.z);
        let tail_A = 100;
        let magnitude = 0.5 * plane.fins.tail * this.variables.cl * tail_A * wind.atmospheric_variables.rho * Math.pow(v,2);
        return magnitude;   // divide on 1000
    }

    getElevatorForce(plane,wind){
        let v = Math.sqrt(plane.velocity_vector.x*plane.velocity_vector.x + plane.velocity_vector.z*plane.velocity_vector.z);
        let el_A = 100;
        let magnitude = 0.5 * plane.fins.elevators * this.variables.cl * el_A * wind.atmospheric_variables.rho * Math.pow(v,2);
        return magnitude;
    }

    controlPanel(gui){                              // gui and controll panel
        gui.add(this.variables,'a',0,1,0.001);
        gui.add(this.variables,'cl',0,3,0.001);
    }
}