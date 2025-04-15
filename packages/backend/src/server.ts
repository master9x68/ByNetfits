import express, { Express, Request, Response, Application } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app: Application = express();
const port = process.env.BACKEND_PORT || 8001;

app.use(cors());
app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.send('Welcome to ByNetfits Backend API v1');
});


app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});