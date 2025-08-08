console.log("Hello, World!");
console.log("This is a simple Node.js application.");
const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
// Token personalizado para mostrar el body en POST
morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

// Configura morgan para usar el nuevo token
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]


app.get("/api/persons", (request, response) => {
  return response.json(persons)
})

app.get("/info", (request, response) => {
  const date = new Date();
  const info = `Phonebook has info for ${persons.length} people<br>${date}`
  response.send(info);
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    return response.json(person);
  } else {
    return response.status(404).send({ error: "Person not found" })
  }
})



app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);
  if (!person) {
    return response.status(404).send({ error: "Person not found" });
  } else {
    persons = persons.filter(p => p.id !== id);
    return response.status(204).end();
  }
})


app.post("/api/persons", (request, response) => {
  const { body } = request;

  if(!body.name, !body.number){
    return response.status(400).json({ error: "Name and number are required" });
  }
  if(persons.some(person => person.name === body.name)){
    return response.status(400).json({ error: "Name must be unique" });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  }


  persons = persons.concat(newPerson);
  return response.status(201).json(newPerson);

})



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})