import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(cookieParser())
app.get('/', (_, res) => {
  res.json({ message: 'Hello World' });
});

// Routes
import userRoutes from './routes/user.routes.js';
app.use("/api/v1/user", userRoutes);


export default app;