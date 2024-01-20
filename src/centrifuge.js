export class Centrifuge {

    vector = {x:0, y:0, z:0}

    updateCenterrifugalForce(plane) {
        let v = Math.sqrt(Math.pow(plane.velocity_vector.x,2)+Math.pow(plane.velocity_vector.z,2));
        
        let m = plane.mass;

        let magnitude = m * v * plane.angles_velocity.yaw;
        
        // this.vector.x = magnitude * Math.cos(Math.PI + plane.angles.yaw);

        // this.vector.z = magnitude * Math.sin(Math.PI + plane.angles.yaw);
        
    }
}