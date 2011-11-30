describe("GraphZahl", function() {
  var player;
  var song;

  beforeEach(function() {

  });

  it("should stack graphs", function() {
    var graphs = [{ data: [[1,1],[2,3],[3,2]] },
                  { data: [[1,1],[2,0],[3,2]] }];
    var stacked_graphs = stack(graphs);
    expect(stacked_graphs).toEqual(
      [{ data: [[1,1],[2,3],[3,2]] },
       { data: [[1,2],[2,3],[3,4]] }]);
  });

  it("should stack graphs with unequal x values", function() {
    var graphs = [{ data: [     [1,1],  [2,3],  [3,2]     ] },
                  { data: [[0.5,1],[1.5,0],[2.5,2],[3.5,1]] }];
    var stacked_graphs = stack(graphs);
    expect(stacked_graphs).toEqual(
      [{ data: [     [1,1],  [2,3],    [3,2]     ] },
       { data: [[0.5,2],[1.5,2],[2.5,4.5],[3.5,3]] }]);

  });
});
