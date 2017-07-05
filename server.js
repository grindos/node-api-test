var express     = require('express'),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan'),
    mongoose    = require('mongoose'),
    bcrypt      = require('bcrypt-nodejs');


var app = express(),
    port = process.env.PORT || 8080,
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true, select: false }
});

UserSchema.pre('save', function (next) {
    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
        if(err) return next(err);

        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
}

module.exports = mongoose.model('User', UserSchema);

mongoose.connect('mongodb://admin:123456@ds147882.mlab.com:47882/grindos-test');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \Authorization');
    next();
});

app.use(morgan('dev'));

app.get('/', function(req, res) {
    res.send('Welcome to the home page!');
});

var apiRouter = express.Router();

apiRouter.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.use('/api', apiRouter);

app.listen(port);
console.log('Magic happens on port ' + port);