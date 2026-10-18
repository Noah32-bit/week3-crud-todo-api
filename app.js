require("dotenv").config()

const express = require("express");
const app = express();

const logRequest = require("./logger")
const { validateCreateTodo, validateUpdateTodo } = require("./validator");
const errorHandler = require("./errorHandler")

app.use(express.json()); // inilizing express.json

app.use(logRequest);

let todos = [{id:1, task:"learn node.js", completed: false},
    {id:2, task:"Build CRUD API", completed:false},
    {id:3, task:"Build a car", completed:true}
];

app.get("/todos", (req, res) =>{
    res.status(200).json(todos)
}); // send as json

app.get('/todos/active', (req,res) =>{
const activeTodos = todos.filter((t) => t.completed === false);

res.json(activeTodos);

});

app.get('/todos/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)){
        throw new Error("Invalid ID");
        
    }
    const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.json(todo);
    
  } catch (error) {
    next(error)
    
  }
});

app.post("/todos", validateCreateTodo, (req, res, next) => {
   try {
     console.log(req.body);
const task= req.body.task;
if (!task.trim()) {
    return res.status(400).json({message: 'task is require'});
};
const newTodo= {id: todos.length + 1, ...req.body};

todos.push(newTodo);
res.status(201).json(newTodo);// sending to the frontend 
    
   } catch (error) {
    next(error);
    
   }

});

// PATCH Update – Partial
app.patch('/todos/:id', validateUpdateTodo, (req, res, next) => {
  try {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: 'Not found' });

    Object.assign(todo, req.body); 
    res.status(200).json(todo);
    
  } catch (error) {
    next(error);
  }
});

// DELETE Remove
app.delete('/todos/:id', (req, res, next) => {
   try {
     const id = parseInt(req.params.id);
    const initialLength = todos.length;

    todos = todos.filter((t) => t.id !== id);

    if (todos.length === initialLength)
        return res.status(404).json({ error: 'Not found' });

    res.status(204).send(); // Silent succe
    
   } catch (error) {
    next(error);
    
   }
});

app.use(errorHandler);


const PORT = process.env.PORT || 4006
app.listen(PORT, () => {
 console.log(`App is listening on port ${PORT}`);

});

