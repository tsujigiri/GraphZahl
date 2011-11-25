function drawGraph(graph) {

  var canvas = document.getElementById(graph.id);
  var context = canvas.getContext('2d');
  var canvas_width = canvas.getAttribute('width');
  var canvas_height = canvas.getAttribute('height');

  var data = graph.data.sort(function(a,b) a[0] - b[0]);
  var data_length = graph.data.length;

  var xs = [];
  var ys = [];
  for(var i = 0; i < data_length; i++) {
    xs.push(data[i][0]);
    ys.push(data[i][1]);
  }
  var x_max = xs.max();
  var x_min = xs.min();
  var y_max = ys.max();
  var y_min = ys.min();

  x_span = x_max - x_min;
  y_span = y_max - y_min;

  context.strokeStyle = graph.line_color;
  context.fillStyle = graph.fill_color;

  context.beginPath();  
  context.moveTo(xs.shift, ys.shift);

  for(var i = 0; i < data_length; i++) {
    var x = canvas_width - ((xs[i] - x_min) * canvas_width) / x_span;
    var y = ((ys[i] - y_min) * canvas_height) / y_span;
    context.lineTo(x, y);
  }

  if(graph.fill_color) {
    context.lineTo(0, canvas_height);
    context.lineTo(canvas_width, canvas_height);
    context.fill();
  }
  context.stroke();
}

Array.prototype.max = function () {
  return Math.max.apply(Math, this);
};

Array.prototype.min = function () {
  return Math.min.apply(Math, this);
};


