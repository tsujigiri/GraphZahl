GraphZahl = function(id) {
  this.graphs = [];
  this.stacked = false;
  this.canvas = document.getElementById(id);
  this.context = this.canvas.getContext('2d');
  this.canvas_width = this.canvas.width;
  this.canvas_height = this.canvas.height;
};

GraphZahl.prototype.draw = function() {

  this.context.clearRect(0, 0, this.canvas_width, this.canvas_height);

  var tmp, x_min, x_max, y_min, y_max, data, x, y, coordinates;

  for(var i = 0, l = this.graphs.length; i < l; i++)
    this.graphs[i].data = this.graphs[i].data.sort(function(a,b) { a[0] - b[0] });

  if(this.stacked == true)
    this.graphs = this.stack(this.graphs);

  // sort the graph data and find the min and max values
  for(var i = 0, l = this.graphs.length; i < l; i++) {
    if(this.graphs[i].data.length == 0)
      continue;
    data = this.graphs[i].data = this.graphs[i].data.sort(function(a,b) { a[0] - b[0] });
    tmp = data[data.length-1][0];
    if(this.x_max == undefined || this.x_max < tmp)
      this.x_max = tmp;
    tmp = data[0][0];
    if(this.x_min == undefined || this.x_min > tmp)
      this.x_min = tmp;
    tmp = data.map(function(e) { return e[1] }).max();
    if(this.y_max == undefined || this.y_max < tmp)
      this.y_max = tmp;
    tmp = data.map(function(e) { return e[1] }).min();
    if(this.y_min == undefined || this.y_min > tmp)
      this.y_min = tmp;
  }

  this.x_span = this.x_max - this.x_min;
  this.y_span = this.y_max - this.y_min;


  // draw the graphs
  for(var j = this.graphs.length-1; j >= 0; j--) {
    if(this.graphs[j].data.length == 0)
      continue;

    if(this.graphs[j].fill_color) {
      this.context.beginPath();
      this.drawPath(this.graphs[j]);
      coordinates = this.scale([this.graphs[j].data[this.graphs[j].data.length-1][0], 0]);
      x = coordinates[0]; y = coordinates[1];
      this.context.lineTo(x,y);
      coordinates = this.scale([this.graphs[j].data[0][0], 0]);
      x = coordinates[0]; y = coordinates[1];
      this.context.lineTo(x,y);
      this.context.fillStyle = this.graphs[j].fill_color;
      this.context.fill();
    }

    if(this.graphs[j].line_color) {
      this.context.beginPath();
      this.drawPath(this.graphs[j]);
      this.context.strokeStyle = this.graphs[j].line_color;
      this.context.stroke();
    }
  }
};

// draw a path
GraphZahl.prototype.drawPath = function(graph) {
  var data = graph.data;
  var x, y;

  for(var i = 0, l = data.length; i < l; i++) {
    coordinates = this.scale(data[i]);
    x = coordinates[0]; y = coordinates[1];
    if(i == 0)
      this.context.moveTo(x,y);
    else
      this.context.lineTo(x,y);
  }
};

// map values to canvas dimensions
GraphZahl.prototype.scale = function(coordinates) {
  var x = coordinates[0], y = coordinates[1];
  return [
    ((x - this.x_min) * this.canvas_width) / this.x_span,
    this.canvas_height - ((y - this.y_min) * this.canvas_height) / this.y_span
  ];
};

// stack the graphs
GraphZahl.prototype.stack = function(graphs) {
  var upper_graph, lower_graph, x, y, k;
  var stacked_graphs = [graphs[0]];

  for(var i = 1, l = graphs.length; i < l; i++) {
    upper_graph = graphs[i].data;
    lower_graph = graphs[i-1].data;
    stacked_graphs.push(graphs[i]);
    stacked_graphs[stacked_graphs.length-1].data = [];
    for(var j = 0, l1 = upper_graph.length; j < l1; j++) {
      x = upper_graph[j][0];
      k = 0;
      while(true) {
        if(lower_graph.length <= j+k) {
          y = lower_graph[lower_graph.length-1][1] + upper_graph[j][1];
          break;
        } else if(j+k < 0) {
          y = lower_graph[0][1] + upper_graph[j][1];
          break;
        } else if(lower_graph[j+k] != undefined && x == lower_graph[j+k][0]) {
          y = lower_graph[j+k][1] + upper_graph[j][1];
          break;
        } else if(lower_graph[j+k+1] != undefined && x == lower_graph[j+k+1][0]) {
          y = lower_graph[j+k+1][1] + upper_graph[j][1];
        } else {
          if(x > lower_graph[j+k][0]) {
            if(x < lower_graph[j+k+1][0]) {
              y = (x - lower_graph[j+k][0]) * (lower_graph[j+k+1][1] - lower_graph[j+k][1]) / (lower_graph[j+k+1][0] - lower_graph[j+k][0]) + lower_graph[j+k][1] + upper_graph[j][1];
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
};


Array.prototype.max = function () {
  return Math.max.apply(Math, this);
};

Array.prototype.min = function () {
  return Math.min.apply(Math, this);
};


