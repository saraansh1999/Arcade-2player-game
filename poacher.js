class Poacher{
	constructor(obj, vel, destx, desty){
		this.vel = vel
		this.obj = obj
		this.destx = destx
		this.desty = desty
		this.moving = true
	}
	clip(c){
		if(c == 'x'){
			if(Math.abs(this.destx - this.obj.x) < this.vel/10)
				this.obj.x = this.destx;
		}
		else{
			if(Math.abs(this.desty - this.obj.y) < this.vel/10)
				this.obj.y = this.desty;
		}
	}
	move(){
		if(this.moving){
			this.clip('x');
			this.clip('y');
			if(this.obj.x == this.destx && this.obj.y == this.desty){
                this.moving = false;
            }
			if(this.desty > this.obj.y){
				this.obj.setVelocityY(this.vel)
			}
			else if(this.desty < this.obj.y){
				this.obj.setVelocityY(-this.vel)
			}
			else{
				this.obj.setVelocityY(0)
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
}