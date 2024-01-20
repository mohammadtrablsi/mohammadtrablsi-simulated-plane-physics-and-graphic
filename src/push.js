export class Push {

    vector = {x:0, y:0, z:0};
    variables = {push:0, max_push:8000000, start_eng:0};   // max push should be 2 millions.

    // updatePush(plane) {

    //     if(this.variables.start_eng == 1){
    //         this.variables.push = this.variables.max_push;
    //         plane.variables.fuel-=Math.min(plane.variables.fuel_consumption,plane.variables.fuel);
    //     }
    //     else{
    //         this.variables.push=0;
    //     }

    //     this.vector.x = this.variables.push * Math.cos(-plane.angles.pitch) * Math.sin(plane.angles.yaw);

    //     this.vector.z = this.variables.push * Math.cos(-plane.angles.pitch) * Math.cos(plane.angles.yaw);

    //     this.vector.y =this.variables.push * Math.sin(-plane.angles.pitch);
    //     // console.log('ppppppppp'+this.variables.push);
    // }

    updatePush(plane) {

        this.variables.push = (this.variables.max_push/8)*this.variables.start_eng;
        plane.variables.fuel-=Math.min(plane.variables.fuel_consumption*this.variables.start_eng*plane.variables.deltaTime,plane.variables.fuel);
        

        this.vector.x = this.variables.push * Math.cos(-plane.angles.pitch) * Math.sin(plane.angles.yaw);

        this.vector.z = this.variables.push * Math.cos(-plane.angles.pitch) * Math.cos(plane.angles.yaw);

        // this.vector.y =this.variables.push * Math.sin(-plane.angles.pitch);
        // console.log('ppppppppp'+this.variables.push);
    }

    
    controlPanel(gui){

        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "w":
                    if(this.variables.start_eng < 8) this.variables.start_eng+=1;
                    break;

                case "s":
                    if(this.variables.start_eng > 0) this.variables.start_eng-=1;
                    break;

                // case "b":
                //     this.variables.push = 0;
    
            }
        });
    }
}