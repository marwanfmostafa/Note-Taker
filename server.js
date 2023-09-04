const express = require('express');
const fs = require('fs');
const path = require('path');
const reviews = require('./db/db.json');
const uuid = require('./helpers/uuid');


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    const notes = res.json(reviews);
    return notes
});

app.post('/api/notes', (req, res) => {
  const {title, text} = req.body;
  const newNote = {
    title,
    text,
    id: uuid()
  }
  reviews.push(newNote);
  fs.writeFile('./db/db.json', JSON.stringify(reviews, 0, 4), (err) =>
      err ? console.log(err) : console.log('Successfully saved new note!')
    );
    const notes = res.json(reviews);
    return notes
  
})

app.delete(`/api/notes/:id`, (req, res) => {
  const id = req.params.id;
  for (let i = 0; i < reviews.length; i++) {
    if (reviews[i].id === id) {
      reviews.splice(i, 1);
    }
  }
  fs.writeFile('./db/db.json', JSON.stringify(reviews, 0, 4), (err) =>
      err ? console.log(err) : console.log('Successfully deleted note!')
    );
    const notes = res.json(reviews);
    return notes
})


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

