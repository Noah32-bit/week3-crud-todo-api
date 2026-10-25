require("dotenv").config()

const express = require("express");
const app = express();

const logRequest = require("./logger")
const { validateCreateTodo, validateUpdateTodo } = require("./validator");
const errorHandler = require("./errorHandler")

const connectDB = require("./database/db.js")
//const connectDB = require("connectDB")
const Todo = require("./models/todo.model.js")

app.use(express.json()); // inilizing express.json

connectDB();

app.use(logRequest);

app.get("/todos", async(req, res) =>{
    try {
     const todos = await Todo.find({})
    res.status(200).json(todos)
        
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }

}); // send as json
app.get('/todos/active', (req,res) =>{
const activeTodos = todos.filter((t) => t.completed === false);

res.json(activeTodos);

});

app.get('/todos/completed', async(req, res, next) => {
  try {
    //const completed = todos.filter((t) => t.completed);
    
    const completed = await Todo.find({completed: true})
    res.json(completed); // Custom Read!
  } catch (error) {
    next(error);
  }
});

app.get('/todos/:id', async(req, res, next) => {
  try {

    const todo = await Todo.findById(req.params.id)

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.json(todo);
    
  } catch (error) {
    next(error)
    
  }
});

app.post("/todos", validateCreateTodo, async(req, res, next) => {
   try {

    const {task, completed} = req.body
    const newTodo = new Todo({
    task,
    completed
});
await newTodo.save();
res.status(201).json(newTodo);


    
   } catch (error) {
    next(error);
    
   }

});

// PATCH Update – Partial
app.patch('/todos/:id', validateUpdateTodo, async(req, res, next) => {
  try {

    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body,
        {new: true})

     if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

    res.status(200).json(todo);
    
  } catch (error) {
    next(error);
  }
});

// DELETE Remove
app.delete('/todos/:id', async(req, res, next) => {
   try {

     const todo = await Todo.findByIdAndDelete(req.params.id);
     if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  };

    res.status(204).json({message: `Todo ${req.params.id} deleted`}); // Silent succe
    
   } catch (error) {
    next(error);
    
   }
});

app.use(errorHandler);


const PORT = process.env.PORT || 4006
app.listen(PORT, () => {
 console.log(`App is listening on port ${PORT}`);

});

