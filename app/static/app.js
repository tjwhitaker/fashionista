var frame = getComputedStyle(document.getElementById('frame'));
var canvas = document.getElementById('paint');
var ctx = canvas.getContext('2d');
var mouse = {x:0, y:0};

canvas.width = parseInt(frame.getPropertyValue('width'));
canvas.height = canvas.width / 2;

ctx.lineWidth = 5;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = '#000000';

canvas.addEventListener('mousemove', function(e) {
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
}, false);

canvas.addEventListener('mousedown', function(e) {
  ctx.beginPath();
  ctx.moveTo(mouse.x, mouse.y);

  canvas.addEventListener('mousemove', paint, false);
}, false);

canvas.addEventListener('mouseup', function() {
  canvas.removeEventListener('mousemove', paint, false);
}, false);

var paint = function() {
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
};
