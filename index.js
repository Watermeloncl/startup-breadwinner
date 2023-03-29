const express = require('express');
const database = require('./database.js');
const bcrypt = require('bcrypt');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(express.static('public'));
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/auth/createUser', async (req, res) => {
    if (await database.getUser(req.body.username)) {
        res.status(409).send({ msg: 'User already exists!' });
    } else {
        const user = await database.createUser(req.body.username, req.body.password);
    
        res.status(201).send({ msg: 'Created User' });
    }
});

apiRouter.post('/auth/login', async (req, res) => {
    console.log("entered login endpoint");
    const user = await database.getUser(req.body.username);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.status(200).send({ msg: 'Valid Credentials' });
            return;
        }
    }
    res.status(401).send({ msg: 'Invalid Credentials!' });
});

apiRouter.get('/loadScores', async (req, res) => {
    const scores = await database.getHighScores();
    res.send(scores);
});

apiRouter.post('/newScore', async (req, res) => {
    await database.addScore(req.body);
    //const scores = await database.getHighScores();
    //res.send(scores);
    res.status(200).send({ msg: 'Added Score' });
});

app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
  });

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});