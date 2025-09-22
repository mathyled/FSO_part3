const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  console.log(process.argv[2]);

  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]


console.log("process.env.MONGO_URI", process.env.MONGO_URI);

const url =
  `mongodb+srv://fullstack:${password}@cluster0.lj0istf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: personName,
  number: personNumber
})

// Si recibo argumentos adicionales, agrego la persona a la base de datos
if (personName && personNumber) {
  person.save().then(result => {
    console.log(`added ${personName} number ${personNumber} to phonebook`)
    mongoose.connection.close()
  })
} else {
  // Si no, muestro todas las personas en la base de datos

  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}