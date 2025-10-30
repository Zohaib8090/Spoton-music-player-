const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// In-memory data store for simplicity
const interactions = {};

app.get('/interactions/:songId', (req, res) => {
  const { songId } = req.params;
  const songInteractions = interactions[songId] || { likes: 0, dislikes: 0, comments: [] };
  res.json(songInteractions);
});

app.post('/interactions/:songId/like', (req, res) => {
  const { songId } = req.params;
  if (!interactions[songId]) {
    interactions[songId] = { likes: 0, dislikes: 0, comments: [] };
  }
  interactions[songId].likes++;
  res.json(interactions[songId]);
});

app.post('/interactions/:songId/dislike', (req, res) => {
  const { songId } = req.params;
  if (!interactions[songId]) {
    interactions[songId] = { likes: 0, dislikes: 0, comments: [] };
  }
  interactions[songId].dislikes++;
  res.json(interactions[songId]);
});

app.post('/interactions/:songId/comment', (req, res) => {
  const { songId } = req.params;
  const { comment } = req.body;
  if (!interactions[songId]) {
    interactions[songId] = { likes: 0, dislikes: 0, comments: [] };
  }
  interactions[songId].comments.push(comment);
  res.json(interactions[songId]);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
