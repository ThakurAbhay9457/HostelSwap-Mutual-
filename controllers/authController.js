const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const twilio = require('twilio');

const studentSignupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  hostel: z.enum([
    'block1', 'block2', 'block3', 'block4',
    'block5', 'block6', 'block7', 'block8'
  ]),
  bedType: z.enum(['4 bedded', '3 bedded', '2 bedded', '1 bedded']),
  roomNumber: z.number()
});

// Twilio config (replace with your credentials or use env)
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const OTPs = {};

// Google OAuth setup (replace with your credentials or use env)
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: '/api/auth/google/callback',
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let student = await Student.findOne({ 'socialLinks.google': profile.id });
//     if (!student) {
//       student = await Student.create({
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         socialLinks: { google: profile.id },
//         isVerified: true
//       });
//     }
//     return done(null, student);
//   } catch (err) {
//     return done(err, null);
//   }
// }));

exports.studentSignup = async (req, res) => {
  try {
    const data = studentSignupSchema.parse(req.body);
    const existing = await Student.findOne({ email: data.email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(data.password, 10);
    const student = await Student.create({ ...data, password: hashed });
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(400).json({ message: err.errors ? err.errors : err.message });
  }
};

exports.studentSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        hostelName: student.hostel,
        roomNumber: student.roomNumber,
        isAdmin: false
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.adminSignin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: admin._id,
        name: admin.username,
        email: null,
        hostelName: null,
        roomNumber: null,
        isAdmin: true
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
// exports.googleCallback = [
//   passport.authenticate('google', { session: false, failureRedirect: '/' }),
//   (req, res) => {
//     const token = jwt.sign({ id: req.user._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '7d' });
//     res.redirect(`/auth-success?token=${token}`); // Or send token as JSON
//   }
// ];

exports.phoneSignup = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone required' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    OTPs[phone] = otp;
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    res.json({ message: 'OTP sent' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (OTPs[phone] !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    let student = await Student.findOne({ phone });
    if (!student) {
      student = await Student.create({ phone, isVerified: true });
    } else {
      student.isVerified = true;
      await student.save();
    }
    delete OTPs[phone];
    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 