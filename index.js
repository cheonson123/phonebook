const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
const http = require("http");
const generateId = () => {
  const maxId = Math.floor(Math.random() * 1000) + 1;
  return maxId + 1;
};

let persons = [
  {
    id: 1,
    name: "Alex",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Bob",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Candy",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Daniel",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.get("/api/info", (request, response) => {
  info = {
    total: persons.length,
    date: new Date(),
  };
  response.send(
    `Phonebook has info for ${info.total} people <br> ${info.date}`
  );
});
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((persons) => persons.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
// POST
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }
  if (persons.some((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
