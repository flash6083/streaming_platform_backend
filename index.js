const express = require('express')
const cors = require('cors')
const bycrypt = require('bcryptjs') 
const { connectToDb, getDb } = require('./db')

// init app

const app = express()
app.use(express.json())
app.use(cors())

// db connection

const PORT = process.env.PORT || '8000'

let db

connectToDb((err) => {
    if(!err){
        app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`);
        })
    }
    else{
      console.log("Could not connect to database");
    }
    db = getDb()
})

// routes

app.get('/', (req,res) => {
  res.json(`Connected to backend server successfully, running on port ${PORT}`)
})

// Admin and Authentication

// Adding an user
app.post('/users/reg', async (req,res) => {

  try{

    const user = await db.collection('user').findOne({user: req.body.user})

    if(user != null){
      if(user.user === req.body.user){
        res.status(500).json({err: "User with this username already exists, try a different username"})
      }
    }
    else{
      const user = req.body.user
      const password = await bycrypt.hash(req.body.password, 10)

      const currentUser = {
        "user": user,
        "password": password
      }

      db.collection('user')
        .insertOne(currentUser)
        .then(result => {
          res.status(201).json({result, user})
        })
        .catch(() => {
          res.status(500).json({err: 'Could not add an user'})
        })
    }

    

  }
  catch(err){
    res.status(500).json({err: 'Could not hash user password'})
  }

})


  

// Getting an user
app.post('/users/login', async (req,res) => {

  try{

    const user = await db.collection('user').findOne({user: req.body.user})

    if(!user) { res.status(500).json({err: 'Invalid User'})}
    
    const isPasswordValid = await bycrypt.compare(req.body.password, user.password)
    
    if(isPasswordValid)
      res.status(200).json({msg: 'Correct Password', user: user.user})
    else
      res.json({err: 'Incorrect Password'})
  }
  catch(err){
    res.status(500).json({err: 'Invalid login credentials!'})
  }

})

  

  