import { isThisTypeNode } from "typescript";

export class Friction {

    vector = {x:0, y:0, z:0};
    variables = {earth:0.002};

    
    updatefriction(plane,weight,push){
        
        // let r=weight.vector.y * this.earth;
        let r= -weight.vector.y*this.variables.earth;

        if(plane.position_vector.y == 4490.002998201348) {

            // this.vector.x = Math.sin(plane.angles.yaw + Math.PI) *r;
            this.vector.x = Math.min(push.vector.x, Math.sin(plane.angles.yaw + Math.PI) *r);
            // this.vector.z = Math.cos(plane.angles.yaw + Math.PI) *r;
            this.vector.z = Math.min(push.vector.z, Math.cos(plane.angles.yaw + Math.PI) *r);

        }
        else{
            this.vector.x = 0;
            this.vector.z = 0;
        }

        
    }
}