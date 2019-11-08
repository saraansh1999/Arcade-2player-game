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
		this.shooting = -1000
		this.blastRadius = this.crosshair.displayWidth
		this.shootSound = undefined
	}
	lockTarget(fox){
		this.target = fox;
	}
	die(){
		this.obj.destroy()
		this.crosshair.destroy()
	}
	clip(obj, dx, dy, vel){
		if(Math.abs(dx - obj.x) < vel/10){
			obj.setVelocityX(1*Math.sign(dx - obj.x))
		}
		if(Math.abs(dy - obj.y) < vel/10){
			obj.setVelocityY(1*Math.sign(dy - obj.y))
		}
	}
	shoot(success){
		this.crosshair.alpha = 0.1
		this.shooting = -400
		this.crosshair.x = this.obj.x
		this.crosshair.y = this.obj.y
		this.crosshair.setVelocityY(0)
		this.crosshair.setVelocityX(0)
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
			if(Math.abs(this.crosshair.x - this.target.obj.x) <= 1){
				this.crosshair.setVelocityX(0)	
			}
			else if(this.crosshair.x > this.target.obj.x){
				this.crosshair.setVelocityX(-this.cvel)
			}
			else if(this.crosshair.x < this.target.obj.x){
				this.crosshair.setVelocityX(this.cvel)
			}
			if(Math.abs(this.crosshair.y - this.target.obj.y) <= 1){
				this.crosshair.setVelocityY(0)	
			}
			else if(this.crosshair.y > this.target.obj.y){
				this.crosshair.setVelocityY(-this.cvel)
			}
			else if(this.crosshair.y < this.target.obj.y){
				this.crosshair.setVelocityY(this.cvel)
			}
			// if(this.crosshair.body.velocity.y == 0 && this.crosshair.body.velocity.x == 0)
				// this.crosshair.alpha += 0.005
			// else
				this.crosshair.alpha += 0.001
		}
		if(this.moving){
			this.clip(this.obj, this.destx, this.desty, this.cvel);
			if(Math.abs(this.desty - this.obj.y) <= 1){
				this.obj.setVelocityY(0)
			}
			else if(this.desty < this.obj.y){
				this.obj.setVelocityY(-this.cvel)
			}
			else if(this.desty > this.obj.y){
				this.obj.setVelocityY(this.cvel)
			}

			if(Math.abs(this.destx - this.obj.x) <= 1){
				this.obj.setVelocityX(0)
			}
			else if(this.destx < this.obj.x){
				this.obj.setVelocityX(-this.cvel)
				this.obj.setVelocityY(0)
			}
			else if(this.destx > this.obj.x){
				this.obj.setVelocityX(this.cvel)
				this.obj.setVelocityY(0)
			}
			if(Math.abs(this.obj.x - this.destx) <= 1 && Math.abs(this.obj.y - this.desty) <= 1){
				this.moving = false;
			}
		}
	}
}