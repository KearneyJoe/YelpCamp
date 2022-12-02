const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, imageObjects } = require('./seedHelpers');
const Campground = require('../models/campground');

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

console.log(dbURL)
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const userIds = [
    '6387bad9fb2d72be1e39b3e6',
    '638a3ec7b092e680ed9790b1',
    '638a3ed2b092e680ed9790be'
]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 250; i++) {

        //Generating a random number of images
        const randomImgCount = Math.floor(Math.random() * 5) + 1
        const images = []
        for (let i = 0; i < randomImgCount; i++) {
            let randomImgIdx = Math.floor(Math.random() * imageObjects.length)
            images.push(imageObjects[randomImgIdx])
        }

        //Random author
        const randomUser = userIds[Math.floor(Math.random() * userIds.length)]

        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: randomUser,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                ...images
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    console.log("Database Seeded -> Closing DB")
    mongoose.connection.close();
})