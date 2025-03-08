const mongoose = require('mongoose')

module.exports = () => {
    // const connectionParams = {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // };

    try {
        mongoose.connect(process.env.DB_CONNECT,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DataBase connection secure and working...');
    } catch (error) {
        console.log(error)
        console.log("Couldn't connect to the DataBase")
    }
}
