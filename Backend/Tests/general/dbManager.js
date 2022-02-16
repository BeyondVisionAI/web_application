exports.openMongooseConnection = async function (mongoose, url) {
    await mongoose.connect(url, { useNewUrlParser: true });
}

exports.removeAllCollections = async function (mongoose) {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        await collection.deleteMany()
    }
}

exports.closeMongooseConnection = async function (mongoose) {
    await mongoose.connection.close();
}

exports.databaseURL = `mongodb://beyondvisiontesteur:testpassword@mongodb`;