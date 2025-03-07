require('dotenv').config()
const express = require('express') // require module syntax we can als write import 

const app = express() // here we create a function variable of express

const port = 4000

// req -> request ,  res-> response 
// in below function we get '/' address and if we get a request we send a response of res.send('Hello World!')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/twitter' , (req, res)=> {
    res.send("Dipak ka twitter nahi hai ")
})

app.get('/login', (req , res)=>{
    res.send('<h1> please login at chai aur code </h1>')
})


app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})
