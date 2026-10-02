import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import noteRoutes from './routes/note.route.js'


const app = express()

dotenv.config()
const port = process.env.PORT || 4002

//Database Connection
try {
    mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to DB")
} catch (error) {
    console.log(error)
}

//Routing Middleware
app.use(express.json())
app.use(cors())
app.use("/api/v1/noteapp", noteRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
