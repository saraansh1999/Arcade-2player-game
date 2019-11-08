CANVAS_W = 800;
CANVAS_H = 600;

var gamescene = new Phaser.Scene("gamescene");
var homescreen = new Phaser.Scene("homescreen");
var introduction = new Phaser.Scene("introduction");

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
	width: CANVAS_W+600,
	height: CANVAS_H+110,
	physics: {
		default: 'arcade',
	},
};

var game = new Phaser.Game(config);

gamescene.preload = function(){
	this.load.audio('jungle', 'assets/sounds/jungle.mp3', {
		instances: 1
	});
	this.load.audio('arrow', 'assets/sounds/arrow.mp3', {
		instances: 1
	});
	this.load.audio('woodcut', 'assets/sounds/woodcut.mp3', {
		instances: 1
	});
	this.load.image('sand', 'assets/sand2.jpg');
	this.load.image('sky', 'assets/sky.png');
	this.load.image('tree', 'assets/treenew.png');
	this.load.image('healthBar', 'assets/lifebar.png');
	this.load.image('seperator', 'assets/seperator.png');
	this.load.image('plasticBin', 'assets/plastic.png');
	this.load.image('organicBin', 'assets/organic.png');
	this.load.image('paperBin', 'assets/paper.png');
	this.load.image('polythene', 'assets/polythene.png');
	this.load.image('paperball', 'assets/paperwaste.png');
	this.load.image('bottle1', 'assets/bottle1.png');
	this.load.image('bottle2', 'assets/bottle2.png');
	this.load.image('banana', 'assets/bananawaste.png');
	this.load.image('cardboard', 'assets/cardboard_waste.png');
	this.load.image('apple', 'assets/apple_waste.png');
	this.load.image('organic', 'assets/organic_waste.png');


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
	this.load.spritesheet('scientist', 'assets/scientist.png', {
		frameWidth: 64 , frameHeight: 64
	});

}

var num_cutters, cutters, num_trees, trees, poachers, poachertl=false, poachertr=false, poacherbl=false, poacherbr=false;;
var num_foxes,active_cutters,total_cutters ;
var num_bins ;
var waste_cnt;
var d = new Date()
var t = d.getTime()

gamescene.create = function(){
	//soundtracks
	let bgmusic = this.sound.add('jungle');
	bgmusic.play({
		volume: .3,
		loop: true
	})
    //set bg
    this.bg = this.add.image(0, 0, 'sand').setScale(4);
    sk = this.add.image(1170, 400, 'sky');
    sk.setDisplaySize(550,900);
    //create woodcutter
    num_cutters = 20;
    active_cutters = 0;
    total_cutters = 20;
    var a =50;
    cutters = []
    for (var i = 0; i < num_cutters; i++) {
    	var x = -20;
    	var y = a
    	a= a+25;
    	tempCutter = new Cutter(this.physics.add.sprite(x, y, 'cutter'), 200,0)
    	tempCutter.cutSound = this.sound.add('woodcut')
    	cutters.push(tempCutter);
    }

    //create health bars



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

   
    //create trees
    bar = [];
    num_trees = 10
    trees = this.physics.add.staticGroup();
    for (var i = 0; i < num_trees; i++) {
    	var x = Phaser.Math.RND.between(100, CANVAS_W-100);
    	var y = Phaser.Math.RND.between(100, CANVAS_H-100);
    	trees.create(x, y, 'tree').setScale(0.8);
    	var tempBar=new HealthBar(this.add.image(x,y-50,'healthBar'));
    	bar.push(tempBar);
    }
   
    //create poachers
    num_poachers = 0
    poachers = []

    //create scientist
    scientist = new Scientist(this.physics.add.sprite(400, 300, 'scientist'));
    seperators = this.physics.add.staticGroup();
    seperators.create(900,230,'seperator').setScale(2).refreshBody();
    seperators.create(1390,230,'seperator').setScale(2).refreshBody();
    this.physics.add.collider(scientist.obj, seperators);

    ///GAME1 //////////////////////////////////////
    num_bins = 3;
    var a = 45;
    var b = 50;
    bins = [];      
    bins.push( new Bin(this.add.image(1000,600,'plasticBin').setScale(0.4),'plastic', 1000-b,1000+b,600-a,600+a));
    bins.push( new Bin(this.add.image(1160,600,'organicBin').setScale(0.4),'organic', 1160-b,1160+b,600-a,600+a));
    bins.push( new Bin(this.add.image(1295,600,'paperBin').setScale(0.4),'paper',1295-b,1295+b,600-a,600+a));


    waste = [] ;
    num_wastes = 8 ;

    temp=new Waste(this.add.image(1000,150,'paperball').setScale(0.1),'paper');
    waste.push(temp);
    temp=new Waste(this.add.image(1100,150,'bottle1').setScale(0.15),'plastic');
    waste.push(temp);
    temp=new Waste(this.add.image(1300,150,'bottle2').setScale(0.15),'plastic');
    waste.push(temp);
    temp=new Waste(this.add.image(1200,150,'banana').setScale(0.1),'organic');
    waste.push(temp);
    temp=new Waste(this.add.image(1000, 250,'polythene').setScale(0.2),'plastic');
    waste.push(temp);
    temp=new Waste(this.add.image(1100, 250,'cardboard').setScale(0.3),'paper');
    waste.push(temp);
    temp=new Waste(this.add.image(1200, 250,'apple').setScale(0.05),'organic');
    waste.push(temp);
    temp=new Waste(this.add.image(1300, 250,'organic').setScale(0.15),'organic');
    waste.push(temp);

    timer=new Timer(this.add.image(1146,50,'healthBar'));
    timer.obj.scaleX= 5;

    for(var i = 0; i < num_wastes; i++){
    	waste[i].obj.visible = 0;
    	if(i<num_bins)
    		bins[i].obj.visible = 0;
    }                                                           
    timer.obj.visible = 0;
    /////////////////////////////////////////////////////

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
    	frames: this.anims.generateFrameNumbers('poacher', {start: 235, end: 235}),
    	frameRate: 10,
    	repeat: -1
    })
    this.anims.create({
    	key: 'poachershootup',
    	frames: this.anims.generateFrameNumbers('poacher', {start: 208, end: 220}),
    	frameRate: 10,
    	repeat: -1
    })
    this.anims.create({
    	key: 'poachershootdown',
    	frames: this.anims.generateFrameNumbers('poacher', {start: 234, end: 246}),
    	frameRate: 10,
    	repeat: -1
    })
    this.anims.create({
    	key: 'poachershootright',
    	frames: this.anims.generateFrameNumbers('poacher', {start: 247, end: 259}),
    	frameRate: 10,
    	repeat: -1
    })
    this.anims.create({
    	key: 'poachershootleft',
    	frames: this.anims.generateFrameNumbers('poacher', {start: 221, end: 233}),
    	frameRate: 10,
        // repeat: -1
    })

    this.anims.create({
    	key: 'scientistup',
    	frames: this.anims.generateFrameNumbers('scientist', {start: 13, end: 16}),
    	frameRate: 10,
    	repeat: -1
    })
    this.anims.create({
    	key: 'scientistdown',
    	frames: this.anims.generateFrameNumbers('scientist', {start: 0, end: 3}),
    	frameRate: 10,
    	repeat: -1
    })
    this.anims.create({
    	key: 'scientistleft',
    	frames: this.anims.generateFrameNumbers('scientist', {start: 4, end: 7}),
    	frameRate: 10,
    	repeat: -1
    })
    this.anims.create({
    	key: 'scientistright',
    	frames: this.anims.generateFrameNumbers('scientist', {start: 8, end: 11}),
    	frameRate: 10,
    	repeat: -1
    })
    this.anims.create({
    	key: 'scientistturn',
    	frames: this.anims.generateFrameNumbers('scientist', {start: 0, end: 0}),
    	frameRate: 10,
    	repeat: -1
    })

    cursors = this.input.keyboard.createCursorKeys();

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

function killPoacher(poacher){
	if(poacher.type == 1)
		poachertl = false
	else if(poacher.type == 2)
		poacherbl = false
	else if(poacher.type == 3)
		poacherbr = false
	else
		poachertr = false

	poacher.die()
	for(var i = 0; i < num_poachers; i++){
		if(poachers[i] == poacher){
			poachers.splice(i, 1)
			break
		}
	}
	num_poachers -= 1
	// d = new Date
	// t = d.getTime()
}

var pre = d.getTime();
gamescene.update = function(){


    //scientist movements/////////////////
    if (cursors.left.isDown)
    {
    	scientist.obj.setVelocityX(-330);
    	scientist.obj.setVelocityY(0);
    	scientist.obj.anims.play('scientistleft', true);
    }
    else if (cursors.right.isDown)
    {
    	scientist.obj.setVelocityX(330);
    	scientist.obj.setVelocityY(0);
    	scientist.obj.anims.play('scientistright', true);
    }
    else if (cursors.up.isDown)
    {
    	scientist.obj.setVelocityY(-330);
    	scientist.obj.setVelocityX(0);
    	scientist.obj.anims.play('scientistup', true);
    }
    else if (cursors.down.isDown)
    {
    	scientist.obj.setVelocityY(330);
    	scientist.obj.setVelocityX(0);
    	scientist.obj.anims.play('scientistdown', true);
    }
    else
    {
    	scientist.obj.setVelocityX(0);
    	scientist.obj.setVelocityY(0);
    	scientist.obj.anims.play('scientistturn');
    }
    /////////////////////////////////////////

    d = new Date()


    if(d.getTime() - t > 10000){
    	// console.log("check", t%100000, d.getTime()%100000)
    	t = d.getTime()
    	let arr = shuffle([1, 2, 3, 4])
    	for(var i = 0; i < 4; i++){
    		if(arr[i] == 1){
    			if(!poachertl){
    				var y = -100
    				var x = -100
    				var destx = 50
    				var desty = 50
    				tempPoacher = new Poacher(this.physics.add.sprite(x, y, 'poacher'), this.physics.add.sprite(x, y, 'crosshair'), 200, destx, desty, 1);
    				tempPoacher.shootSound = this.sound.add('arrow')
    				poachers.push(tempPoacher)
    				num_poachers += 1
    				poachertl = true
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
    				tempPoacher.shootSound = this.sound.add('arrow')
    				poachers.push(tempPoacher)
    				num_poachers += 1
    				poacherbl = true
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
    				tempPoacher.shootSound = this.sound.add('arrow')
    				poachers.push(tempPoacher)
    				num_poachers += 1
    				poacherbr = true
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
    				tempPoacher.shootSound = this.sound.add('arrow')
    				poachers.push(tempPoacher)
    				num_poachers += 1
    				poachertr = true
    				break;
    			}
    		}
    	}
    }
    for(var i = 0; i < num_poachers; i++){

    	if(poachers[i].shooting >= 0 && poachers[i].crosshair.alpha >= 1){
    		f = 0
    		for(let j = 0; j < num_foxes; j++){
    			if(findDis(poachers[i].crosshair, fox[j].obj) < poachers[i].blastRadius){
    				fox[j].hit()
    				f++;
    			}
    		}
    		if(f > 0){
    			poachers[i].shoot(1)
    		}
    		else{
    			poachers[i].shoot(0)
    		}
    	}

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
    		if(poachers[i].crosshair.alpha >= 0.9){
    			if(poachers[i].type == 1){
    				poachers[i].obj.anims.play('poachershootdown', true)
    			}
    			else if(poachers[i].type == 2){
    				poachers[i].obj.anims.play('poachershootright', true)
    			}
    			else if(poachers[i].type == 3){
    				poachers[i].obj.anims.play('poachershootup', true)
    			}
    			else if(poachers[i].type == 4){
    				poachers[i].obj.anims.play('poachershootleft', true)
    			}
    			poachers[i].shootSound.play({
    				volume: 0.8
    			})
    		}
    		else{
    			poachers[i].obj.anims.play('poacherstand', true)
    		}
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
    			{
    				cutters[i].setDest(destx, desty);
    			}   
    		}
    	}
    	// if(i>5)
    		// console.log(i,destx,desty);
    	if(cutters[i].active == 1)
    		cutters[i].move()       


    	if(cutters[i].obj.body.velocity.x > 0){
    		console.log(i,cutters[i].obj.body.velocity.x);
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
        							cutters[j].stopCutting()
        						}
        					}
        					rem = a;
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
    		}
    	}

    	if(fox[i].cutter != -1)
    	{
    		var id =fox[i].cutter;
    		var dx=(cutters[id].obj.x-fox[i].obj.x);
    		var dy=(cutters[id].obj.y-fox[i].obj.y);
    		var d = (dx*dx+dy*dy);
    		if(d < 8000)
    		{
    			cutters[id].reduce();
    			if(cutters[id].health==0)
    			{
    				fox[i].cutter = -1;
    				collider_tree_cutter[id].destroy;
    				cutters[id].setDest(20, 650);
    				// cutters[id].obj.setTint(0x0000ff);
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
    //scientist poacher interaction
    // console.log(scientist.inGame);
    if(scientist.inGame == 0)
    {
    	for(var i =0 ;  i < num_poachers ; i++)
    	{
    		var dx=(poachers[i].obj.x-scientist.obj.x);
    		var dy=(poachers[i].obj.y-scientist.obj.y);
    		var d = (dx*dx+dy*dy);
    		if(d<4000)
    		{
    			scientist.obj.x = 1200;
    			scientist.obj.y = 450;
    			timer.start = 1;
    			waste_cnt = 0;
    			for(var j =0 ; j < num_wastes ; j++)
    			{
    				waste[j].reset();
    			}
    			for(var j = 0; j <num_bins ;j++)
    			{
    				bins[j].reset();
    			}
    			timer.reset();
    			scientist.setOpp(poachers[i])
    			scientist.inGame = 1;
    		}        
    	}
    }


    if(scientist.inGame==1)
    {
        // GAME1 /////////////////////////////////////

        for (var i =0 ;i < num_wastes ; i++)
        {
        	if(waste[i].inBin == 0)
        	{
        		if(scientist.curWaste == -1)
        		{
        			var dx=(waste[i].obj.x-scientist.obj.x);
        			var dy=(waste[i].obj.y-scientist.obj.y);
        			var d = (dx*dx+dy*dy);     
        			if(d < 3000)
        			{
        				waste[i].isPicked  = 1;
        				scientist.curWaste = i;
        			}
        		}
        	}
        }
        if(scientist.curWaste != -1)
        {
        	id = scientist.curWaste;
        	waste[id].obj.x = scientist.obj.x;
        	waste[id].obj.y = scientist.obj.y-40;
        	x=waste[id].obj.x;
        	y=waste[id].obj.y;
        	for(var i = 0 ; i < num_bins ; i++)
        	{
        		if(scientist.curWaste != -1)
        		{
        			if(bins[i].check(x,y)==1)
        			{
        				// console.log(x,y);
        				if(waste[id].type==bins[i].type)
        				{
        					scientist.curWaste = -1;
        					waste[id].inBin = 1;
        					waste[id].isPicked = 0;
        					waste[id].obj.visible = false   ;
        					waste_cnt += 1;
        				}
        				else
        				{
        					scientist.curWaste = -1;
        					waste[id].inBin = 1;
        					waste[id].isPicked = 0;
        					waste[id].obj.visible = false   ;
        					waste_cnt += 1;
        					timer.bigreduce();
        				}
        			}
        		}
        	}
        }

        if(waste_cnt == num_wastes && timer.health > 0)
        {
        	waste_cnt = 0;
        	for(var i =0 ; i < num_wastes ;i++)
        	{
        		waste[i].hide();
        	}
        	for(var i=0; i< num_bins;i++)
        	{
        		bins[i].hide();
        	}
        	timer.hide();
        	scientist.reset(1);
        	killPoacher(scientist.opponent)
        }
        else if(timer.health <= 0){
        	waste_cnt = 0;
        	for(var i =0 ; i < num_wastes ;i++)
        	{
        		waste[i].hide();
        	}
        	for(var i=0; i< num_bins;i++)
        	{
        		bins[i].hide();
        	}
        	timer.hide();
        	scientist.reset(0);
        }
        if(timer.start == 1)
        {
        	timer.reduce();
        }
    }
    //////////////////////////////////////////////
    d = new Date()
    t = d.getTime();
    if(t-pre > 3000 && active_cutters < total_cutters)
    {
    	pre = t;
    	cutters[active_cutters].active = 1;
    	active_cutters=active_cutters + 1;
    }
}

homescreen.preload = function(){
	this.load.image('bg', 'assets/bg.jpg');
	this.load.image('button_arcade', 'assets/button_arcade.png');
	this.load.image('button_timeless', 'assets/button_timeless.png');
	this.load.image('button_title', 'assets/button_feral-retaliation.png');
}

homescreen.create = function(){

	this.bg = this.add.image(700, 325, 'bg').setScale(1.6);    
	this.title = this.add.image(700, 100, 'button_title');
	this.arcade_button = this.add.image(1300, 1300, 'button_arcade');
	this.timeless_button = this.add.image(-100, -100, 'button_timeless');    
	this.arcade_button.setInteractive({ useHandCursor: true });
	this.timeless_button.setInteractive({ useHandCursor: true });

	var tween = this.tweens.add({
		targets: this.arcade_button,
		x: 700,
		y: 320,
		duration: 3000,
		ease: "Elastic",
		easeParams: [1.5, 0.5],
	}, this);

	tween = this.tweens.add({
		targets: this.timeless_button,
		x: 700,
		y: 420,
		duration: 3000,
		ease: "Elastic",
		easeParams: [1.5, 0.5],
	}, this);

	this.arcade_button.on('pointerdown', () => {this.scene.start("gamescene");} );
	this.timeless_button.on('pointerdown', () => {this.scene.start("gamescene");} );
}

homescreen.update = function(){
}

introduction.preload = function(){
	this.load.plugin('DialogModalPlugin', './dialog_plugin.js');
	this.load.image('bg', 'assets/bg.jpg');
	this.load.image('button_title', 'assets/button_feral-retaliation.png');
	this.load.image('button_skip', 'assets/button_skip.png');
}

introduction.create = function(){
	this.bg = this.add.image(700, 325, 'bg').setScale(1.6);    
	this.title = this.add.image(700, 100, 'button_title');
	this.sys.install('DialogModalPlugin');
	this.skipButton = this.add.image(1300, 400, 'button_skip');
	this.skipButton.setInteractive({ useHandCursor: true });
	// this.skipButton.on('pointerdown', () => {this.scene.start("homescreen");} );	
}

game.scene.add('homescreen', homescreen);
game.scene.add('gamescene', gamescene);
game.scene.add('introduction', introduction);
// game.scene.start('homescreen');
// game.scene.start('introduction');
game.scene.start('gamescene');