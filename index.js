const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(bodyParser.json());

// Helper function to read data from JSON file
const readData = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
};

// Helper function to write data to JSON file
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// GET all items
app.get('/items', (req, res) => {
  const data = readData();
  res.json(data);
});

// GET a single item by id
app.get('/items/:id', (req, res) => {
  const data = readData();
  const item = data.find((item) => item.id === parseInt(req.params.id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// POST a new item
app.post('/items', (req, res) => {
  const data = readData();
  const newItem = {
    id: data.length ? data[data.length - 1].id + 1 : 1,
    ...req.body,
  };
  data.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// PUT to update an item by id
app.put('/items/:id', (req, res) => {
  const data = readData();
  const index = data.findIndex((item) => item.id === parseInt(req.params.id));
  if (index !== -1) {
    data[index] = { id: parseInt(req.params.id), ...req.body };
    writeData(data);
    res.json(data[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// DELETE an item by id
app.delete('/items/:id', (req, res) => {
  const data = readData();
  const newData = data.filter((item) => item.id !== parseInt(req.params.id));
  if (data.length === newData.length) {
    res.status(404).json({ message: 'Item not found' });
  } else {
    writeData(newData);
    res.status(204).end();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
