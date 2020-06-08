var record_animation = false;
var name = "image_"
var total_frames = 200;
var frame = 0;
var loop = 0;
var total_time = 4*Math.PI;
var rate = total_time/total_frames;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


var t = 0;
//var rate = .02;

var r_scale = 1;
var f_scale = 0.5;

var get_mouse_pos = false;
var get_touch_pos = false;

var fps, fpsInterval, startTime, now, then, elapsed;


startAnimating(30);


function draw() {
  
    
    ctx.fillStyle = 'rgba(0,0,0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let columns = 26;
    let rows = columns;
    let radius = canvas.width/columns;

    let R = radius/r_scale;
    let f = f_scale*(1 + 0.05*Math.cos(t/2));
 
    for (let j = 1; j < columns -1; j++) {
        for (let i = 1; i < rows - 1; i++) {
            
            let hue = ((i+j)/(columns+rows))*Math.cos(t/2)*30 + 210;
            disk(ctx, `hsla(${hue},100%,60%,0.5)`, 0.25*radius, radius*(j+0.5) + R*Math.cos(t + f*i), radius*(i+0.5) + R*Math.sin(t + f*j));
        }
    }
 
    //t += rate;
        
}

function disk(ctx, color, radius, x_pos, y_pos) {

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x_pos, y_pos, radius, radius, 0, 0, 2*Math.PI);
    ctx.fill();

}

function startAnimating(fps) {
    
   fpsInterval = 1000 / fps;
   then = window.performance.now();
   startTime = then;
   
   animate();
}

function animate(newtime) {

  requestAnimationFrame(animate);

  now = newtime;
  elapsed = now - then;

  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    draw();
    
    frame = (frame+1)%total_frames;
    time = rate*frame;
    t = time;

    if(record_animation) {

        if (loop === 1) { 
        let frame_number = frame.toString().padStart(total_frames.toString().length, '0');
        let filename = name+frame_number+'.png'
            
        dataURL = canvas.toDataURL();
        var element = document.createElement('a');
        element.setAttribute('href', dataURL);
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        }

        if (frame + 1 === total_frames) {
            loop += 1;
        }

        if (loop === 2) { stop_animation = true }
    }
  }
  
  canvas.addEventListener('mousedown', e => {
    get_mouse_pos = true;
    getMousePosition(canvas, e)
  });

  canvas.addEventListener('mouseup', e => {
    get_mouse_pos = false;
  });

  canvas.addEventListener('mousemove', function(e) {
    if(get_mouse_pos) {
      getMousePosition(canvas, e)
    }
  })

  canvas.addEventListener('touchstart', function(e) {
    getTouchPosition(canvas,e);
    event.preventDefault();
  }, false);

  canvas.addEventListener('touchend', function(e) {

  }, false);

  canvas.addEventListener('touchmove', function(e) {
    getTouchPosition(canvas,e);
    event.preventDefault();
  }, false);
}

function getMousePosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    r_scale = 3  - 2*(event.clientX - rect.left)/(canvas.width);
    f_scale = 0  + Math.PI*(event.clientY - rect.top)/(canvas.height);  
}

function getTouchPosition(canvas, event) {
    var touch = event.touches[0];
    const rect = canvas.getBoundingClientRect()
    r_scale = 3  - 2*(touch.clientX - rect.left)/(canvas.width);
    f_scale = 0  + Math.PI*(touch.clientY - rect.top)/(canvas.height);   
}