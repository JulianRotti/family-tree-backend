// src/index.js

import express from 'express';
import familyRoutes from './routes/familyRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/family', familyRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;  // This is useful for testing
