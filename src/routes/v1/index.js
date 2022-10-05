const express = require('express');
const tokenRoute = require('./token.route');
const projectRoute = require('./project.route');
const userRoute = require('./user.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/token',
    route: tokenRoute,
  },
  {
    path: '/project',
    route: projectRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
];

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

module.exports = router;
