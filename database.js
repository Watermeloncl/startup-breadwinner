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
const liveScoreCollection = client.db('breadwinner').collection('liveScores');

function getUser(username) {
    return userCollection.findOne({ username: username });
}

function getLiveScores() {
    const query = {};
    const options = {
        sort: { level: -1, time: 1 },
        limit: 5,
    };
    const cursor = liveScoreCollection.find(query, options);
    return cursor.toArray();
}

async function createUser(username, password) {
    const hashword = await bcrypt.hash(password, 10);
    const user = { username: username, password: hashword };

    await userCollection.insertOne(user);
  
    return user;
}

async function addScore(score) {
    const oldScore = await scoreCollection.findOne({name: score.name});

    if(oldScore != undefined) {
        await scoreCollection.deleteMany({name: score.name});
        if(oldScore.level < score.level) {
            await scoreCollection.insertOne(score);
        } else if(oldScore.level == score.level) {
            if(oldScore.time > score.time) {
                await scoreCollection.insertOne(score);
            } else {
                await scoreCollection.insertOne(oldScore);
            }
        } else {
            await scoreCollection.insertOne(oldScore);
        }
    } else {
        scoreCollection.insertOne(score);
    }
}

async function addLiveScore(score) {
    const oldScore = await liveScoreCollection.findOne({name: score.name});

    if(oldScore != undefined) {
        await liveScoreCollection.deleteMany({name: score.name});
        if(oldScore.level < score.level) {
            await liveScoreCollection.insertOne(score);
        } else if(oldScore.level == score.level) {
            if(oldScore.time > score.time) {
                await liveScoreCollection.insertOne(score);
            } else {
                await liveScoreCollection.insertOne(oldScore);
            }
        } else {
            await liveScoreCollection.insertOne(oldScore);
        }
    } else {
        liveScoreCollection.insertOne(score);
    }
}

async function removeLiveScore(score) {
    await liveScoreCollection.deleteMany({name: score.name});
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
    getLiveScores,
    addLiveScore,
    removeLiveScore,
};