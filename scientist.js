class Scientist
{

	constructor(obj)
	{
		this.obj = obj
		this.curWaste = -1;
		this.health = 100;
		this.startx = obj.x;
		this.starty = obj.y;
		this.inGame = 0;
		this.can_move = true
	}
	
	hurt()
	{
		this.health -= 20;
		// console.log("Scientist hurt", this.health)
	}
	reset(sucess)
	{
		this.curWaste = -1	
		this.inGame = 0;
		if(sucess){
			this.obj.x = this.opponent.obj.x - 20;
			this.obj.y = this.opponent.obj.y;
			//kill
		}
		else{
			this.obj.x = this.startx;
			this.obj.y = this.starty;
			this.hurt()
		}
	}
	setOpp(poacher){
		this.opponent = poacher
	}
	teleport(){
		this.can_move = false
		this.obj.setVelocityX(0)
		this.obj.setVelocityY(0)
		this.obj.anims.pause()
		this.obj.alpha += 0.01
		if(this.obj.alpha >= 1){
			this.obj.alpha = 1
			this.inGame = 2
			this.can_move = true
		}
	}
}