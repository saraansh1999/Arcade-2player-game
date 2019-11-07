class Bin
{
	constructor(obj,type,lx,ux,ly,uy){
		this.obj=obj;
        this.lx = lx;
        this.ux = ux;
        this.ly = ly;
        this.uy = uy;
        this.type = type;
        console.log(this.type,this.lx,this.ux,this.ly,this.uy);
    }

	check(x,y)
	{
        // console.log(this.type,x,y,this.lx,this.ux,this.ly,this.uy);
		if(x >= this.lx && x<=this.ux  )
		{
			if(y >= this.ly && y<=this.uy)
			{
				return 1;
			}
		}
		return 0;
	}

	reset()
	{
		this.obj.visible = 1;
	}

	hide()
	{
		this.obj.visible = 0;
	}
	
}