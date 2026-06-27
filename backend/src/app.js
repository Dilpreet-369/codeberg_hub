import express from 'express';

const app = express();

// Parsing middleware for raw JSON request payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base System Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'CodeBerg Hub Express App Engine Ready' });
});

export default app;
