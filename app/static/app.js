var frame = getComputedStyle(document.getElementById('frame'));
var canvas = document.getElementById('paint');
var scaledCanvas = document.getElementById('scaled');
var boundingBox = document.getElementById('overlay');
var ctx = canvas.getContext('2d');
var scaledCtx = scaledCanvas.getContext('2d');

var mouse = {x:0, y:0};

canvas.width = parseInt(frame.getPropertyValue('width'));
canvas.height = canvas.width / 2;

scaledCanvas.width = 280;
scaledCanvas.height = 280;

canvas.addEventListener('mousemove', function(e) {
  mouse.x = e.pageX - this.parentElement.offsetLeft;
  mouse.y = e.pageY - this.parentElement.offsetTop;
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
  ctx.fillRect(mouse.x - 10, mouse.y - 10, 20, 20);
};

var predict = function() {
  var data = getBoundedImageData();
  var scaledData = scaleImageData(data);
  console.log(scaledData);
};

var getBoundedImageData = function() {
  return ctx.getImageData(boundingBox.offsetLeft, 
                          boundingBox.offsetTop,
                          boundingBox.offsetWidth,
                          boundingBox.offsetHeight);
};

var scaleImageData = function(data) {
  scaledCtx.putImageData(data, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(0.1, 0.1);
  ctx.drawImage(scaledCanvas, 0, 0);
  imageData = ctx.getImageData(0, 0, 28, 28);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return imageData;
};
