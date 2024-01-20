
export class Weight {

    vector = {x:0, y:0, z:0};
    variables = {earthRadius:4000, gravitationalConstant:1000 , earthMass:1000000 };
    //variables = {gravity:10};

    
    updateWeight(plane){
        
        let height = this.variables.earthRadius + plane.position_vector.y;// + this.variables.earthRadius;

        let gravity = (this.variables.gravitationalConstant * this.variables.earthMass) / (height * height);

        let w = plane.variables.mass * 9.8;

        this.vector.y = -w;
    }


    controlPanel(gui){                              // gui and controll panel
        // gui.add(this.variables,'earthRadius',0,8000,1);
        // gui.add(this.variables,'gravitationalConstant',0,2000,1);
        // gui.add(this.variables,'earthMass',0,1000000,1);
    }
}