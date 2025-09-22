require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require('./models/person')
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("dist"))
// Token personalizado para mostrar el body en POST
morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

// Configura morgan para usar el nuevo token
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);




app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    console.log("persons", persons)
     response.json(persons)
  })

})

app.get("/info", (request, response) => {
  const date = new Date();
  Person.find({}).then(persons => {
    console.log("persons", persons)
    const info = `Phonebook has info for ${persons.length} people<br>${date}`
    response.send(info);
  }
  )
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
 Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
})



app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  Person.findById(id)
  .then(person => {
    console.log("person to delete", person);

  })
  .catch(error => {
    console.log("error", error);
    response.status(400).send({ error: 'malformatted id' })
  }
  )
})


app.post("/api/persons", (request, response) => {
  const { body } = request;

  if (!body.name, !body.number) {
    return response.status(400).json({ error: "Name and number are required" });
  }

  Person.findOne({ name: body.name }).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({ error: "Name must be unique" });
    }

    const newPerson = new Person({
      name: body.name,
      number: body.number
    });

    newPerson.save().then(savedPerson => {
      response.json(savedPerson);
    })
  })
})



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})