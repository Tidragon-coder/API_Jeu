require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const gameListRoutes = require('./routes/gameListRoutes');
const genreRoutes = require('./routes/genreRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const port = 3000;

//middlewares
app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/gamelist', gameListRoutes);
app.use('/api/genre', genreRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
    res.json({ message: '🟢Serveur backend-API online' });
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });



app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur online at http://0.0.0.0:${port}`);
});
