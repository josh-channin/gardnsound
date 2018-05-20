console.clear();


/*////////////////////////////////////////*/


var scene = new canvallax.Scene();

var mouse = {
  x: scene.width / 2,
  y: scene.height / 2
};

function updatePosition(e){
  mouse.x = (e.touches ? e.touches[0] : e ).clientX;
  mouse.y = (e.touches ? e.touches[0] : e ).clientY;
}

document.addEventListener('mousemove',updatePosition);
document.addEventListener('touchstart',updatePosition);
document.addEventListener('touchmove',updatePosition);


/*////////////////////////////////////////*/


var flyTextures = [
  canvallax.Image('images/birb/1.png'),
  canvallax.Image('images/birb/2.png'),
  canvallax.Image('images/birb/3.png'),
  canvallax.Image('images/birb/4.png'),
  canvallax.Image('images/birb/5.png') ];

var fly = canvallax.Group({ flying: true }),
    lastFlyX = 0, lastFlyY = 0;

fly.x = mouse.x;
fly.y = mouse.y;
fly.width = flyTextures[0].width;
fly.height = flyTextures[0].height;
fly.add(flyTextures);

var alt = 0,
    frame = 0;

// Change fly sprite every 5 frames.
fly.preRender = function(){
  if ( alt % 3 == 0 && this.flying ) {
    frame++;
    this[ frame % fly.length ].opacity = 0;
    this[ (frame + 1 ) % fly.length ].opacity = 1;
  }
  alt++;
}

scene.add(fly);

/*////////////////////////////////////////*/


var dotTextures = [
  // canvallax.Image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAQAAAAD+Fb1AAAAJElEQVQIW2NgEGBIZeBhAAJBhkkMsiAGF0MDgyqIwcygDJICACu4AiO0HesEAAAAAElFTkSuQmCC"),
  // canvallax.Image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAQAAAAD+Fb1AAAAJElEQVQIW2NgEGBIZeBhAAJBhkkMsiAGF0MDgyqIwcygDJICACu4AiO0HesEAAAAAElFTkSuQmCC"),
  // canvallax.Image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAQAAADIpIVQAAAAJklEQVR4AWMAAj4GfhDFyGDPYA1hBDO4QRgeDBYgBhODKoMYAwMAKJUB8c8x+7EAAAAASUVORK5CYII="),
  // canvallax.Image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAECAQAAADsOj3LAAAAJklEQVR4AWMAAk4GXQY2BjDwZMhjYAIxGBmaGEKBNJhpzSADYgAALeUCJr5cFEAAAAAASUVORK5CYII=")
];



var twoPI = Math.PI * 2;
var halfPI = Math.PI / 2;
var ninetyDeg = halfPI * 57.2958;

fly.speed = 0.2;
fly.velX = 0;
fly.velY = 0;
fly._x = fly.x;
fly._y = fly.y;
fly.offsetX = 0;
fly.offsetY = 0;
fly.orbitSpeed = 1;
fly.count = 0; //twoPI + halfPI;

// Adapted from http://www.somethinghitme.com/2013/11/13/snippets-i-always-forget-movement/
fly.move = function(x, y){
  //console.log(this)
  // get the target x and y
  this.targetX = x;
  this.targetY = y;

  // We need to get the distance this time around
  var tx = this.targetX - this._x,
      ty = this.targetY - this._y,
      dist = Math.sqrt(tx * tx + ty * ty);

  /*
    * Get the direction we are facing
    * I just use -tx and -ty here because we already calculated tx and ty
    * To get the proper x and y you need to subtract the targets x and y from
    * our objects x and y
    */
  var radians = Math.atan2(-ty,-tx),
      orbitX = 0,
      orbitY = 0;

  //lol wut
  if ( dist > 2 ){
    this.velX += Math.cos(radians) * this.speed;
    this.velY += Math.sin(radians) * this.speed;
  }

  // calc the point out in front of the ship
  this.px = this.x - this.width * Math.cos(radians);
  this.py = this.y - this.height * Math.sin(radians);

  // apply friction
  this.velX *= 0.98;
  this.velY *= 0.98;

  // apply velocities
  this._x -= this.velX;
  this._y -= this.velY;

  fly.count += 0.025;
  //
  // if ( fly.count > twoPI + halfPI ) {
  //   fly.count = halfPI;
  //   fly.offsetX = 0 + (Math.random() * 30);
  //   fly.offsetY = 0 + (Math.random() * 20);
  // }

//  fly.orbitSpeed = ease(fly.orbitSpeed, ( dist < 30 ? 1 : 0 ), 0.001);
//  orbitX = (Math.cos( fly.count ) * fly.offsetX) * fly.orbitSpeed;
//  orbitY = ((Math.sin( 2 * fly.count )/2) * fly.offsetY) * fly.orbitSpeed;

  this.x = this._x + orbitX;
  this.y = this._y + orbitY;
}


/*////////////////////////////////////////*/


var count = 0;
var lastFlyX = 0;
var lastFlyY = 0;
var offsetX = 0;
var offsetY = 0;

scene.preRender = function() {

  var distance;

  if ( fly.flying ) {
    // console.log(mouse.x + ',' + mouse.y)

    if(!1) {
    //  fly.move(150, 0);
    } else {

    fly.move(mouse.x, mouse.y);

    /*////////////////////////////////////////*/

    distance = getDistance(fly.x, fly.y, lastFlyX, lastFlyY);
    /*
    if ( dotTextures.length && distance > 13 ) {

      var rotation = getRotation(fly.x, fly.y, lastFlyX, lastFlyY) + ninetyDeg;

      lastFlyX = fly.x;
      lastFlyY = fly.y;

      var clone = dotTextures[
        Math.round( Math.random() * (dotTextures.length-1) ) ].clone({
          rotation: rotation,
          x: lastFlyX + 5,
          y: lastFlyY + 5
        });

      scene.add( clone );
      clone.to(2, { opacity: 0 },{
        onComplete: function(){
          scene.remove(clone);
        }
      });
    }
    */

  }

  distance = fly.flying && getDistance(fly.x, fly.y, mouse.x, mouse.y);
  // scene.canvas.style.cursor = ( distance && distance < 15 ? 'pointer' : null );
  }
}


/*////////////////////////////////////////*/


function ease(current,target,ease){ return current + ((target - current) * ( ease || 0.2 )); }

function fixedEase(current, target, speed) {
  speed = speed || 5;
  var xDistance = target.x - current.x;
  var yDistance = target.y - current.y;
  var radian = Math.atan2(yDistance, xDistance);

  current.x += Math.cos(radian) * speed;
  current.y += Math.sin(radian) * speed;
}

function thrustEase(current, target, thrust){
  var tx = target.x - current.x,
      ty = target.y - current.y,
      dist = Math.sqrt(tx*tx+ty*ty);

  return {
    x: (tx/dist)*thrust,
    y: (ty/dist)*thrust
  };
}

function getRotation(originalX, originalY, rotationX, rotationY){
  return Math.atan2(rotationY - originalY, rotationX - originalX) * 57.2958;
}

function getDistance(x1, y1, x2, y2){
  return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
}

/*////////////////////////////////////////*/


/*////////////////////////////////////////*/

// var fliesClicked = 0;
// var clicked = false,
//     speed = 0.5,
//     spread = 30;

/*
document.addEventListener('mousedown',function(e){
  var x = (e.touches ? e.touches[0] : e ).clientX,
      y = (e.touches ? e.touches[0] : e ).clientY,
      distance = getDistance(fly.x, fly.y, x, y);

  if ( !clicked && distance < 15 && fly.flying ) {
    fliesClicked++;
    fly.flying = false;

    fly.to(3, {
      y: scene.height * 2
    }, {
      ease: canvallax.ease.inQuad,
      onComplete: function(){
        fly._x = scene.width * Math.random(), //( Math.random() < 0.5 ? scene.width + 100 : -100 );
        fly._y = ( Math.random() < 0.5 ? scene.height + 100 : -100 );

        fly.flying = true; }
    });
  }

  if ( !clicked ) {
    clicked = true;

    setTimeout(function(){ clicked = false; }, 200);

    var clone = dotTextures[
      Math.round( Math.random() * (dotTextures.length-1) )
    ].clone({
      rotation: -45,
      x: x,
      y: y,
      scale: 3
    });

    clone.to(speed, {
      x: x + spread,
      y: y + spread,
      scale: 1,
      opacity: 0
    },{
      onComplete: function(){ scene.remove(this.target); },
      ease: 'outQuad'
    });
    scene.add(clone);

    var clone = dotTextures[
      Math.round( Math.random() * (dotTextures.length-1) )
    ].clone({
      rotation: 45,
      x: x,
      y: y,
      scale: 3
    });

    clone.to(speed, {
      x: x + spread,
      y: y - spread,
      scale: 1,
      opacity: 0
    },{
      onComplete: function(){ scene.remove(this.target); },
      ease: 'outQuad'
    });
    scene.add(clone);

    var clone = dotTextures[
      Math.round( Math.random() * (dotTextures.length-1) )
    ].clone({
      rotation: -45,
      x: x,
      y: y,
      scale: 3
    });

    clone.to(speed, {
      x: x - spread,
      y: y - spread,
      scale: 1,
      opacity: 0
    },{
      onComplete: function(){ scene.remove(this.target); },
      ease: 'outQuad'
    });
    scene.add(clone);

    var clone = dotTextures[
      Math.round( Math.random() * (dotTextures.length-1) )
    ].clone({
      rotation: 45,
      x: x,
      y: y,
      scale: 3
    });

    clone.to(speed, {
      x: x - spread,
      y: y + spread,
      scale: 1,
      opacity: 0
    },{
      onComplete: function(){ scene.remove(this.target); },
      ease: 'outQuad'
    });
    scene.add(clone);
  }
});

*/
