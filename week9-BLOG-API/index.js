require("dotenv").config();

const express = require("express");

const cors = require("cors");
const connectDB = require("./database/connectDB.js"); 

const RequestLogger =require("./middlewares/logger.js");
const Requesthandler =require("./middlewares/errorHandler.js");

connectDB();

const articleroutes = require("./routes/article.route.js");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors("*"));



app.use(RequestLogger);

app.use("/api",articleroutes );

//localhost: 6000/api/articles
app.use(Requesthandler);











app.listen(PORT, ()=>{
    console.log(`server is listening on port {PORT}`);
})