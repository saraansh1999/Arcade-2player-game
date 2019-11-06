class Waste
{

	constructor(obj, type, lx ,ux ,ly, uy)
	{
		this.obj = obj
		this.type = type;
		this.isPicked = 0;
		this.inBin = 0;
		this.lx = lx; 
		this.ux = ux;
		this.ly = ly;
		this.uy = uy;
		this.startx = obj.x;
		this.starty = obj.y;
	}
	
	check()
	{
		// console.log('x',this.obj.x, this.lx , this.ux);
		// console.log('y',this.obj.y, this.ly , this.uy);
		if(this.obj.x >= this.lx && this.obj.x<=this.ux  )
		{
			if(this.obj.y >= this.ly && this.obj.y<=this.uy)
			{
				return 1;
			}
		}
		return 0;
	}

	reset()
	{
		this.obj.x = this.startx;
		this.obj.y = this.starty;
		this.inBin = 0;
		this.obj.visible = 1;
	}
}