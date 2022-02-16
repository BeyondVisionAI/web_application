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

<<<<<<< HEAD
exports.databaseURL = `mongodb://beyondvisiontesteur:testpassword@mongodb`;
=======
exports.databaseURL = `mongodb://beyondvisiontesteur:testpassword@mongodb`;

// mongodb://beyondvisiontests:testpassword@mongodb/beyondvisiontests
>>>>>>> ae7dc7967a634c2986598fe132a8c5a2adaa3d48
