require("dotenv").config()

const express = require("express");
const app = express();

app.use(express.json()); // inilizing express.json

let todos = [{id:1, task:"learn node.js", completed:"false"},
    {id:2, task:"Build CRUD API", completed:"false"}
];

app.get("/todos", (req, res) =>{
    res.status(200).json(todos)
}); // send as json

app.post("/todos", (req, res) => {
const newTodo= {id: todos.length + 1, ...req.body};

todos.push(newTodo);
res.status(201).json(newTodo);

});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
    if (!todo) return res.status(404).json({ message: 'Not found' });

    Object.assign(todo, req.body); // Merge: e.g., {completed: true}
    res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;

    todos = todos.filter((t) => t.id !== id);

    if (todos.length === initialLength)
        return res.status(404).json({ error: 'Not found' });

    res.status(204).send(); // Silent success
});


const PORT = process.env.PORT
app.listen(PORT, () => {
 console.log(`App is listening on port ${PORT}`)

});

