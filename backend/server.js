import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import articleRoutes from './routes/articleRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config();



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express()
console.log(process.env.NODE_ENV)

connectDB()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/articles', articleRoutes)
app.use('/api/users', userRoutes)



if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/app/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
