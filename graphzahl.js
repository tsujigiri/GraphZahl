GraphZahl = function(id) {

  this.graphs = [];
  this.stacked = false;
  this.id = id;
  
  this.draw = function() {
  
    var x = 0;
    var y = 1;
  
    var canvas = document.getElementById(this.id);
    var context = canvas.getContext('2d');
    var canvas_width = canvas.getAttribute('width');
    var canvas_height = canvas.getAttribute('height');
  
    if(this.stacked == true)
      this.graphs = this.stack(this.graphs);
  
    var x_max, x_min, y_max, y_min, tmp, data, data_length, xs, ys, x0, y0;
  
    // find the min and max values for the graph dimensions
    for(var i = 0; i < this.graphs.length; i++) {
      data = this.graphs[i].data.sort(function(a,b) a[0] - b[0]);
      tmp = data[data.length-1][x];
      if(x_max == undefined || x_max < tmp)
        x_max = tmp;
      tmp = data[0][x];
      if(x_min == undefined || x_min > tmp)
        x_min = tmp;
      tmp = data.map(function(e) { return e[y] }).max();
      if(y_max == undefined || y_max < tmp)
        y_max = tmp;
      tmp = data.map(function(e) { return e[y] }).min();
      if(y_min == undefined || y_min > tmp)
        y_min = tmp;
    }
  
    var x_span = x_max - x_min;
    var y_span = y_max - y_min;
  
    // draw the graphs
    for(var j = 0; j < this.graphs.length; j++) {
  
      data = this.graphs[j].data;
      data_length = data.length;
  
      xs = [];
      ys = [];
      for(var i = 0; i < data_length; i++) {
        xs.push(data[i][x]);
        ys.push(data[i][y]);
      }
  
      context.beginPath();
      for(var i = 0; i < data_length; i++) {
        x0 = ((xs[i] - x_min) * canvas_width) / x_span;
        y0 = canvas_height - ((ys[i] - y_min) * canvas_height) / y_span;
        if(i == 0) {
          context.moveTo(x0,y0);
          var start_x = x0;
        } else {
          context.lineTo(x0, y0);
        }
      }
  
      context.strokeStyle = this.graphs[j].line_color;
      context.stroke();
  
      if(this.graphs[j].fill_color) {
        context.lineTo(x0, canvas_height);
        context.lineTo(start_x, canvas_height);
        context.fillStyle = this.graphs[j].fill_color;
        context.fill();
        context.strokeStyle = this.graphs[j].fill_color;
        context.stroke();
      }
    }
  }
  
  
  this.stack = function(graphs) {
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
  }

}

Array.prototype.max = function () {
  return Math.max.apply(Math, this);
};

Array.prototype.min = function () {
  return Math.min.apply(Math, this);
};


