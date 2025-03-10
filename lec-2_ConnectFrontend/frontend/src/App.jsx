import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'


function App() {
  const [jokes, setjokes] = useState([])

// TO use axios and link url we add procy in vite.config.js file
//this will append the url added to /api one 
// this will make server think that req is coming from the same server only
  useEffect(()=>{
    axios.get('/api/jokes'    )
    .then((response)=>{
      setjokes(response.data)
    }
  ).catch((error) => {
    console.log(error)
   } )
  }, [])



  return (
    <>
      <h1>Chai Aur Full Stack</h1>
      <p>JOKES: {jokes.length}</p>
      
      {
      jokes.map((joke,index) => (
          <div key={joke.id}>
            <h3>{joke.title}</h3>
            <p>{joke.content}</p>

          </div>


      ))
    }



    
    </>
  )
}

export default App
