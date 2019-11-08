class HealthBar
{
	constructor(obj){
		this.obj=obj;
		this.health = 1;
	}

	reduce(decrease=0.001)
	{
		if(this.health-decrease > 0)
			this.health = this.health - decrease;
		else
			this.health = 0;
		this.obj.scaleX = this.health;
	}
	
}