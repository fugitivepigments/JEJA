const Sequelize = require("sequelize");

module.exports = {
    Sequelize: Sequelize,
    Op: Sequelize.Op,
    fs: require("fs"),
    User: require("../models").User,
    Meme: require("../models").Meme,
    Portfolio: require("../models").Portfolio,
    Artwork: require("../models").Artwork,
    ARTWORK_COUNT: 5280,
    uploadFileToCloud: function(filePath, filename) {
        console.log("inside uploadFileToCloud function");
        const bucketName = process.env.GC_BUCKET_ID;

        // Imports the Google Cloud client library
        const {Storage} = require('@google-cloud/storage');

        // Creates a client
        const storage = new Storage({ 
            projectId: process.env.GC_PROJECT_ID
        });

        // Upload a file to Google Cloud Storage
        async function uploadFile() {
            await storage.bucket(bucketName).upload(filePath, {
                destination: filename,
            });

            console.log(`${filePath} uploaded to ${bucketName}`);
        }
        uploadFile().catch(console.error);
    },
    deleteFileFromCloud: function(filename) {
        const bucketName = process.env.GC_BUCKET_ID;

        // Imports the Google Cloud client library
        const {Storage} = require('@google-cloud/storage');

        // Creates a client
        const storage = new Storage({ 
            projectId: process.env.GC_PROJECT_ID
        });

        // Upload a file to Google Cloud Storage
        async function deleteFile() {
            await storage.bucket(bucketName).file(filename).delete();

            console.log(`gs://${bucketName}/${filename} deleted`);
        }
        deleteFile().catch(console.error);
    }
};