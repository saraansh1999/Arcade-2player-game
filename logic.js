CANVAS_W = 800;
CANVAS_H = 600;

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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload(){
    this.load.image('sand', 'assets/sand.jpg');
    this.load.image('tree', 'assets/treenew.png');
    // this.load.image('cutter', 'assets/cutter.png');
    this.load.image('healthBar', 'assets/lifebar.png');
    this.load.spritesheet('cutter', 'assets/cutter_sprites.png', 
        {frameWidth: 64, frameHeight: 64}
        );

}

var num_cutters, cutters, num_trees, trees;

function create(){
    //set bg
    this.bg = this.add.image(0, 0, 'sand').setScale(4);

    //create woodcutter
    num_cutters = 1
    cutters = []
    for (var i = 0; i < num_cutters; i++) {
        var x = Phaser.Math.RND.between(100, CANVAS_W-100);
        var y = Phaser.Math.RND.between(100, CANVAS_H-100);
        tempCutter = new Cutter(this.physics.add.sprite(x, y, 'cutter'), 200)
        cutters.push(tempCutter);
    }

    //create health bars
    bar = [];

    //create trees
    num_trees = 2 
    trees = this.physics.add.staticGroup();
    for (var i = 0; i < num_trees; i++) {
        var x = Phaser.Math.RND.between(100, CANVAS_W-100);
        var y = Phaser.Math.RND.between(100, CANVAS_H-100);
        trees.create(x, y, 'tree').setScale(0.8);
        var tempBar=new HealthBar(this.add.image(x,y-50,'healthBar'));
        bar.push(tempBar);
    }

    //animations
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



    //collisions
    for(let i = 0; i < num_cutters; i++){
        this.physics.add.collider(cutters[i].obj, trees, cuttree, null, this);
        function cuttree(cutterobj, tree)
        {
            cutters[i].stop()
            cutterobj.anims.stop()
            cutters[i].iscutting = true;
            cutters[i].startcutting()

        }
    }
}
function update(){
    for(var i = 0; i < num_cutters; i++)
    {
        if(cutters[i].obj.body.velocity.x == 0 && cutters[i].obj.body.velocity.y == 0){
            min = 100000
            trees.getChildren().forEach(function(tree){
                tempDis = findDis(tree, cutters[i].obj);
                if(tempDis < min){
                    min = tempDis;
                    destx = tree.x;
                    desty = tree.y;
                }
            }, this);
            cutters[i].setDest(destx, desty);
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
        // console.log(i);
        if(cutters[i].iscutting == 1)
        {
            var a = 0;
            trees.getChildren().forEach(function(tree)
            {
                if(cutters[i].destx == tree.x && cutters[i].desty == tree.y)                
                {
                    bar[a].reduce();
                }
                a = a + 1; 
            }, this);
        }
    }
}