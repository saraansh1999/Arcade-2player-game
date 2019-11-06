class Scientist
{

	constructor(obj)
	{
		this.obj = obj
		this.curWaste = -1;
		this.health = 100;
		this.startx = obj.x;
		this.starty = obj.y;
	}
	
	hurt()
	{
		this.health -= 20;
		console.log("Scientist hurt", this.health)
	}
	reset(sucess)
	{
		this.curWaste = -1	
		if(sucess){
			this.obj.x = this.opponent.obj.x;
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
}