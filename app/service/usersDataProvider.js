const fs = require('fs');
const path = require('path');

class UsersDataProvider {
    constructor() {
        this._cache = null;
        this._dataFilePath = path.join(__dirname, 'data', 'users.json');
    }

    async getUsers() {
        if (this._cache) {
            return this._cache;
        }
        try {
            fs.accessSync(this._dataFilePath)
        } catch {
            this._cache = [];
            return this._cache;
        }
        const file$ = fs.createReadStream(this._dataFilePath,{encoding: 'utf-8'});
        const data = await new Promise((res, rej) => {
            let result = '';
            file$.on('data', data => {
                result += data;
            });
            file$.on('end', () => {
                res(result);
            });
            file$.on('error', rej);
        });

        this._cache = JSON.parse(data);

        return this._cache;
    }

    async getUserByName(name) {
        if (!this._cache) {
            this._cache = await this.getUsers();
        }

        return this._cache.find(({username}) => username === name);
    }

    async getUserByEmail(userEmail) {
        if (!this._cache) {
            this._cache = await this.getUsers();
        }

        return this._cache.find(({email}) => email === userEmail);
    }

    async createNewUser(item) {
        if (!this._cache) {
            this._cache = await this.getUsers();
        }
        if (item.id) {
            this._cache = this._cache.map(e => e.id === item.id ? item : e);
        } else {
            item = {
                id: Date.now(),
                ...item
            };
            this._cache.push(item);
        }
        const file$ = fs.createWriteStream(this._dataFilePath, {encoding: 'utf-8'});
        file$.end(JSON.stringify(this._cache));
        return item;
    }
}

module.exports = new UsersDataProvider();
