class Timer
{
	constructor(obj){
		this.obj=obj;
		this.health = 4;
		this.start = 0;
	}

	reduce()
	{
		if(this.health-0.01 > 0)
			this.health = this.health - 0.005;
		else
			this.health = 0;

		this.obj.scaleX = this.health;
	}
	reset()
	{
		this.health = 4;
		this.obj.scaleX = 4;
		this.start = 0;
	}
	
}