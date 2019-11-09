CANVAS_W = 800;
CANVAS_H = 600;

var gamescene = new Phaser.Scene("gamescene");
var homescreen = new Phaser.Scene("homescreen");
var introduction1 = new Phaser.Scene("introduction1");
var introduction2 = new Phaser.Scene("introduction2");
var endscreen = new Phaser.Scene("endscreen");

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
	this.load.audio('explosion', 'assets/sounds/explosion.wav', {
		instances: 1
	});
	this.load.audio('wasteP', 'assets/sounds/waste_positive.mp3', {
		instances: 1
	});

	this.load.audio('wasteN', 'assets/sounds/waste_negative.mp3', {
		instances: 1
	});
	this.load.audio('win', 'assets/sounds/win.mp3', {
		instances: 1
	});
	this.load.audio('lose', 'assets/sounds/lose.mp3', {
		instances: 1
	});
	this.load.image('sand', 'assets/sand2.jpg');
	this.load.image('sky', 'assets/sky.png');
	this.load.image('tree', 'assets/treenew.png');
	this.load.image('healthBar', 'assets/lifebar.png');
	this.load.image('seperator', 'assets/seperator.png');
	this.load.image('seperator2', 'assets/seperator2.png');
	this.load.image('plasticBin', 'assets/plastic.png');
	this.load.image('organicBin', 'assets/organic.png');
	this.load.image('paperBin', 'assets/paper.png');
	this.load.image('polythene', 'assets/polythene.png');
	this.load.image('paperball', 'assets/paperwaste.png');
	this.load.image('bottle1', 'assets/bottle1.png');
	this.load.image('bottle2', 'assets/bottle2.png');
	this.load.image('bottle3', 'assets/bottle3.png');
	this.load.image('banana', 'assets/bananawaste.png');
	this.load.image('cardboard', 'assets/cardboard_waste.png');
	this.load.image('apple', 'assets/apple_waste.png');
	this.load.image('organic', 'assets/organic_waste.png');
	this.load.image('fruit1', 'assets/fruit1.png');
	this.load.image('notebook', 'assets/notebookwaste.png');
	this.load.image('paperroll', 'assets/paperroll.png');
	this.load.image('seg', 'assets/seg.png');
	
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
	this.load.spritesheet('explosion', 'assets/explosion.png', {
		frameWidth: 192 , frameHeight: 192
	});
	
}

var num_cutters, cutters, num_trees, trees, poachers, poachertl=false, poachertr=false, poacherbl=false, poacherbr=false;;
var num_foxes,active_cutters,total_cutters,tot_poachers=0, dead_cutters = 0 ;
var seg
var num_bins ;
var waste_cnt;
var cnt_active_wastes;
var active_wastes = []
var d = new Date()
var t = d.getTime()
var spaceBar
var explosion_sound, bgmusic, winSound, loseSound
var score = 0, scoreText

gamescene.create = function(){


	//soundtracks
	bgmusic = this.sound.add('jungle');
	bgmusic.play({
		volume: .2,
		loop: true
	})
	explosion_sound = this.sound.add('explosion')
	winSound = this.sound.add('win')
	loseSound = this.sound.add('lose')
	//set bg
	this.bg = this.add.image(0, 0, 'sand').setScale(4);
	sk = this.add.image(1170, 400, 'sky');
	sk.setDisplaySize(550,900);
	//create woodcutter
	num_cutters = 15;
	active_cutters = 0;
	total_cutters = 15;
	var a =50;
	cutters = [];
	for (var i = 0; i < num_cutters; i++) {
		var x, y;
		a= a+25;
		temp = Math.random()
		if(temp < 0.25){
			x = -100
			y = Phaser.Math.RND.between(100, CANVAS_H - 100)
		}
		else if(temp >= 0.25 && temp < 0.5){
			x = CANVAS_W + 100
			y = Phaser.Math.RND.between(100, CANVAS_H - 100)
		}
		else if(temp >= 0.5 && temp < 0.75){
			y = -100
			x = Phaser.Math.RND.between(100, CANVAS_W - 100)
		}
		else{
			y = CANVAS_H + 200
			x = Phaser.Math.RND.between(100, CANVAS_W - 100)
		}
		console.log(temp)
		tempCutter = new Cutter(this.physics.add.sprite(x, y, 'cutter').setSize(40, 60, 20, 30), 200,0)
		tempCutter.cutSound = this.sound.add('woodcut')
		cutters.push(tempCutter);
	}
	
	//create health bars
	num_foxes = 1;
	fox =  []; 
	// create fox
	foxhealth = new HealthBar(this.add.image(400,380,'healthBar'));
	foxhealth.obj.setTint(0xff0000);
	for (var i =0 ;i < num_foxes ; i++)
	{
		temp_fox = new Fox(this.physics.add.sprite(400, 400, 'fox'), 200);
		fox.push(temp_fox);
	}
	this.input.keyboard.on('keyup', function(event){
		if(event.key == "1")
			selectFox(fox[0]);
	}, this);
	
	
    //create trees
    bar = [];
    num_trees = 16
    trees = this.physics.add.staticGroup();
    a = 150
    b = 150
    for (var i = 0; i < num_trees; i++) {
    	var x = Phaser.Math.RND.between(a-50, a+50);
    	var y = Phaser.Math.RND.between(b-50, b+50);
        // console.log(i,a,x,y);
        trees.create(x, y, 'tree').setScale(0.8).setSize(72, 96, 36, 48);
        
        var tempBar=new HealthBar(this.add.image(x,y-50,'healthBar'));
        bar.push(tempBar);seg
        b = b+125;
        if(b == 650)
        {
        	b = 150;
        	a = a + 175;
        }
    }

    seg = this.add.image(1144, 450, 'seg').setScale(0.4)
    seg.visible = 0

	//explosion
	explosion = this.physics.add.sprite(-100, -100, 'explosion').setScale(0.6)

	//create poachers
	num_poachers = 0
	poachers = []

	//create scientist
	scientist = new Scientist(this.physics.add.sprite(400, 300, 'scientist'));
    //walls
    seperators = this.physics.add.staticGroup();
    seperators.create(900,230,'seperator').setScale(2).refreshBody();
    seperators.create(1390,230,'seperator').setScale(2).refreshBody();
    seperators.create(10,230,'seperator').setScale(2).refreshBody();
    seperators.create(200,-15,'seperator2').setScale(5).refreshBody();
    seperators.create(200,725,'seperator2').setScale(5).refreshBody();
    this.physics.add.collider(scientist.obj, seperators);
    this.physics.add.collider(fox[0].obj, seperators);


	///GAME1 //////////////////////////////////////
	wasteP_sound = this.sound.add('wasteP')
	wasteN_sound = this.sound.add('wasteN')
	

	num_bins = 3;
	var a = 45;
	var b = 50;
	bins = [];      
	bins.push( new Bin(this.add.image(1000,600,'plasticBin').setScale(0.4),'plastic', 1000-b,1000+b,600-a,600+a));
	bins.push( new Bin(this.add.image(1160,600,'organicBin').setScale(0.4),'organic', 1160-b,1160+b,600-a,600+a));
	bins.push( new Bin(this.add.image(1295,600,'paperBin').setScale(0.4),'paper',1295-b,1295+b,600-a,600+a));
	
	
	waste = [] ;
	num_wastes = 12 ;
	
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
	temp=new Waste(this.add.image(1200, 250,'apple').setScale(0.03),'organic');
	waste.push(temp);
	temp=new Waste(this.add.image(1300, 250,'organic').setScale(0.1),'organic');
	waste.push(temp);
	temp=new Waste(this.add.image(1000, 350,'fruit1').setScale(0.1),'organic');
	waste.push(temp);
	temp=new Waste(this.add.image(1100, 350,'paperroll').setScale(0.25),'paper');
	waste.push(temp);
	temp=new Waste(this.add.image(1200, 350,'notebook').setScale(0.07),'paper');
	waste.push(temp);
	temp=new Waste(this.add.image(1300, 350,'bottle3').setScale(0.15),'plastic');
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
	
	spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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
		key: 'foxattackup',
		frames: this.anims.generateFrameNumbers('fox1', {start: 41, end: 44}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'foxattackdown',
		frames: this.anims.generateFrameNumbers('fox1', {start: 45, end: 49}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'foxattackright',
		frames: this.anims.generateFrameNumbers('fox2', {start: 11, end: 14}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'foxattackleft',
		frames: this.anims.generateFrameNumbers('fox3', {start: 11, end: 14}),
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
	this.anims.create({
		key: 'explosion',
		frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 24}),
		frameRate: 10,
		repeat: 0
	})
	
	cursors = this.input.keyboard.createCursorKeys();
	
	collider_tree_pov = [];
	collider_cutter_pov = [];
	//collisions
	for(let i = 0; i < num_cutters; i++){
		x=this.physics.add.collider(cutters[i].obj, trees, cuttree, null, this);
		collider_tree_pov.push(x);

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
	//text
	scoreText = this.add.text(20, 20, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function funcFox(pointer){
	if(fox[0].selected){
		if(pointer.x >=50 && pointer.x <=860 &&pointer.y >= 50 &&pointer.y <= 700)
		{
			fox[0].moving = true;
			fox[0].selected = false;
			fox[0].destx = pointer.x;
			fox[0].desty = pointer.y;
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

function gameKhatam(scene, sound, victory=0){
	sound.play()
	if(victory == 1){
		score += num_trees * 200
	}
	scene.switch("endscreen")
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
	score += 500
	d = new Date
	t = d.getTime()
}

var pre = d.getTime();
gamescene.update = function(){
	
	scoreText.setText('Score: ' + score)

	//scientist movements/////////////////
	if(scientist.can_move){
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
	}
	/////////////////////////////////////////
	

	d = new Date()

	val = 10000;
	if(tot_poachers >= 4)
	{
		val =20000;
	}
	else if(tot_poachers == 0)
	{
		val = 0;
	}
	if(d.getTime() - t > val ){
		tot_poachers +=1 ;
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
					var y = CANVAS_H + 35
					var x = -100
					var destx = 50
					var desty = CANVAS_H + 35;
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
					var x = CANVAS_W + 160;
					var y = CANVAS_H + 160;
					var destx = CANVAS_W + 30;
					var desty = CANVAS_H + 35;
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
					var destx = CANVAS_W + 30 ;
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
					foxhealth.reduce(0.4);
					if(fox[j].health <= 0){
						bgmusic.stop()
						gameKhatam(this.scene, loseSound)
					}
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
				poachers[i].shootSound.play({
					volume: 0.3,
				})
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
	this.input.on('pointerup', funcFox, this);
	
	for(var i=0;i<num_foxes ;i++)
	{
		//attack of fox 
		if(fox[i].stand){
			if(fox[i].cutter==-1)
			{
				for(var j = 0 ; j < num_cutters ; j++)
				{
					var dx=(cutters[j].obj.x-fox[i].obj.x);
					var dy=(cutters[j].obj.y-fox[i].obj.y);
					var d = (dx*dx+dy*dy);
					if(d < 8000 && cutters[j].health > 0)
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
					if(Math.abs(fox[i].obj.x - cutters[id].obj.x) < Math.abs(fox[i].obj.y - cutters[id].obj.y)){
						if(fox[i].obj.y < cutters[id].obj.y){
							fox[i].obj.anims.play('foxattackup', true)
						}
						else{
							fox[i].obj.anims.play('foxattackdown', true)
						}
					}
					else{
						if(fox[i].obj.x < cutters[id].obj.x){
							fox[i].obj.anims.play('foxattackright', true)
						}
						else{
							fox[i].obj.anims.play('foxattackleft', true)
						}	
					}
					cutters[id].reduce();
					if(cutters[id].health==0)
					{
						score += 10
						fox[i].cutter = -1;
						// collider_tree_pov[id].destroy();
						this.physics.world.removeCollider(collider_tree_pov[id])
						cutters[id].setDest(-20, 650);
						// cutters[id].obj.setTint(0x0000ff);
						dead_cutters += 1
						if(dead_cutters == num_cutters){
							bgmusic.stop()
							gameKhatam(this.scene, winSound, 1)
						}
						cutters[id].unstopped = 1;
						cutters[id].cutfrom = 'no';
					}
				}
				else
				{
					fox[i].cutter = -1;
				}
			}
			else{
				fox[i].obj.anims.play('foxstand', true);
			}
		}


		fox[i].move();
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
		if(fox[i].selected == true){
			fox[i].obj.anims.play('selectedFox', true);	
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
		if(cutters[i].active == 1)
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
							if(num_trees == 0){
								bgmusic.stop()
								gameKhatam(this.scene, loseSound)
							}
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
	
	//scientist poacher interaction
	if(scientist.inGame == 0)
	{
		for(var i =0 ;  i < num_poachers ; i++)
		{
			var dx=(poachers[i].obj.x-scientist.obj.x);
			var dy=(poachers[i].obj.y-scientist.obj.y);
			var d = (dx*dx+dy*dy);
			if(d<4000)
			{
				seg.visible = 1
				scientist.obj.x = 980;
				scientist.obj.y = 500;
				timer.start = 1;
				waste_cnt = 0;
				num_active_wastes = 4;
				active_wastes = []
				for(var j = 0 ;j < num_active_wastes;j++)
				{
					x=Phaser.Math.RND.between(0,11);
					console.log(x);
					if(waste[x].obj.visible == 1)
					{
						j--;
						continue;
					}
					waste[x].reset();
					active_wastes.push(x);
				}
				
				// for(var j =0 ; j < num_wastes ; j++)
				// {
				// 	waste[j].reset();
				// }
				for(var j = 0; j <num_bins ;j++)
				{
					bins[j].reset();
				}
				timer.reset();
				scientist.setOpp(poachers[i])
				scientist.inGame = 1;
				scientist.obj.alpha = 0.1
			}        
		}
	}
	
	if(scientist.inGame==1)
	{
		scientist.teleport()
	}

	if(scientist.inGame == 2){
		
		// GAME1 /////////////////////////////////////
		for (var i =0 ;i < num_active_wastes ; i++)
		{
			if(waste[active_wastes[i]].inBin == 0)
			{
				if(scientist.curWaste == -1)
				{
					var dx=(waste[active_wastes[i]].obj.x-scientist.obj.x);
					var dy=(waste[active_wastes[i]].obj.y-scientist.obj.y);
					var d = (dx*dx+dy*dy);     
					if(d < 3000)
					{
						waste[active_wastes[i]].isPicked  = 1;
						scientist.curWaste = active_wastes[i];
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
						if(waste[id].type==bins[i].type)
						{
							wasteP_sound.play({
								volume: 0.8
							})
							scientist.curWaste = -1;
							waste[id].inBin = 1;
							waste[id].isPicked = 0;
							waste[id].obj.visible = false   ;
							waste_cnt += 1;
						}
						else
						{
							wasteN_sound.play({
								volume: 0.8
							})
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
		
		if(waste_cnt == num_active_wastes && timer.health > 0)
		{
			waste_cnt = 0;
			for(var i =0 ; i < num_active_wastes ;i++)
			{
				waste[active_wastes[i]].hide();
			}
			for(var i=0; i< num_bins;i++)
			{
				bins[i].hide();	
			}
			timer.hide();
			seg.visible = 0
			// scientist.reset(1);
			scientist.inGame = 3
		}
		else if(timer.health <= 0){
			waste_cnt = 0;
			for(var i =0 ; i < num_active_wastes ;i++)
			{
				waste[active_wastes[i]].hide();
			}
			for(var i=0; i< num_bins;i++)
			{
				bins[i].hide();
			}
			timer.hide();
			seg.visible = 0
			scientist.reset(0);
		}
		if(timer.start == 1)
		{
			timer.reduce();
		}
	}
	if(scientist.inGame == 3){
		scientist.obj.x = 1150;
		scientist.obj.y = 300 ;
		console.log(spaceBar)
		if(spaceBar.isDown){
			explosion_sound.play({
				volume: 0.8
			})
			explosion.body.x = scientist.opponent.obj.getCenter().x - explosion.body.width/2
			explosion.body.y = scientist.opponent.obj.getCenter().y - explosion.body.height/2
			explosion.anims.play('explosion', true)
			killPoacher(scientist.opponent)
			scientist.reset(1)
		}
	}
	//////////////////////////////////////////////
	d = new Date()
	nt = d.getTime();
	if(d.getTime()-pre > 3000 && active_cutters < total_cutters)
	{
		pre = nt;
		cutters[active_cutters].active = 1;
		cutters[active_cutters].obj.visible = 1
		active_cutters=active_cutters + 1;
	}
	
	foxhealth.obj.x = fox[0].obj.x;
	foxhealth.obj.y = fox[0].obj.y-20;
}

homescreen.preload = function(){
	this.load.image('instructions', 'assets/instructions1.png');
	this.load.image('bg', 'assets/bg.jpg');
	this.load.image('button_play', 'assets/button_play.png');
	this.load.image('button_title', 'assets/button_feral-retaliation.png');
	this.load.audio('jungle', 'assets/sounds/jungle.mp3', {
		instances: 1
	});
}

homescreen.create = function(){
	
	bgmusic = this.sound.add('jungle');
	bgmusic.play({
		volume: .2,
		loop: true
	})
	this.bg = this.add.image(700, 325, 'bg').setScale(1.6);    
	this.instructions = this.add.image(690, 530, 'instructions').setScale(0.6);
	this.title = this.add.image(1500, 100, 'button_title');
	this.play_button = this.add.image(1300, 1300, 'button_play');
	this.play_button.setInteractive(new Phaser.Geom.Rectangle(0, 0, 300, 200), Phaser.Geom.Rectangle.Contains);
	
	var tween = this.tweens.add({
		targets: this.play_button,
		x: 700,
		y: 320,
		duration: 5000,
		ease: "Elastic",
		easeParams: [1.5, 0.5],
	}, this);

	var tween = this.tweens.add({
		targets: this.title,
		x: 700,
		y: 100,
		duration: 5000,
		ease: "Elastic",
		easeParams: [1.5, 0.5],
	}, this);
	
	this.play_button.on('pointerdown', () => {this.scene.start("gamescene");} );
}

homescreen.update = function(){
}

introduction1.preload = function(){
	this.load.plugin('DialogModalPlugin', './dialog_plugin.js');
	this.load.image('bg', 'assets/lab.jpg')
	this.load.image('button_title', 'assets/button_feral-retaliation.png');
	this.load.image('button_next', 'assets/button_next.png');
	this.load.image('button_skip', 'assets/button_skip.png');
	this.load.image('invention', 'assets/invention.png');
	this.load.spritesheet('scientist', 'assets/scientist.png', {
		frameWidth: 64 , frameHeight: 64
	});
}

introduction1.create = function(){
	this.bg = this.add.image(700, 280, 'bg');
	this.title = this.add.image(700, 100, 'button_title');
	this.skipButton = this.add.image(1300, 400, 'button_skip');
	this.skipButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, 300, 200), Phaser.Geom.Rectangle.Contains).on('pointerdown', () => {this.scene.switch("homescreen");} );

	this.nextButton = this.add.image(1300, 470, 'button_next');
	this.nextButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, 300, 200), Phaser.Geom.Rectangle.Contains).on('pointerdown', () => {this.scene.switch("introduction2");} );	
	this.nextButton.visible = false;

	this.scientist = new Scientist(this.physics.add.sprite(400, 350, 'scientist'));
	this.scientist.obj.scaleX = 2;
	this.scientist.obj.scaleY = 2;
	this.invention = this.physics.add.sprite(1300, 100, 'invention').setScale(0.05);
	this.invention.setInteractive();
	this.invention.tint = 0xffff00;
	this.invention.on('pointerdown', startDrag, this);
	this.physics.add.collider(this.invention, this.scientist.obj, collideScientist, null, this);
	this.scFlag = 0;
	this.collided = 0;
	this.done = 0;
	this.tempCount = 0;

	this.sys.install('DialogModalPlugin');
	this.sys.dialogModal.init();
	this.sys.dialogModal.setText('Arrrgh!! The world as we know it is soon going to come to an end and here I am stuck on the same problem for my new invention since the past 5 years.\n All I need is to cross paths with one LightBulb moment and I\'ll change the world forever.', true);
	
	this.anims.create({
		key: 'scientistup',
		frames: this.anims.generateFrameNumbers('scientist', {start: 13, end: 16}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'scientistdown',
		frames: this.anims.generateFrameNumbers('scientist', {start: 0, end: 3}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'scientistleft',
		frames: this.anims.generateFrameNumbers('scientist', {start: 4, end: 7}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'scientistright',
		frames: this.anims.generateFrameNumbers('scientist', {start: 8, end: 11}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'scientistturn',
		frames: this.anims.generateFrameNumbers('scientist', {start: 0, end: 0}),
		frameRate: 10,
		repeat: -1
	});
}
function collideScientist(inv, sct){
	inv.destroy();
	this.collided = 1;
	sct.setVelocityX(0);
	sct.setVelocityY(0);
	sct.anims.play('scientistturn', true);
	sct.scaleX = 2.5;
	sct.scaleY = 2.5;
}
introduction1.update = function(){
	this.tempCount += 1;
	if(this.done == 0){
		if(this.tempCount > 100){
			this.invention.tint = Math.random() * 0xffffff;
			this.tempCount = 0;
		}
	}

	if(this.scFlag == 0 && this.collided == 0 && this.done == 0){
		this.scientist.obj.setVelocityX(300);
		this.scientist.obj.setVelocityY(0);
		this.scientist.obj.anims.play('scientistright', true);
		if(this.scientist.obj.x > 1000){
			this.scFlag = 1;
			this.scientist.obj.anims.play('scientistturn', true);	
		}
	}else if(this.scFlag == 1 && this.collided == 0 && this.done == 0){
		this.scientist.obj.setVelocityX(-300);
		this.scientist.obj.setVelocityY(0);
		this.scientist.obj.anims.play('scientistleft', true);
		if(this.scientist.obj.x < 400){
			this.scFlag = 0;
			this.scientist.obj.anims.play('scientistturn', true);	
		}
	}
	
	if(this.collided == 1){
		this.scientist.obj.setVelocityX(0);
		this.scientist.obj.setVelocityY(100);
		this.scientist.obj.anims.play('scientistdown', true);
		if(this.scientist.obj.y > 480){
			this.collided = 0;
			this.done = 1;
			this.scientist.obj.setVelocityY(0);
			this.scientist.obj.anims.pause();
		}
	}
	if(this.done == 1){
		this.sys.dialogModal.updateText("I have got it now. It was right infront of me all this time. \nWith the help of this Inter-Species Vocal Transmitter I can now communicate and join forces with our feral counterparts. \nLet's turn the tables around!!", true);
		this.done = 2;
	}
	if(this.done == 2){
		this.nextButton.visible = true;
	}
}

function startDrag(){
	this.input.off('pointerdown', startDrag, this);
	this.input.on('pointerup', stopDrag, this);
}

function stopDrag(pointer){
	this.input.on('pointerdown', startDrag, this);
	var tween = this.tweens.add({
		targets: this.invention,
		x: pointer.x,
		y: pointer.y,
		duration: 2000,
		ease: "Linear",
		easeParams: [0.5, 0.5],
		delay: 0
	}, this);
}



introduction2.preload = function(){
	this.load.plugin('DialogModalPlugin', './dialog_plugin.js');
	this.load.image('bg', 'assets/jungle.jpg');
	this.load.image('button_title', 'assets/button_feral-retaliation.png');
	this.load.image('animal_bear', 'assets/bear.png');
	this.load.image('animal_wolf', 'assets/animal_wolf.png');
	this.load.image('animal_elephant', 'assets/elephant.png');
	this.load.image('animal_monkey', 'assets/monkey.png');
	this.load.image('button_next', 'assets/button_next.png');
	this.load.spritesheet('scientist', 'assets/scientist.png', {
		frameWidth: 64 , frameHeight: 64
	});
	this.load.audio('jungle', 'assets/sounds/jungle.mp3', {
		instances: 1
	});
}

introduction2.create = function(){
	bgmusic = this.sound.add('jungle');
	bgmusic.play({
		volume: .2,
		loop: true
	})
	this.bg = this.add.image(700, 200, 'bg').setScale(2);
	this.bg.scaleX = 2.2;
	this.bg.scaleY = 2.4;
	this.scientist = new Scientist(this.physics.add.sprite(-100, 450, 'scientist'));
	this.scientist.obj.scaleX = 2;
	this.scientist.obj.scaleY = 2;
	this.title = this.add.image(700, 100, 'button_title');
	this.bear = this.add.image(900, 400, 'animal_bear').setScale(0.05);
	this.wolf = this.add.image(700, 400, 'animal_wolf').setScale(0.2);
	this.elephant = this.add.image(1200, 400, 'animal_elephant').setScale(0.2);
	this.monkey = this.add.image(1100, 450, 'animal_monkey').setScale(0.1);
	this.next = this.add.image(1300, 500, 'button_next');
	this.next.setInteractive(new Phaser.Geom.Rectangle(0, 0, 300, 200), Phaser.Geom.Rectangle.Contains).on('pointerdown', () => {this.scene.switch("homescreen");} );

	this.sys.install('DialogModalPlugin');
	this.sys.dialogModal.init();
	this.sys.dialogModal.setText('Bear: Grrrrrr!! What\'s this puny little human doing here?', true);
	this.counter = 1;
	this.tempCount = 0;
	this.anims.create({
		key: 'scientistup',
		frames: this.anims.generateFrameNumbers('scientist', {start: 13, end: 16}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'scientistdown',
		frames: this.anims.generateFrameNumbers('scientist', {start: 0, end: 3}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'scientistleft',
		frames: this.anims.generateFrameNumbers('scientist', {start: 4, end: 7}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'scientistright',
		frames: this.anims.generateFrameNumbers('scientist', {start: 8, end: 11}),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'scientistturn',
		frames: this.anims.generateFrameNumbers('scientist', {start: 0, end: 0}),
		frameRate: 10,
		repeat: -1
	});
	this.scientist.obj.anims.play('scientistright', true);
	var tween = this.tweens.add({
		targets: this.scientist.obj,
		x: 400,
		y: 450,
		duration: 2000,
		ease: "Linear",
		easeParams: [0.5, 0.5],
		delay: 0,
		onComplete: () => {
			this.scientist.obj.anims.pause();
		}
	}, this);
}

introduction2.update = function(){

	this.tempCount++;
	console.log(this.tempCount, this.counter);

	if(this.tempCount > (this.sys.dialogModal.dialog.length * 3)){
		if(this.counter == 1){
			this.sys.dialogModal.updateText('Scientist: Relax, I come in peace. I have a proposition that I would like to discuss with your leader.', true);
			this.counter = 2;
		}else
		if(this.counter == 2){
			this.sys.dialogModal.updateText('Monkey: Huh!! Why would we listen to anything you have to say? Your species is the reason we suffer all the time! You don\'t even realize that with each tree you cut, you\'re vandalising homes of hundreds.', true);
			this.counter = 3;
		}else
		if(this.counter == 3){
			this.sys.dialogModal.updateText('Elephant: You barge into our homes, and kill us for your petty needs. We don\'t want you here. Go away, or the repercussions will be severe.', true);
			this.counter = 4;
		}else
		if(this.counter == 4){
			this.sys.dialogModal.updateText('Scientist: Please! Just hear me out once. I am not a bad guy. I really am here to help. Please give me a chance.', true);
			this.counter = 5;
		}else
		if(this.counter == 5){
			this.sys.dialogModal.updateText('Wolf: Calm down everybody! Let us hear him out.', true);
			this.counter = 6;
		}else
		if(this.counter == 6){
			this.sys.dialogModal.updateText('Scientist: Thanks for the opportunity! Your leadership paired with my inventions and intellect can help us restore the order that\'s long been lost. Please trust me.', true);
			this.counter = 7;
		}else
		if(this.counter == 7){
			this.sys.dialogModal.updateText('Wolf: Okay, I\'m willing to work with you, but you\'ll have to earn our trust.', true);
			this.counter = 8;
		}else
		if(this.counter == 8){
			this.sys.dialogModal.updateText('Scientist: Let\'s begin!', true);
			this.counter = 9;
		}else
		if(this.counter == 9){
			this.scene.switch("homescreen");
		}
		
		this.tempCount = 0;
	}
}

endscreen.preload = function(){
	this.load.image('button_go', 'assets/button_game-over.png');
	this.load.image('button_replay', 'assets/button_replay.png');
}
endscreen.create = function(){
	this.score = this.add.text(625, 250, 'Score: '+score, { fontSize: '32px', fill: '#f4f3ff' });
	this.gameOver = this.add.image(700, 350, 'button_go');
	this.replay = this.add.image(700, 450, 'button_replay');
	this.replay.setInteractive();
	this.replay.on('pointerdown', () => {
		this.registry.destroy(); // destroy registry
		this.events.off(); // disable all active events
		// this.scene.switch("homescreen"); // restart current scene
		window.location.reload()

	});
}
endscreen.update = function(){
}
game.scene.add('homescreen', homescreen);
game.scene.add('gamescene', gamescene);
game.scene.add('introduction1', introduction1);
game.scene.add('introduction2', introduction2);
game.scene.add('endscreen', endscreen);
// game.scene.start('homescreen');
game.scene.start('introduction1');
// game.scene.start('gamescene');
// game.scene.start('endscreen');