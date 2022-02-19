let db_path = './database'
const { randomUUID } = require('crypto')
let { writeFileSync, readFileSync } = require('fs')
const sheild = require('./sheild')
let crptr
module.exports = {
    setCrptr:(key)=>{
        crptr = new sheild(key)
    },
    insert: (obj, collection, { id }) => {
        if (id == 'auto') {
            let collection_path = db_path + `/${collection}/crptr`
            let data = JSON.parse(read(collection_path))
            let ranId = randomUUID()
            data[ranId] = obj
            write(collection_path, JSON.stringify(data))
            return ranId
        } else {
            let collection_path = db_path + `/${collection}/crptr`
            let data = JSON.parse(read(collection_path))
            data[id] = obj
            write(collection_path, JSON.stringify(data))
            return id
        }
    },
    clearCollection: (collection) => {
        let collection_path = db_path + `/${collection}/crptr`
        let data = JSON.parse(read(collection_path))
        data = {}
        write(collection_path, JSON.stringify(data))
    },
    removeLastCollectionItem: (collection) => {
        let collection_path = db_path + `/${collection}/crptr`
        let data = JSON.parse(read(collection_path))
        let keys = Object.keys(data)
        delete data[keys.at(keys.length - 1)]
        write(collection_path, JSON.stringify(data))
    },
    removeFirstCollectionItem: (collection) => {
        let collection_path = db_path + `/${collection}/crptr`
        let data = JSON.parse(read(collection_path))
        let keys = Object.keys(data)
        delete data[keys.at(0)]
        write(collection_path, JSON.stringify(data))
    },
    getCollectionLength: (collection) => {
        let collection_path = db_path + `/${collection}/crptr`
        let data = JSON.parse(read(collection_path))
        return Object.keys(data).length
    },
    removeDataWithId: (collection, id) => {
        let collection_path = db_path + `/${collection}/crptr`
        let data = JSON.parse(read(collection_path))
        delete data[id]
        write(collection_path, JSON.stringify(data))
    },
    getDataWithId: (collection, id) => {
        let collection_path = db_path + `/${collection}/crptr`
        let data = JSON.parse(read(collection_path))
        return data[id]
    },
    updateData: (obj, id, collection) => {
        let collection_path = db_path + `/${collection}/crptr`
        let data = JSON.parse(read(collection_path))
        if (data[id] != null) {
            data[id] = { ...data[id], ...obj }
            write(collection_path, JSON.stringify(data))
        } else {
            console.log(new Error(`Id not found. cannot update database at { collection:${collection}, ID:${id} } as the reqested data doesn't exist`));
        }

    }
}


function write(path, data) {
    data = crptr.encrypt(data)
    writeFileSync(path, data)
}
function read(path) {
    let data = readFileSync(path)
    data = crptr.decrypt(data)
    return data
}