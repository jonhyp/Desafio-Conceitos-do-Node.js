const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;
  const project = {
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes : 0
  }
  repositories.push(project);
  return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const findProjectIndex = repositories.findIndex(project => project.id === id);
  if(findProjectIndex < 0){
    return response.status(400).json({error: "project not found"});
  }
  const likes = repositories[findProjectIndex].likes
  const project = {
    id, 
    title, 
    url, 
    techs,
    likes
  };
  repositories[findProjectIndex] = project;
  return response.json(project);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const findProjectIndex = repositories.findIndex(project => project.id === id);
  if(findProjectIndex < 0){
    return response.status(400).json({error: "project not found"});
  }
  repositories.splice(findProjectIndex, 1)
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const findProjectIndex = repositories.findIndex(project => project.id === id);
  if(findProjectIndex < 0){
    return response.status(400).json({error: "project not found"});
  }

  const {title, url, techs, likes} = repositories[findProjectIndex]
  
  const increment = likes + 1;
  const project = {
    id, 
    title, 
    url, 
    techs,
    likes: increment
  };
  repositories[findProjectIndex] = project
  return response.json(project);
});

module.exports = app;
