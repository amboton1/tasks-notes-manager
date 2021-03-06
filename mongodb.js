// CRUD CREATE READ UPDATE DELETE

const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID()
console.log(id)
console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!');
    }

    const db = client.db(databaseName);

    db.collection('tasks').deleteOne({
        description: 'Third description'
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})
