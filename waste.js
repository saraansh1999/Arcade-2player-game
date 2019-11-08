class Waste
{

	constructor(obj, type)
	{
		this.obj = obj
		this.type = type;
		this.isPicked = 0;
		this.inBin = 0;
		this.startx = obj.x;
		this.starty = obj.y;
	}

	reset()
	{
		this.obj.x = this.startx;
		this.obj.y = this.starty;
		this.inBin = 0;
		this.obj.visible = 1;
		this.isPicked = 0
	}

	hide()
	{
		this.obj.visible = 0;
	}
}