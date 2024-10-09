const ConnectToDatabase = require('../../infrastructure/database/database.cjs');
const bcrypt = require('bcrypt');

class User {
    constructor(userData) {
        this.userData = userData;
    }

    static async create(userData) {
        const dbInstance = new ConnectToDatabase();
        await dbInstance.connectOpen();
        const result = await dbInstance.db.collection('users').insertOne(userData);
        return new User({ _id: result.insertedId, ...userData });
    }

    static async findByGoogleId(googleId) {
        const dbInstance = new ConnectToDatabase();
        await dbInstance.connectOpen();
        return await dbInstance.db.collection('users').findOne({ googleId });
    }

    static async findByGitHubId(githubId) {
        const dbInstance = new ConnectToDatabase();
        await dbInstance.connectOpen();
        return await dbInstance.db.collection('users').findOne({ githubId });
    }

    static async findByDiscordId(discordId) {
        const dbInstance = new ConnectToDatabase();
        await dbInstance.connectOpen();
        return await dbInstance.db.collection('users').findOne({ discordId });
    }

    static async findById(id) {
        const dbInstance = new ConnectToDatabase();
        await dbInstance.connectOpen();
        return await dbInstance.db.collection('users').findOne({ _id: id });
    }

    static async findByEmail(email) {
        const dbInstance = new ConnectToDatabase();
        await dbInstance.connectOpen();
        return await dbInstance.db.collection('users').findOne({ email });
    }

    static async createWithPassword(username, email, password) {
        const dbInstance = new ConnectToDatabase();
        await dbInstance.connectOpen();
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await dbInstance.db.collection('users').insertOne({ username, email, password: hashedPassword });
        return new User({ _id: result.insertedId, username, email, password: hashedPassword });
    }
}

module.exports = User;