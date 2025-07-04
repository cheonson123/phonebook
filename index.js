require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

// 错误处理的中间件
const errorHandler = (error, request, response) => {
  console.error(error.message);
  console.error(error.name);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  response.status(500).send({ error: "Something went wrong!" });
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// GET all persons
app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error)); // 传递错误到中间件
});

// GET info about persons
app.get("/api/info", (request, response, next) => {
  Person.countDocuments()
    .then((count) => {
      const info = {
        total: count,
        date: new Date(),
      };
      response.send(
        `Phonebook has info for ${info.total} people <br> ${info.date}`
      );
    })
    .catch((error) => next(error)); // 传递错误到中间件
});

// GET person by ID
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error)); // 传递错误到中间件
});

// POST a new person or update existing person
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  // 查找是否存在同名联系人
  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        // 如果存在，更新号码
        existingPerson.number = body.number;
        return existingPerson.save(); // 保存更新后的联系人
      } else {
        // 如果不存在，创建新联系人
        const person = new Person({
          name: body.name,
          number: body.number,
        });
        return person.save(); // 保存新联系人
      }
    })
    .then((result) => {
      console.log(
        `added/updated ${result.name} number ${result.number} in phonebook`
      );
      response.status(201).json(result); // 返回创建或更新的联系人
    })
    .catch((error) => next(error)); // 传递错误到中间件
});

// DELETE a person by ID
app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error)); // 传递错误到中间件
});

// 使用错误处理的中间件
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
