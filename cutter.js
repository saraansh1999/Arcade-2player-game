class Cutter{
	constructor(obj, vel){
		this.vel = vel
		this.obj = obj
		this.unstopped = true;
		this.cutfrom = 'none'
		this.iscutting = false;
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
		this.obj.setVelocityX(0);
		this.obj.setVelocityY(0);
		this.unstopped = false;
	}	
	startcutting(){
		if(Math.abs(this.obj.x - this.destx) > Math.abs(this.obj.y - this.desty)){
			if(this.obj.x < this.destx){
				this.cutfrom = 'top'
			}
			else{
				this.cutfrom = 'bottom'
			}
		}
		else{
			if(this.obj.y > this.desty){
				this.cutfrom = 'right'
			}
			else{
				this.cutfrom = 'left'
			}	
		}
	}
}