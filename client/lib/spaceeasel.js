window.browserId = new Meteor.Collection.ObjectID()._str;


//Reactive Text
function ReactiveText(){
    this.Text_constructor.apply(this, arguments);
    this.textDep = new Deps.Dependency;
}

var p = createjs.extend(ReactiveText, createjs.Text);

Object.defineProperty(ReactiveText.prototype, "rtext", {
    get: function() {
        this.textDep.depend();
        return this.text;
    },
    set: function(x){
        this.text = x;
        this.textDep.changed();
    }
});

this.ReactiveText = createjs.promote(ReactiveText, "Text");

//Reactive Bitmap
function ReactiveBitmap(){
    this.Bitmap_constructor.apply(this, arguments);
    this.rxDep = new Deps.Dependency;
    this.ryDep = new Deps.Dependency;
}
var d = createjs.extend(ReactiveBitmap, createjs.Bitmap);

Object.defineProperty(ReactiveBitmap.prototype, "rx", {
    get: function() {
        this.rxDep.depend();
        return this.x;
    },
    set: function(y){
        console.log('Canvas updated x to ' + y);
        update = true;
        this.x = y;

        this.rxDep.changed();
    }
});

Object.defineProperty(ReactiveBitmap.prototype, "ry", {
    get: function() {
        this.ryDep.depend();
        return this.y;
    },
    set: function(x){
        console.log('Canvas updated y to ' + x);
        update = true;
        this.y = x;

        this.ryDep.changed();
    }
});

this.ReactiveBitmap = createjs.promote(ReactiveBitmap, "Bitmap");

var regularUpdate = createjs.Stage.prototype.update;

createjs.Stage.prototype.update = function(){
    console.log('Stage Update');

    _.each(this.children,function(ent){
        if(!ent.ddpupdate && ent.networked) {
            ent.needsUpdate = false;
            CanvasEntities.update({_id: ent._id}, {
                $set: {x: ent.x, y: ent.y, browserId : browserId}
            });
        }

        ent.ddpupdate = false;
    });

    regularUpdate.call(this);
};