var frame = getComputedStyle(document.getElementById('frame'));
var canvas = document.getElementById('paint');
var scaledCanvas = document.getElementById('scaled');
var predictionCanvas = document.getElementById('prediction-image');
var boundingBox = document.getElementById('overlay');
var ctx = canvas.getContext('2d');
var scaledCtx = scaledCanvas.getContext('2d');
var predictionCtx = predictionCanvas.getContext('2d');


var mouse = {x:0, y:0};

canvas.width = parseInt(frame.getPropertyValue('width'));
canvas.height = canvas.width / 2;

scaledCanvas.width = 280;
scaledCanvas.height = 280;

predictionCanvas.width = 28;
predictionCanvas.height = 28;

ctx.lineWidth = 20;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = '#000000';

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
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
};

var predict = function() {
  var data = getBoundedImageData();
  var scaledData = scaleImageData(data);

  predictionCtx.clearRect(0, 0, 28, 28);  
  predictionCtx.putImageData(scaledData, 0, 0);
  
  var preparedData = scaledData.data.filter(function(value, index) {
    return (index + 1) % 4 == 0;
  }); 

  var jsonData = JSON.stringify({'data': Array.from(preparedData)});
  var labelTargets = {
    '0': 'T-shirt',
    '1': 'Trouser',
    '2': 'Pullover',
    '3': 'Dress',
    '4': 'Coat',
    '5': 'Sandal',
    '6': 'Shirt',
    '7': 'Sneaker',
    '8': 'Bag',
    '9': 'Boots'
  };

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/predict', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          if(xhr.status == 200) {
              var obj = JSON.parse(xhr.responseText);
              var label = document.getElementById('prediction-label');  
              var scores = document.getElementById('prediction-scores');

              label.innerHTML = labelTargets[obj.label[0]];
              var scoreString = '';

              obj.scores[0].forEach(function(value, index) {
                scoreString = scoreString + labelTargets[index] + ": " + value + '<br>';    
              });

              scores.innerHTML = scoreString;
          }
      }
  };
  xhr.send(jsonData);
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
  ctx.scale(10, 10);
  return imageData;
};
