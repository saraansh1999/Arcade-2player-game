class Cutter{
	constructor(obj, vel,active){
		this.vel = vel
		this.obj = obj
		this.obj.visible = 0
		this.unstopped = true;
		this.cutfrom = 'none'
		this.iscutting = false;
		this.health = 100;
		this.tint = [255, 255, 255]
		this.active = active;
		this.obj.setSize(40, 40, 20, 20)
	}   
	setDest(x, y){
		this.destx = x
		this.desty = y
	}

	setid(id)
	{
		this.id = id
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
		if(this.unstopped){
			this.clip('x');
			this.clip('y');
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
	stop(){
		// this.obj.setVelocityX(0);
		// this.obj.setVelocityY(0);
		this.unstopped = false;
	}	
	startcutting(){
		var center = this.obj.getCenter()
		if(Math.abs(center.x - this.destx) < Math.abs(center.y - this.desty)){
			if(center.y < this.desty){
				this.cutfrom = 'left'
			}
			else{
				this.cutfrom = 'bottom'
			}
		}
		else{
			if(center.x > this.destx){
				this.cutfrom = 'right'
			}
			else{
				this.cutfrom = 'top'
			}	
		}
	}
	stopCutting(){
		this.iscutting = 0;
		// this.cutSound.pause()
		this.cutfrom = 'no';
		this.unstopped = true;
	}
	reduce()
	{
		if(this.health >0)
		{
			this.health -= 1;
			this.tint[0] -= 1;
			this.tint[1] -= 2;
			this.tint[2] -= 1;
			this.obj.setTint((this.tint[0] * 0x010000) + (this.tint[1] * 0x000100) + (this.tint[2] * 0x000001))
		}
	}
}