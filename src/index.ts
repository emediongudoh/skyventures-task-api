import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

// Create express app
const app = express();

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Test task route
app.get('/', (req: Request, res: Response) => {
    res.send('Testing SkyVentures Task API');
});

// Start the dev server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
