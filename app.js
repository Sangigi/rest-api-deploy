const express = require('express');
const movies = require('./schemas/movies.json');
const crypto = require('node:crypto');
const cors = require('cors');

const { validateMovie, updateMovie } = require('./movies.js');

const app = express();

const PORT = process.env.PORT ?? 1234;

app.use(express.json());
app.use(cors({
  origin: (origin,callback) =>{
    ACCEPTED_ORIGINS = [
      'http://localhost:1234',
      'http://localhost:3000',
      'http://localhost:8080',
      'https://movies.com',
    ]

    if(ACCEPTED_ORIGINS.includes(origin)){
      return callback(null,true);
    }

    if(!origin){
      return callback(null,true);
    }

    return callback(new Error("Error: Cors won't work here budy"));
  }
}))

app.get('/movies',(req,res)=>{
  const {genre} = req.query;
  if(genre){
    const genreMovie = movies.filter(movie => movie.genre.some(
      g => g.toLowerCase() === genre.toLowerCase()
    ));
    return res.json(genreMovie);
  }
  return res.status(400).json({message:'Genre Not Found'});
})

app.get('/movies',(req,res)=>{
  res.status(200).json(movies);
});

app.patch('/movies/:id',(req,res)=>{  
  const { id } = req.params;

  const indexMovie = movies.findIndex(movie => movie.id == id);

  if(indexMovie == -1){
    return res.status(404).json({message:'Movie Not Found'});
  }

  const result = updateMovie(req.body);

  const movieNew = {
    ...movies[indexMovie],
    ...result.data
  }

  movies[indexMovie] = movieNew;

  return res.status(200).json(movieNew);
  
});

app.delete('/movies/:id',(req,res)=>{
  const { id } = req.params;
  const indexMovie = movies.find(movie => movie.id == id);
  
  if(indexMovie == -1){
    res.status(404).json({message:'Movie not Found'})
  }

  movies.splice(indexMovie, 1);
  return res.json({message:'Movie Deleted'});
});


app.post('/movies',(req,res)=>{
  const result = validateMovie(req.body);

  if(!result.success){
    return res.status(400).json(result.error.issues);
  }

  const moviePush = {
    id: crypto.randomUUID(),
    ...result.data
  };

  movies.push(moviePush);

  return res.status(201).json(moviePush);
});

app.get('/movies/:id',(req,res)=>{
  const { id } = req.params;
  const idMovie = movies.find(movie => movie.id == id);
  if(idMovie){
    return res.status(200).json(idMovie);
  }
  return res.status(404).json({message:'Movie Not Found'});
})

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
});