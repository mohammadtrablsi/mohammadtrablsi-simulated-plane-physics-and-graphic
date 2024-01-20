export class Earthreaction {

    vector = {x:0, y:0, z:0};

    
    updateEarthreaction(plane,weight,wind,lift,push,drag,friction,centrifugal){
        
        if(plane.position_vector.y <= plane.ground_height)
        {
            // this.vector.y=-(lift.leftVector.y + lift.rightVector.y + push.vector.y + drag.vector.y + weight.vector.y + centrifugal.vector.y  + friction.vector.y)
            this.vector.y=-(Math.min(lift.leftVector.y,0) + Math.min(lift.rightVector.y,0) + Math.min(push.vector.y,0) + Math.min(drag.vector.y,0) + Math.min(weight.vector.y,0) + Math.min(centrifugal.vector.y,0))
            if(plane.velocity_vector.y<-5) plane.velocity_vector.y*=-1/2;
        }
        else {
            this.vector.y=0;
        }
        // console.log('yyy:'+this.vector.y);
    }
    

}