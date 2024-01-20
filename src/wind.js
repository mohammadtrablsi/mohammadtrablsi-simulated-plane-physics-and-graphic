import { Vector3 } from "three";

export class Wind {

    speed_vector = {x:0, y:0, z:0};    // speed of wind generally
    relative_speed = {x:0, y:0, z:0};   //speed of wind relatively to the plane
    variables = {airSpeed:0, angle:0};  //angle with x axis counter clockwise
    atmospheric_variables = {rho:1.225, air_rho:1.225,rain_rho:1., rho0:1.225, temperature:15};  //atmosphere variavles that affects lift and drag forces

    
    updateWind(plane){
        // let force= Math.floor(Math.random() * 10 + this.variables.airSpeed);
        let force = this.variables.airSpeed;
        this.speed_vector.x = force * Math.cos(this.variables.angle);
        this.speed_vector.z = force * Math.sin(this.variables.angle);

        this.relative_speed.x = plane.velocity_vector.x - this.speed_vector.x;
        this.relative_speed.y = plane.velocity_vector.y - this.speed_vector.y;
        this.relative_speed.z = plane.velocity_vector.z - this.speed_vector.z;
    }


    updateRho(plane){
        let y = plane.position_vector.y*20;
        // let rho0 =  1.225  // kg/m^3
        let H = 10;
        let air_pressure = 1.018;
        this.atmospheric_variables.rho0 = (air_pressure*100000)/(287*(this.atmospheric_variables.temperature+273));
        this.atmospheric_variables.rho = this.atmospheric_variables.rho0 * Math.exp((-y/100000)/(H))
        // console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:'+this.atmospheric_variables.rho);
        // console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy:'+plane.position_vector.y);
        // // console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh:'+H);
        // console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE:'+Math.E);
        // console.log('acacacacacacaca:'+plane.acceleration_vector.y);
        // console.log('vlvlvlvlvlvvllvlv:'+plane.velocity_vector.y);



        // if(plane.position_vector.y<0) this.atmospheric_variables.rho = this.atmospheric_variables.sea_rho;
        // else this.atmospheric_variables.rho = this.atmospheric_variables.air_rho;
        // else this.atmospheric_variables.rho = 0.015;
    }


    updateRho1(plane){
        let y = plane.position_vector.y*20;
        // let rho0 =  1.225  // kg/m^3
        let H = 10;
        let air_pressure = 1.018;
        this.atmospheric_variables.rho0 = (air_pressure)/(287*(this.atmospheric_variables.temperature+273));
        this.atmospheric_variables.rho = this.atmospheric_variables.rho0 * Math.exp((-y)/(H))
    }

    controlPanel(gui){                              // gui and controll panel
        gui.add(this.variables,'angle',0,Math.PI*2,Math.PI/2);
        gui.add(this.variables,'airSpeed',0,200,1);
        // gui.add(this.atmospheric_variables,'cl',0,20,0.01);
        // gui.add(this.atmospheric_variables,'rho',0,10,0.001);
        gui.add(this.atmospheric_variables,'temperature',-50,70,1)
    }
}