const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db('breadwinner').collection('users');
const scoreCollection = client.db('breadwinner').collection('scores');

function getUser(username) {
    return userCollection.findOne({ username: username });
}

async function createUser(username, password) {
    const hashword = await bcrypt.hash(password, 10);
    const user = { username: username, password: hashword };

    await userCollection.insertOne(user);
  
    return user;
}

function addScore(score) {
    const query = {};
    const options = {
        sort: { name: score.name },
        limit: 1,
    };
    const cursor = scoreCollection.find(query, options);
    userScore[1] = cursor.toArray;

    //TODO debug? Double-check validity?
    
    if(userScore[0].level < score.level) {
        scoreCollection.deleteOne( { name: score.name } );
        scoreCollection.insertOne(score);
    } else if(userScore[0].level == score.level) {
        if(userScore[0].time > score.time) {
            scoreCollection.deleteOne( { name: score.name });
            scoreCollection.insertOne(score);
        }
    }
}

function getHighScores() {
    const query = {};
    const options = {
        sort: { level: -1, time: 1 },
        limit: 5,
    };
    const cursor = scoreCollection.find(query, options);
    return cursor.toArray();
}

module.exports = {
    getUser,
    createUser,
    addScore,
    getHighScores,
};