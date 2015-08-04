var img;
var update = true;

var entity;
function init() {
    entity = CanvasEntities.find().fetch()[0];
    //wait for the image to load
    img = new Image();
    img.onload = handleImageLoad;
    img.src = entity.src;
}

function handleImageLoad() {
    //find canvas and load images, wait for last image to load
    var canvas = document.getElementById("screen");

    // create a new stage and point it at our canvas:
    window.stage = new createjs.Stage(canvas);
    createjs.Touch.enable(stage);

    // enabled mouse over / out events
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

    window.bmp = new ReactiveBitmap(img);

    window.text = new ReactiveText("Hello World", "20px Arial", "#ff7700");
    text.x = 100;
    stage.addChild(text);

    var removeRedFilter = new createjs.ColorFilter(0.25, 0.75, 1, 1); // red, green, blue, alpha
    bmp.filters = [removeRedFilter];
    bmp.cache(0, 0, img.width, img.height);
    bmp.x = entity.x;
    bmp.y = entity.y;
    bmp._id = entity._id;
    bmp.networked = true;

    bmp.on("pressmove", function (evt) {
        this.rx = evt.stageX;
        this.y = evt.stageY;
        // indicate that the stage should be updated on the next tick:
        update = true;
    });

    Deps.autorun(function(){
        text.rtext = bmp.rx; //Set reactive text
    });

    stage.addChild(bmp);

    function tick(event) {
        // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
        if (update || stage.serverUpdate) {
            stage.serverUpdate =update = false; // only update once
            stage.update(event);
        }
    }

    createjs.Ticker.addEventListener("tick", tick);
}

Meteor.subscribe('CanvasEntities', function onReady() {
    $(function() { init(); });

    CanvasEntities.find().observe({
        changed : function(doc){
            if(doc.browserId != browserId){
                bmp.rx = doc.x;
                bmp.ry = doc.y;
                bmp.ddpupdate = true;
                stage.serverUpdate = true;
            }
        }})
});