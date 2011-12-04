describe("GraphZahl", function() {

  beforeEach(function() {
    var canvas = document.getElementById('graph');
    if(!canvas) {
      var canvas = document.createElement("canvas");
      canvas.id = 'graph';
      canvas.width = 200;
      canvas.height = 100;
      document.body.appendChild(canvas);
    }
  });

  it("should stack graphs", function() {
    var graph_zahl = new GraphZahl('graph');
    var graphs = [{ data: [[1,1],[2,3],[3,2]] },
                  { data: [[1,1],[2,0],[3,2]] }];
    var stacked_graphs = graph_zahl.stack(graphs);
    expect(stacked_graphs).toEqual(
      [{ data: [[1,1],[2,3],[3,2]] },
       { data: [[1,2],[2,3],[3,4]] }]);
  });

  it("should stack graphs with unequal x values", function() {
    var graph_zahl = new GraphZahl('graph');
    var graphs = [{ data: [     [1,1],  [2,3],  [3,2]     ] },
                  { data: [[0.5,1],[1.5,0],[2.5,2],[3.5,1]] }];
    var stacked_graphs = graph_zahl.stack(graphs);
    expect(stacked_graphs).toEqual(
      [{ data: [     [1,1],  [2,3],    [3,2]     ] },
       { data: [[0.5,2],[1.5,2],[2.5,4.5],[3.5,3]] }]);

  });

  it("should scale to the canvas dimensions", function() {
    var graph_zahl = new GraphZahl('graph');
    graph_zahl.x_min = 100;
    graph_zahl.x_max = 200;
    graph_zahl.y_min = 50;
    graph_zahl.y_max = 100;
    graph_zahl.x_span = graph_zahl.x_max - graph_zahl.x_min;
    graph_zahl.y_span = graph_zahl.y_max - graph_zahl.y_min;

    expect(graph_zahl.scale([125,90])).toEqual([50,20]);
  });

});
