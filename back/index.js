require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

mongoose.set('strictQuery', true);

const PORT = process.env.PORT || 3000
const dbURI = process.env.MONGODB_URI

console.log('MongoDB URI:', dbURI) 

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(`Error connecting to MongoDB: ${err.message}`))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
