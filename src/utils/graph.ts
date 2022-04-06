export class Graph {
  neighbors = {}; // Key = vertex, value = array of neighbors.

  addEdge(u, v) {
    if (this.neighbors[u] === undefined) {
      // Add the edge u -> v.
      this.neighbors[u] = [];
    }
    this.neighbors[u].push(v);
    if (this.neighbors[v] === undefined) {
      // Also add the edge v -> u in order
      this.neighbors[v] = []; // to implement an undirected graph.
    } // For a directed graph, delete
    this.neighbors[v].push(u); // these four lines.
  }
}

export function bfs(graph, source) {
  var queue = [{ vertex: source, count: 0 }],
    visited = { source: true },
    tail = 0;
  while (tail < queue.length) {
    var u = queue[tail].vertex,
      count = queue[tail++].count; // Pop a vertex off the queue.
    console.log('distance from ' + source + ' to ' + u + ': ' + count);
    graph.neighbors[u].forEach(function (v) {
      if (!visited[v]) {
        visited[v] = true;
        queue.push({ vertex: v, count: count + 1 });
      }
    });

    return queue;
  }
}

export function shortestPath(graph, source, target) {
  if (source == target) {
    // Delete these four lines if
    console.log(source); // you want to look for a cycle
    return; // when the source is equal to
  } // the target.
  var queue = [source],
    visited = { source: true },
    predecessor = {},
    tail = 0;
  while (tail < queue.length) {
    var u = queue[tail++], // Pop a vertex off the queue.
      neighbors = graph.neighbors[u];
    for (var i = 0; i < neighbors.length; ++i) {
      var v = neighbors[i];
      if (visited[v]) {
        continue;
      }
      visited[v] = true;
      if (v === target) {
        // Check if the path is complete.
        var path = [v]; // If so, backtrack through the path.
        while (u !== source) {
          path.push(u);
          u = predecessor[u];
        }
        path.push(u);
        path.reverse();
        // console.log(path.join(' &rarr; '));
        return path;
      }
      predecessor[v] = u;
      queue.push(v);
    }
  }
  throw new Error('there is no path from ' + source + ' to ' + target);
}
