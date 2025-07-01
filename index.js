require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const geolocationRoutes = require("./routes/geolocationRoutes");
const userRoutes = require("./routes/userRoutes");
const resultRoutes = require("./routes/resultRoutes");
const usFactRoutes = require("./routes/usFactRoutes");

// express app
const app = express();

// CORS configuration - put this BEFORE other middleware
const corsOptions = {
  origin: [
    process.env.REACT_APP_URL,
    'https://geolocation-quiz-frontend.vercel.app', // Add your production frontend URL
    'http://localhost:3000',
    'http://localhost:3002'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200 // For legacy browser support
};

// enable CORS
app.use(cors(corsOptions));

// Handle preflight requests
// app.options('*', cors(corsOptions));

app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
  console.log('Request Body:', req.body);
  next();
});

// Add a test route to verify server is working
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/geolocation", geolocationRoutes);
app.use("/api/usfact", usFactRoutes);
app.use("/api/user", userRoutes);
app.use("/api/result", resultRoutes);


mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    //listen to request
    app.listen(process.env.PORT, () => {
      console.log("We are flying on port ✈️ ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
