const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;
const ObjecId = mongodb.ObjectId;

class User {
    constructor(username, email, userId) {
        this.name = username;
        this.email = email;
        this._id    = userId ? new ObjectId(userId): null;
    }

    save() {
        const db = getDb();
        let dbOperation;
        if (this._id){
            dbOperation = db.collection('users').insertOne(this);
        }else{
            dbOperation = db.collection('users').updateOne({_id:this.id}, {$set: this});
        }

        return dbOperation.then(result=>{console.log(result)}).catch(err=>{console.log(err)});
    }

    static findUserById(userId) {
        const db = getDb();
        return db.collection('users')
            .find({_id: new Object(userId)})
            .next()
            .then(user=>{
                return user;
            })
            .catch(err=>{
                console.log(err);
            });
    }
}

module.exports = User;