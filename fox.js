class Fox{
	constructor(obj, vel){
		this.obj = obj;
		this.obj.displayWidth = 40;
		this.obj.displayHeight = 40;
        this.stand = true;
        this.selected = false;
        this.moving = false;
        this.fight = false;
        this.destx = -1;
        this.desty = -1;
        this.vel = vel;
    }
    
    clip(c){
		if(c == 'x'){
			if(Math.abs(this.destx - this.obj.x) < this.vel/20)
				this.obj.x = this.destx;
		}
		else{
			if(Math.abs(this.desty - this.obj.y) < this.vel/20)
				this.obj.y = this.desty;
		}
	}
    move(){
        if(this.moving){
            this.clip('x');
			this.clip('y');
            if(this.obj.x == this.destx && this.obj.y == this.desty){
                this.moving = false;
                this.stand = true;
            }
			if(this.desty > this.obj.y){
				this.obj.setVelocityY(this.vel)
			}
			else if(this.desty < this.obj.y){
				this.obj.setVelocityY(-this.vel)
			}
			else{
                this.obj.setVelocityY(0);
			}

			if(this.destx > this.obj.x){
				this.obj.setVelocityX(this.vel)
				this.obj.setVelocityY(0)
			}
			else if(this.destx < this.obj.x){
				this.obj.setVelocityX(-this.vel)
				this.obj.setVelocityY(0)
			}
			else{
				this.obj.setVelocityX(0)
            }
            
            
        }
    }
    stop(){
    	this.moving = false;
    	this.obj.setVelocityX(0);
    	this.obj.setVelocityY(0);
    }
}