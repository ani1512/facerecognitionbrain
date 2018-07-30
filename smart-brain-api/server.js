const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'sabu',
    database : 'smart-brain'
  }
});

db.select('*').from('users').then(data => {
	console.log(data);
})

const app = express();

app.use(cors())
app.use(bodyParser.json());


app.get('/', (req, res) =>{
	res.send(database.users);
});

app.post('/signin', (req, res) => {

	// bcrypt.compare("bacon", 'hash', function(err, res) {
 //    // res == true
	// });
	if(req.body.email === database.users[0].email && 
		req.body.password === database.users[0].password){
		res.json(database.users[0] );
	} else {
		res.status(400).json('error logging in');
	}
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;

	// bcrypt.hash(password, null, null, function(err, hash) {
 //    // Store hash in your password DB.
	// });

	db('users')
		.returning('*')
		.insert({
			email: email,
			name: name,
			joined: new Date()
		})
		.then(user => {
			res.json(user);
		})
		.catch(err => res.status(400).json("unable to register"))
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	});
	if (!found)
		res.status(404).json('no such user');
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found)
		res.status(404).json('no such user');
});



// Load hash from your password DB.


app.listen(3000, ()=> {
	console.log('app is running on port 3000');
});
