
export class Rotation {

    torque={roll:0, pitch:0, yaw:0}

    updateYaw(plane,F){
        let r=plane.variables.length/2;
        this.torque.yaw = F*r;
    }
    updateRoll(plane,L1,L2){
        let r=plane.variables.wing_length;
        this.torque.roll = (L2-L1)*r;
    }
    udpatePitch(plane,L){
        let r=plane.variables.wing_length;
        this.torque.pitch = L*r;
    }
}