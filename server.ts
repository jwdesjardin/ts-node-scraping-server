import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

console.log('server', process.env.SERVER_API_KEY)

const app = express();

express.json();

import nhlRoutes from './routes'

app.use('/api', nhlRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});

