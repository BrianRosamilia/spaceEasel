CanvasEntities = new Mongo.Collection('CanvasEntities');

CanvasEntities.allow({
  update : function(ent, current, fields, delta) {
    if(delta.$set.x > 200){             //What is society without rules?  A simple server side rule
      delta.$set.x = 200
    }
    return true;
  },
  insert : function() { return true;},
  remove : function() { return true;}
});


// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {

    Meteor.publish('CanvasEntities', function(){
      return CanvasEntities.find();
    });

    //CanvasEntities.remove({});
    if(CanvasEntities.find().count() == 0){
      CanvasEntities.insert({x: 0, y: 0, src : "/meteor.png"})
    }
  });
}
