class HealthBar
{
	constructor(obj){
		this.obj=obj;
		this.health = 1;
	}

	reduce()
	{
		if(this.health-0.01 > 0)
			this.health = this.health - 0.001;
		else
			this.health = 0;

		this.obj.scaleX = this.health;
	}
	
}