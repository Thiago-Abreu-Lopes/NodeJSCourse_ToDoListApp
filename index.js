const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");
const dotenv = require('dotenv');
dotenv.config();

app.use("/static", express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extend: true }));

mongoose.set("strictQuery", true);

mongoose.connect(process.env.DB_CONNECT, () => {
	console.log("Conected to db!");

	app.listen(3000, () => {
		console.log("Server Up and Running!");
	});
})

app.set("view engine","ejs");

//======CRUD

//READ
app.get('/', (req,res) => {
	TodoTask.find({}, (err, tasks) => {
		res.render("todo.ejs",{todoTasks: tasks });
	});
});

//CREATE
app.post('/', async (req, res) => {
	const todoTask = new TodoTask({
		content:req.body.content
	});
	try {
		await todoTask.save();
		res.redirect("/");
	}catch(err){
		res.redirect("/");
	}
});

//UPDATE
app.route("/edit/:id")
.get((req,res) => {
	const id = req.params.id;
	TodoTask.find({},(err, tasks) => {
		res.render("todoEdit.ejs", {todoTasks: tasks, idTask:id});
	});
})
.post((req,res) => {
	const id = req.params.id;
	TodoTask.findByIdAndUpdate(id, {content:req.body.content}, err =>{
		if(err) return res.send(500,err);
		res.redirect("/");
	});
});

//DELETE
app.route("/remove/:id").get((req,res) => {
	const id = req.params.id;
	TodoTask.findByIdAndRemove(id, err =>{
		if(err) return res.send(500,err);
		res.redirect("/");
	});
});