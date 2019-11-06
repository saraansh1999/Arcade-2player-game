class Scientist
{

	constructor(obj)
	{
		this.obj = obj
		this.curWaste = -1;
	}
	
	reduce()
	{
		if(this.health >0)
		{
			this.health -= 1;
		}
	}
}