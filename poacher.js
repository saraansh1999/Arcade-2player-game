class Poacher{
	constructor(obj, chobj, vel, destx, desty, type){
		this.cvel = vel/5
		this.obj = obj
		this.destx = destx
		this.desty = desty
		this.moving = true
		this.type = type
		this.crosshair = chobj
		this.crosshair.alpha = 0.1
		this.shooting = -400
	}
	lockTarget(fox){
    	this.target = fox;
    }
	clip(obj, dx, dy, vel){
			if(Math.abs(dx - obj.x) < vel/10){
				obj.x = dx;
				obj.setVelocityX(0)
			}
			if(Math.abs(dy - obj.y) < vel/10){
				obj.y = dy;
				obj.setVelocityY(0)
			}
	}
	move(){
		this.shooting += 1
		if(this.shooting >= 0){
			this.moving = true
			if(this.type == 1 || this.type == 3){
				this.destx = this.target.obj.x
			}
			else{
				this.desty = this.target.obj.y
			}
			if(this.shooting == 0){
				this.crosshair.x = this.obj.x;
				this.crosshair.y = this.obj.y;
			}
			this.clip(this.crosshair, this.target.obj.x, this.target.obj.y, this.cvel)
			if(this.crosshair.x < this.target.obj.x){
				this.crosshair.setVelocityX(this.cvel)
			}
			else if(this.crosshair.x > this.target.obj.x){
				this.crosshair.setVelocityX(-this.cvel)
			}
			if(this.crosshair.y < this.target.obj.y){
				this.crosshair.setVelocityY(this.cvel)
			}
			else if(this.crosshair.y > this.target.obj.y){
				this.crosshair.setVelocityY(-this.cvel)
			}
			if(this.crosshair.body.velocity.y == 0 && this.crosshair.body.velocity.x == 0)
				this.crosshair.alpha += 0.005
			else
				this.crosshair.alpha += 0.0005
			if(this.crosshair.alpha >= 1){
				this.target.hit()
				this.crosshair.alpha = 0.1
				this.shooting = -400
			}
		}
		if(this.moving){
			// causing a few problems..................................
			this.clip(this.obj, this.destx, this.desty, this.cvel);
			if(this.desty > this.obj.y){
				this.obj.setVelocityY(this.cvel)
			}
			else if(this.desty < this.obj.y){
				this.obj.setVelocityY(-this.cvel)
			}
			else{
				this.obj.setVelocityY(0)
			}

			if(this.destx > this.obj.x){
				this.obj.setVelocityX(this.cvel)
				this.obj.setVelocityY(0)
			}
			else if(this.destx < this.obj.x){
				this.obj.setVelocityX(-this.cvel)
				this.obj.setVelocityY(0)
			}
			else{
				this.obj.setVelocityX(0)
			}
			if(this.obj.x == this.destx && this.obj.y == this.desty){
                this.moving = false;
            }
		}
	}
}