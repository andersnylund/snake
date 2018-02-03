const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/', function requestHandler(request, response){
  response.sendFile(path.join(__dirname+'/snake.html'))
});

app.get('/snake.js', function requestHandler(request, response){
  response.sendFile(path.join(__dirname+'/snake.js'))
});

app.get('/style.css', function requestHandler(request, response){
  response.sendFile(path.join(__dirname+'/style.css'))
});

app.listen(PORT, () => console.log(`Listening on port ${ PORT }`))