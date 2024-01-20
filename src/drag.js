import { Vector3 } from "three";
import { EndOfLineState } from "typescript";

export class Drag {

    vector = {x:0, y:0, z:0};
    variables = {a:500, cd:1, cdrag:0.05};   // a:1   cd:0.1
    rotational_drag = {roll:0, pitch:0, yaw:0};


    updateDrag(plane,wind){             // updating Drag force vector in respect of plane angles.

        let magnitude = 0.5 * this.variables.cd * this.variables.a * wind.atmospheric_variables.rho;

        this.vector.x = (wind.relative_speed.x>0 ? -1:1) * magnitude * Math.pow(wind.relative_speed.x,2)// * 10;

        this.vector.y = (wind.relative_speed.y>0 ? -1:1) * magnitude * Math.pow(wind.relative_speed.y,2)// * 10;

        this.vector.z = (wind.relative_speed.z>0 ? -1:1) * magnitude * Math.pow(wind.relative_speed.z,2)// * 10;
    }


    updateRotationalDrag(plane,wind){
        let yaw_A = 25000;
        let pitch_A = 2500;
        let roll_A = 25000;

        let speed1 = plane.angles_velocity.yaw ;
        this.rotational_drag.yaw = (speed1>=0 ? -1:1) * 0.5 * yaw_A * this.variables.cd * wind.atmospheric_variables.rho * speed1*speed1 * 5000;

        let speed2 = plane.angles_velocity.pitch;
        this.rotational_drag.pitch = (speed2>=0 ? -1:1) * 0.5 * pitch_A * this.variables.cd * wind.atmospheric_variables.rho * speed2*speed2 * 10000;

        let speed3 = plane.angles_velocity.roll;
        this.rotational_drag.roll = (speed3>=0 ? -1:1) * 0.5 * roll_A * this.variables.cd * wind.atmospheric_variables.rho * speed3*speed3 * 10000;
    }

    updateCdrag(){
        this.variables.cd = this.variables.cdrag/0.05;
    }


    controlPanel(gui){                              // gui and controll panel
        // gui.add(this.variables,'a',0,10,0.001);
        gui.add(this.variables,'cdrag',0,2,0.001);
    }

}