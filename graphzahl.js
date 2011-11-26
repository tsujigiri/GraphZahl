function drawGraph(graph_data) {

  var canvas = document.getElementById(graph_data.id);
  var context = canvas.getContext('2d');
  var canvas_width = canvas.getAttribute('width');
  var canvas_height = canvas.getAttribute('height');

  for(var j = 0; j < graph_data.graphs.length; j++) {

    var data = graph_data.graphs[j].data.sort(function(a,b) a[0] - b[0]);
    var data_length = data.length;

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

    context.beginPath();
    context.moveTo(xs.shift, ys.shift);

    for(var i = 0; i < data_length; i++) {
      var x = canvas_width - ((xs[i] - x_min) * canvas_width) / x_span;
      var y = ((ys[i] - y_min) * canvas_height) / y_span;
      context.lineTo(x, y);
    }

    if(graph_data.graphs[j].fill_color) {
      context.lineTo(0, canvas_height);
      context.lineTo(canvas_width, canvas_height);
      context.fillStyle = graph_data.graphs[j].fill_color;
      context.fill();
    }
    context.strokeStyle = graph_data.graphs[j].line_color;
    context.stroke();
  }
}

Array.prototype.max = function () {
  return Math.max.apply(Math, this);
};

Array.prototype.min = function () {
  return Math.min.apply(Math, this);
};

function stack(graphs) {
  var upper_graph, lower_graph, x, y, k;
  var stacked_graphs = [graphs[0]];

  for(var i = 1; i < graphs.length; i++) {
    upper_graph = graphs[i].data;
    lower_graph = graphs[i-1].data;
    stacked_graphs.push(graphs[i]);
    stacked_graphs[stacked_graphs.length-1].data = [];
    for(var j = 0; j < upper_graph.length; j++) {
      x = upper_graph[j][0];
      k = 0;
      while(true) {
        if(lower_graph.length <= j+k+1) {
          y = lower_graph[j][1] + upper_graph[j][1];
	  break;
	} else if(j+k < 0) {
	  y = lower_graph[j+k+1][1] + upper_graph[j][1];
	  break;
        } else {
	  if(x >= lower_graph[j+k][0]) {
            if(x <= lower_graph[j+k+1][0]) {
              lower_graph[j+k+1] - lower_graph[j+k];
              y = (lower_graph[j+k+1][1] - lower_graph[j+k][1]) * x / (lower_graph[j+k+1][1] - lower_graph[j+k][1]); // + upper_graph[j][1];
              break;
            } else {
              k++;
            }
          } else {
            k--;
          }
	}
      }
      stacked_graphs[i].data.push([x, y]);
    }
  }
  return stacked_graphs;
}

