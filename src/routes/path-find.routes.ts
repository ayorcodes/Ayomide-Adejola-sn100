import e, { Router } from 'express';
import { body } from 'express-validator';
import { EPoint, PathList } from 'src/types/path-find.types';
import { drone } from 'src/utils/constants';
import { getPaths } from 'src/utils/path-find.helpers';
import { validate } from 'src/utils/validation';
import { bfs, Graph, shortestPath as SP } from '../utils/graph';

const router = Router();

router.get('/', (req, res) => {
  res.send(
    `After figuring out the correct landing zone, ${drone} needs to figure out the shortest path to get there.

It is guided by satellite S1, telling it the different paths it can take to the landing zone and the distance between each.

Currently, the API doesn't finish and overloads the server. We're cheap, so we don't want to allocate bigger resources for this.

So your task is to update the API to correctly return the shortest path between the starting and ending coordinates provided.

The API accepts a start and end value, with both being values that represent a valid point on the map (A, B, C,... F).
It should then return the shortest path between the start and end points in the form of an array that represents the order of the path that ${drone} should take and the total distance.`,
  );
});

router.post(
  '/',
  validate(
    body(['start', 'end'], 'Not a valid point').isIn(Object.values(EPoint)),
  ),
  async (req, res) => {
    const { start, end } = req.body;
    const paths = await getPaths();
    try {
      const path = findShortestPath(paths, start, end);
      res.status(200).send(path);
    } catch (error: any) {
      res.status(400).send({
        message: error.message,
      });
    }
  },
);

const findShortestPath = (
  paths: PathList,
  startNode: string,
  endNode: string,
) => {
  var graph = new Graph();

  for (const x of Object.keys(paths)) {
    for (const y in paths[x]) {
      graph.addEdge(x, y);
    }
  }

  const shortestPath = SP(graph, startNode, endNode);

  const results = {
    distances: graph.neighbors[endNode],
    path: shortestPath,
  };

  return results;
};

export default router;
