CANVAS_W = 1200;
CANVAS_H = 650;

var gamescene = new Phaser.Scene("gamescene");
var homescreen = new Phaser.Scene("homescreen");

function findDis(a, b){
    var t = a.x - b.x;
    var p = a.y - b.y;
    return (Math.abs(t) + Math.abs(p));
}

function getClosest(trees, cutter){
    if(trees.length > 0){
        for(var i = 0; i < trees.children.length; i++){
            var tempDis = this.findDis(cutter, trees.children[i]);
            if(tempDis < dis){
                ret = trees[i];
                dis = tempDis;
            }
        }
        return ret;
    }
}


var config = {
    type: Phaser.AUTO,
    width: CANVAS_W,
    height: CANVAS_H,
    physics: {
        default: 'arcade',
    },
};

var game = new Phaser.Game(config);

gamescene.preload = function(){
    this.load.image('sand', 'assets/sand.jpg');
    this.load.image('tree', 'assets/treenew.png');
    // this.load.image('cutter', 'assets/cutter.png');
    this.load.image('healthBar', 'assets/lifebar.png');
    this.load.spritesheet('cutter', 'assets/cutter_sprites.png', 
        {frameWidth: 64, frameHeight: 64}
        );
    this.load.spritesheet('fox1', 'assets/wolf1.png', {
        frameWidth: 32, frameHeight: 64
    });
    this.load.spritesheet('fox2', 'assets/wolf2.png', {
        frameWidth: 64, frameHeight: 32
    });
    this.load.spritesheet('fox3', 'assets/wolf3.png', {
        frameWidth: 64, frameHeight: 32
    });
    this.load.spritesheet('foxrest', 'assets/howl.png', {
        frameWidth: 64, frameHeight: 64
    });
    this.load.spritesheet('foxsel', 'assets/howlsel.png', {
        frameWidth: 64, frameHeight: 64
    });
    this.load.spritesheet('poacher', 'assets/poacher.png', {
        frameWidth: 64 , frameHeight: 64
    });
    this.load.spritesheet('crosshair', 'assets/crosshair.png', {
        frameWidth: 64 , frameHeight: 64
    });
}

var num_cutters, cutters, num_trees, trees, poachers, poachertl=false, poachertr=false, poacherbl=false, poacherbr=false;;
var d = new Date()
var t = d.getTime()


gamescene.create = function(){
    //set bg
    this.bg = this.add.image(0, 0, 'sand').setScale(4);

    //create woodcutter
    num_cutters = 4
    var a =50;
    cutters = []
    for (var i = 0; i < num_cutters; i++) {
        var x = Phaser.Math.RND.between(0, 50);
        var y = a
        a= a+100;
        tempCutter = new Cutter(this.physics.add.sprite(x, y, 'cutter'), 200)
        cutters.push(tempCutter);
    }

    //create health bars
    bar = [];

    //create trees
    num_trees = 10
    trees = this.physics.add.staticGroup();
    for (var i = 0; i < num_trees; i++) {
        var x = Phaser.Math.RND.between(100, CANVAS_W-100);
        var y = Phaser.Math.RND.between(100, CANVAS_H-100);
        trees.create(x, y, 'tree').setScale(0.8);
        var tempBar=new HealthBar(this.add.image(x,y-50,'healthBar'));
        bar.push(tempBar);
    }

    num_foxes = 1;
    fox =  []; 
    // create fox
    
    for (var i =0 ;i < num_foxes ; i++)
    {
        var x = Phaser.Math.RND.between(100, CANVAS_W-100);
        var y = Phaser.Math.RND.between(100, CANVAS_H-100);
        temp_fox = new Fox(this.physics.add.sprite(x, y, 'fox'), 200);
        temp_fox.obj.setInteractive();
        fox.push(temp_fox);
    }
    this.input.keyboard.on('keyup', function(event){
        if(event.key == "1")
            selectFox(fox[0]);
    }, this);

    //create poachers
    num_poachers = 0
    poachers = []


    //animations
    this.anims.create({
        key: 'foxright',
        frames: this.anims.generateFrameNumbers('fox2', {start: 6, end: 9}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'foxleft',
        frames: this.anims.generateFrameNumbers('fox3', {start: 6 , end: 9}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'foxdown',
        frames: this.anims.generateFrameNumbers('fox1', {start: 31, end: 34}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'foxup',
        frames: this.anims.generateFrameNumbers('fox1', {start: 36, end: 39}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'selectedFox',
        frames: this.anims.generateFrameNumbers('foxsel', {start: 0, end: 0}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'foxstand',
        frames: this.anims.generateFrameNumbers('foxrest', {start: 0, end: 0}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('cutter', {start: 105, end: 112}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('cutter', {start: 131, end: 138}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('cutter', {start: 118, end: 125}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('cutter', {start: 144, end: 151}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'cutfromright',
        frames: this.anims.generateFrameNumbers('cutter', {start: 170, end: 174}),
        frameRate: 10,
        repeat: -1 
    })
    this.anims.create({
        key: 'cutfromleft',
        frames: this.anims.generateFrameNumbers('cutter', {start: 183, end: 187}),
        frameRate: 10,
        repeat: -1 
    })

    this.anims.create({
        key: 'cutfromtop',
        frames: this.anims.generateFrameNumbers('cutter', {start: 196, end: 200}),
        frameRate: 10,
        repeat: -1 
    })

    this.anims.create({
        key: 'cutfrombottom',
        frames: this.anims.generateFrameNumbers('cutter', {start: 157, end: 161}),
        frameRate: 10,
        repeat: -1 
    })
    this.anims.create({
        key: 'poacherup',
        frames: this.anims.generateFrameNumbers('poacher', {start: 105, end: 112}),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: 'poacherdown',
        frames: this.anims.generateFrameNumbers('poacher', {start: 131, end: 138}),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: 'poacherleft',
        frames: this.anims.generateFrameNumbers('poacher', {start: 118, end: 125}),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: 'poacherright',
        frames: this.anims.generateFrameNumbers('poacher', {start: 144, end: 151}),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: 'poacherstand',
        frames: this.anims.generateFrameNumbers('poacher', {start: 27, end: 27}),
        frameRate: 10,
        repeat: -1
    })




    collider_tree_cutter = [];
    //collisions
    for(let i = 0; i < num_cutters; i++){
        x=this.physics.add.collider(cutters[i].obj, trees, cuttree, null, this);
        collider_tree_cutter.push(x);
        function cuttree(cutterobj, tree)
        {
            if(tree.active==true)
            {
                cutters[i].stop()
                // cutterobj.anims.pause()
                cutters[i].iscutting = true;
                cutters[i].startcutting()
            }
        }
    }
}

function selectFox(obj){
    obj.stand = false;
    obj.selected = true;
    obj.stop()
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]];
        return array
    }
}

gamescene.update = function(){

    d = new Date()
    if(d.getTime() - t > 1000){
        let arr = shuffle([1, 2, 3, 4])
        for(var i = 0; i < 4; i++){
            if(arr[i] == 1){
                if(!poachertl){
                    var y = -100
                    var x = -100
                    var destx = 50
                    var desty = 50
                    tempPoacher = new Poacher(this.physics.add.sprite(x, y, 'poacher'), this.physics.add.sprite(x, y, 'crosshair'), 200, destx, desty, 1);
                    poachers.push(tempPoacher)
                    num_poachers += 1
                    poachertl = true
                    t = d.getTime()
                    break;
                }
            }
            else if(arr[i] == 2){
                if(!poacherbl){
                    var y = CANVAS_H
                    var x = -100
                    var destx = 50
                    var desty = CANVAS_H - 50
                    tempPoacher = new Poacher(this.physics.add.sprite(x, y, 'poacher'), this.physics.add.sprite(x, y, 'crosshair'), 200, destx, desty, 2);
                    poachers.push(tempPoacher)
                    num_poachers += 1
                    poacherbl = true
                    t = d.getTime()
                    break;
                }
            }
            else if(arr[i] == 3){
                if(!poacherbr){
                    var y = CANVAS_H
                    var x = CANVAS_W
                    var destx = CANVAS_W - 50
                    var desty = CANVAS_H - 50
                    tempPoacher = new Poacher(this.physics.add.sprite(x, y, 'poacher'), this.physics.add.sprite(x, y, 'crosshair'), 200, destx, desty, 3);
                    poachers.push(tempPoacher)
                    num_poachers += 1
                    poacherbr = true
                    t = d.getTime()
                    break;
                }

            }
            else if(arr[i] == 4){
                if(!poachertr){
                    var y = -100
                    var x = CANVAS_W
                    var destx = CANVAS_W - 50
                    var desty = 50
                    tempPoacher = new Poacher(this.physics.add.sprite(x, y, 'poacher'), this.physics.add.sprite(x, y, 'crosshair'), 200, destx, desty, 4);
                    poachers.push(tempPoacher)
                    num_poachers += 1
                    poachertr = true
                    t = d.getTime()
                    break;
                }
            }
        }
    }
    for(var i = 0; i < num_poachers; i++){
        if(poachers[i].shooting == -1){
            minimum = 100000
            for(var q = 0; q < num_foxes; q++){
                tempDis = findDis(poachers[i].obj, fox[q].obj)
                if(tempDis < minimum){
                    minimum = tempDis
                    ind = q;
                }
            }
            poachers[i].lockTarget(fox[ind])
        }
        poachers[i].move()
        if(poachers[i].obj.body.velocity.x == 0 && poachers[i].obj.body.velocity.y == 0){
            poachers[i].obj.anims.play('poacherstand', true)
        }
        if(poachers[i].obj.body.velocity.x > 0){
            poachers[i].obj.anims.play('poacherright', true)
        }
        else if(poachers[i].obj.body.velocity.x < 0){
            poachers[i].obj.anims.play('poacherleft', true)
        }
        if(poachers[i].obj.body.velocity.y > 0){
            poachers[i].obj.anims.play('poacherdown', true)
        }
        else if(poachers[i].obj.body.velocity.y < 0){
            poachers[i].obj.anims.play('poacherup', true)
        }
    }

    //devesh    
    this.input.on('pointerup', function(event){
        if(fox[0].selected){
            fox[0].moving = true;
            fox[0].selected = false;
            fox[0].destx = this.input.mousePointer.x;
            fox[0].desty = this.input.mousePointer.y;
        }
    }, this);
    
    for(var i=0;i<num_foxes ;i++)
    {
        fox[i].move();
        if(fox[i].stand == true){
            fox[i].obj.anims.play('foxstand', true);
        }
        if(fox[i].selected == true){
        	fox[i].obj.anims.play('selectedFox', true);	
        }
        if(fox[i].obj.body.velocity.x > 0){
            fox[i].obj.anims.play('foxright', true)
        }
        else if(fox[i].obj.body.velocity.x < 0){
            fox[i].obj.anims.play('foxleft', true)
        }
        if(fox[i].obj.body.velocity.y > 0){
            fox[i].obj.anims.play('foxdown', true)
        }
        else if(fox[i].obj.body.velocity.y < 0){
            fox[i].obj.anims.play('foxup', true)
        }
    }
    
    for(var i = 0; i < num_cutters; i++)
    {
        if(cutters[i].health != 0 )
        {
	        if(cutters[i].obj.body.velocity.x == 0 && cutters[i].obj.body.velocity.y == 0)
	        {
	            min = 100000
	            var cnt = 0;
	            trees.getChildren().forEach(function(tree){
	                cnt = cnt + 1;
	                if(tree.active == true)
	                {
	                    tempDis = findDis(tree, cutters[i].obj);
	                    if(tempDis < min){
	                        min = tempDis;
	                        destx = tree.x;
	                        desty = tree.y;
	                    }
	                }
	            }, this);
	            if(cnt > 0)
	            	cutters[i].setDest(destx, desty);
	        }
	    }
        cutters[i].move()


        if(cutters[i].obj.body.velocity.x > 0){
            cutters[i].obj.anims.play('right', true)
        }
        else if(cutters[i].obj.body.velocity.x < 0){
            cutters[i].obj.anims.play('left', true)
        }
        if(cutters[i].obj.body.velocity.y > 0){
            cutters[i].obj.anims.play('down', true)
        }
        else if(cutters[i].obj.body.velocity.y < 0){
            cutters[i].obj.anims.play('up', true)
        }

        if(cutters[i].cutfrom == 'top'){
            cutters[i].obj.anims.play('cutfromtop', true)
        }
        else if(cutters[i].cutfrom == 'bottom'){
            cutters[i].obj.anims.play('cutfrombottom', true)
        }
        else if(cutters[i].cutfrom == 'left'){
            cutters[i].obj.anims.play('cutfromleft', true)
        }   
        else if(cutters[i].cutfrom == 'right'){
            cutters[i].obj.anims.play('cutfromright', true)
        }
        
        // to reduce health bar , find the index of nearest tree and reduce
        // the health of corresponding bar
        if(cutters[i].health != 0 )
        { 
	       	var rem = -1;
	        if(cutters[i].iscutting == 1)
	        {
	            var a = 0;
	            trees.getChildren().forEach(function(tree)
	            {
	                if(cutters[i].destx == tree.x && cutters[i].desty == tree.y)                
	                {
	                    bar[a].reduce();
	                    if(bar[a].health == 0)
	                    {
	                    	for(var j = 0; j<num_cutters ;j++)
	                    	{
	                    		if(cutters[j].destx == tree.x && cutters[j].desty == tree.y)
	                    		{
		                        	cutters[j].iscutting = 0;
		                        	cutters[j].cutfrom = 'no';
		                        	cutters[j].unstopped = true;
	                    		}
	                    	}
	                    	rem = a;
	                        // console.log(a,"removed");
	                        trees.killAndHide(tree);
	                        for(var j = a ; j < num_trees-1 ; j++)
	                        {
	                        	bar[j]=bar[j+1];
	                        }
	                        num_trees=num_trees-1;
	                    }
	                }
	                a = a + 1; 
	            }, this);
	        	var cnt =0;
	        	trees.getChildren().forEach(function(tree)
	            {
	            	if(cnt==rem)
	            	{
	            		trees.remove(tree);
	            	}
	            	cnt = cnt + 1;
	            }, this);
	        }
	    }
    }
    
    //attack of fox 
   	for(var i =0 ;i < num_foxes ; i++)
    {
        if(fox[i].cutter==-1)
       	{
    	    for(var j = 0 ; j < num_cutters ; j++)
    	    {
    	    	var dx=(cutters[j].obj.x-fox[i].obj.x);
    	    	var dy=(cutters[j].obj.y-fox[i].obj.y);
    	    	var d = (dx*dx+dy*dy);
    	    	if(d < 8000)
    	    	{
    	   			fox[i].cutter = j;
    	   			break;
    	    	}
    	    	// console.log(i,dx,dy,d);
    	    }
    	}

    	if(fox[i].cutter != -1)
    	{
    		var id =fox[i].cutter;
        	var dx=(cutters[id].obj.x-fox[i].obj.x);
        	var dy=(cutters[id].obj.y-fox[i].obj.y);
        	var d = (dx*dx+dy*dy);
        	// console.log(d);
        	if(d < 8000)
        	{
    			cutters[id].reduce();
    			if(cutters[id].health==0)
    			{
    				fox[i].cutter = -1;
    				collider_tree_cutter[id].destroy;
    	            cutters[id].setDest(20, id*50+50);
    	    		cutters[id].obj.setTint(0x0000ff);
    	    		cutters[id].unstopped = 1;
    	    		cutters[id].cutfrom = 'no';
    			}
        	}
        	else
        	{
        		fox[i].cutter = -1;
        	}
    	}
    }
}

homescreen.preload = function(){

}

homescreen.create = function(){
    this.text = this.add.text(0, 0, "Welcome to Game", {font: "40px Impact"});
    var tween = this.tweens.add({
        targets: this.text,
        x: 200,
        y: 250,
        duration: 2000,
        ease: "Elastic",
        easeParams: [1.5, 0.5],
        delay: 1000,
        onComplete: function(src, tgt){
            tgt[0].x = 0;
            tgt[0].y = 0;
            tgt[0].setColor("Red");
        }
    }, this);

    this.key_1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
}

homescreen.update = function(){
    if(this.key_1.isDown)
        this.scene.start("gamescene");
}

game.scene.add('homescreen', homescreen);
game.scene.add('gamescene', gamescene);

game.scene.start('homescreen');