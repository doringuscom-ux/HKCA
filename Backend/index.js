const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables immediately at the top
dotenv.config();

const connectDB = require('./config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo').MongoStore;
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const { startHeartbeat } = require('./utils/heartbeat');
const { startCleanupJob } = require('./utils/cleanup');

// Connect to database
connectDB().then(() => {
  startHeartbeat();
  startCleanupJob();
});

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Render)

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: 'sessions',
});

// Middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'http://localhost:5174', // Common alternative
    process.env.FRONTEND_URL,
    'https://hkca.org.in',
    'https://www.hkca.org.in'
  ].filter(Boolean),
  credentials: true,
}));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: true, // Forces the session to be saved back to the session store
    saveUninitialized: false,
    rolling: true, // Force cookie set on every response, which resets the maxAge
    store: store,
    proxy: true, // Add this for Render
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user-events', require('./routes/events'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/payment', require('./routes/payment'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Increase timeout for large file uploads (10 minutes)
server.timeout = 600000;
server.keepAliveTimeout = 610000;


