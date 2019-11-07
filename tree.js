class Tree
{
	constructor(treeobj, healthbar){
		this.treeobj=treeobj;
		this.treeobj.body.width = 50
		this.treeobj.body.height = 50
		this.treeobj.body.displayWidth = 50
		this.treeobj.body.displayHeight = 50
		this.treeobj.setImmovable(true);
		this.healthbar=healthbar;
		this.health = 1;
	}

	reduce(cutter)
	{
		this.cutter = cutter
		this.cutter.startCutting()
		if(this.health-0.01 > 0)
			this.health = this.health - 0.01;
		else
			this.health = 0;

		this.healthbar.scaleX = this.health;
	}

	isDead(){
		if(this.health == 0){
			this.cutter.stopCutting()
			return true
		}
		return false
	}
	
}