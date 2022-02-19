let {
    existsSync,
    mkdirSync,
    writeFileSync
} = require('fs');
const insertHelper = require('./dbHelper');
let db_path = './database'
const {
    clearCollection,
    removeLastCollectionItem,
    removeFirstCollectionItem,
    getCollectionLength,
    removeDataWithId,
    getDataWithId,
    updateData,
    setKey,
    setCrptr } = require('./dbHelper');
const sheild = require('./sheild');

class Database {

    key = ''
    constructor(key) {
        this.key = key;
        if (!existsSync(db_path)) {
            mkdirSync(db_path)
            if (key != null) {

            } else {
                createError(new TypeError('Key must be provided'))
            }
        }
    }
    getCollection(collection_name) {
        if (collection_name != null) {
            if (collection_name != '') {
                if (!existsSync(db_path + '/' + collection_name)) {
                    mkdirSync(db_path + '/' + collection_name)
                    writeFileSync(db_path + '/' + collection_name + '/crptr', (new sheild(this.key)).encrypt(JSON.stringify({})))
                }
                return new Collection(collection_name, this.key)
            } else {
                createError(new TypeError('Collection name must be provided'))
                return null
            }
        } else {
            createError(new TypeError('Collection name must be provided'))
            return null
        }
    }

}

class Collection {

    collection_name = ''

    constructor(collection_name, key) {
        this.collection_name = collection_name
        setCrptr(key)
    }

    insertData(data, { id }) {
        return new Promise((res, rej) => {
            if (typeof (data) == 'object') {
                res(insertHelper.insert(data, this.collection_name, { id }))
            } else {
                console.error('Data must be an object');
            }
        })
    }
    clearCollection() {
        clearCollection(this.collection_name)
        return
    }
    removeLastItem() {
        removeLastCollectionItem(this.collection_name)
        return
    }
    removeFirstItem() {
        removeFirstCollectionItem(this.collection_name)
        return
    }
    getLength() {
        getCollectionLength(this.collection_name)
    }
    removeDataWithId(id) {
        removeDataWithId(this.collection_name, id)
    }
    child(id) {
        return new child(this.collection_name, id)
    }
}

class child {
    collection_name = ''
    id = ''
    constructor(collection_name, id) {
        this.collection_name = collection_name
        this.id = id
    }
    getData() {
        return new Promise((resolve, reject) => {
            resolve(getDataWithId(this.collection_name, this.id))
        })
    }
    updateData(obj) {
        updateData(obj, this.id, this.collection_name)
    }
}
function createError(message) {
    console.error(message);
}
module.exports = Database