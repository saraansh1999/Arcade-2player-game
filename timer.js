class Timer
{
	constructor(obj){
		this.obj=obj;
		this.health = 4;
		this.start = 0;
	}

	reduce()
	{
		var a = 0.0045
		if(this.health-a > 0)
			this.health = this.health - a;
		else
			this.health = 0;

		this.obj.scaleX = this.health;
	}
	bigreduce()
	{
		var a = 0.3;
		if(this.health-a > 0)
			this.health = this.health - a;
		else
			this.health = 0;

		this.obj.scaleX = this.health;
	}
	reset()
	{
		this.health = 4;
		this.obj.scaleX = 4;
		this.start = 1;
		this.obj.visible= 1;
	}

	hide()
	{
		this.obj.visible = 0;
	}
	
}