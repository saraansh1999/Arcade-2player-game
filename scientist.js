class Scientist
{

	constructor(obj)
	{
		this.obj = obj
		this.curWaste = -1;
		this.health = 100;
		this.startx = obj.x;
		this.starty = obj.x;
	}
	
	reduce()
	{
		if(this.health >0)
		{
			this.health -= 1;
		}
	}
	reset()
	{
		this.obj.x = this.startx;
		this.obj.y = this.starty;
	}
}