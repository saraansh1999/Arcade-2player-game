class HealthBar
{
	constructor(obj){
		console.log("Babba");
		this.obj=obj;
	}

	setPercent(percent)
	{
		percent=percent/100;
		this.obj.scaleX = percent;
	}
	
}