var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true, select: false }
});

// Hash the password only in the case if it was changed or new before saving the user
UserSchema.pre('save', function (next) {
    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
        if(err) return next(err);

        user.password = hash;
        next();
    });
});

// Check password and database hash
UserSchema.methods.comparePassword = function(password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);