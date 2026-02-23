var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// API routes
var authRouter = require('./routes/api/auth');
var patientsRouter = require('./routes/api/patients');
var askepRouter = require('./routes/api/askep');
var implementationsRouter = require('./routes/api/implementations');
var evaluationsRouter = require('./routes/api/evaluations');
var reportsRouter = require('./routes/api/reports');
var dashboardRouter = require('./routes/api/dashboard');

var app = express();

// CORS - allow all origins in development
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/askep', askepRouter);
app.use('/api/implementations', implementationsRouter);
app.use('/api/evaluations', evaluationsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/dashboard', dashboardRouter);

// Legacy routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // If API request, return JSON error
  if (req.path.startsWith('/api')) {
    return res.status(err.status || 500).json({ error: err.message });
  }

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
