const express = require('express');
const Feedback = require('../model/Feedback.js');
const Notification = require('../model/Notification.js');
const Student = require('../model/Student.js');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verify = require('./verify-token.js');
require('dotenv/config')


router.post('/login', async (req, res) => {
    try {
        if (req.body.username === process.env.ADMIN_USERNAME && req.body.password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ idNo: process.env.ADMIN_ID }, process.env.TOKEN_SECRET);
            res.setHeader('auth-token', token);
            return res.status(200).send({ success: true, message: `welcome back admin`, token: token })
        } else {
            return res.status(401).send({ success: false, message: `invalid credentials` })
        }
    } catch (err) {
        res.status(400).send({ success: false, message: err.message })
    }
})

// get Feedbacks
router.get('/feedbacks', verify, async (req, res) => {
    try {
        if (req.userid === process.env.ADMIN_ID) {
            const posts = await Feedback.find();
            res.status(200).json(posts);
        } else {
            res.status(401).json({ success: false, message: "unauthorized" })
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});


// get Students
router.get('/getStudents', verify, async (req, res) => {
    try {
        if (req.userid === process.env.ADMIN_ID) {
            const posts = await Student.find();
            res.status(200).json(posts);
        } else {
            res.status(401).json({ success: false, message: "unauthorized" })
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// post Notifications
router.post('/notifications', verify, async (req, res) => {
    const data = new Notification({
        type: req.body.type,
        title: req.body.title,
        description: req.body.description,
        externals: req.body.externals ? req.body.externals : undefined
    });

    try {
        if (req.userid === process.env.ADMIN_ID) {
            await data.save();
            res.status(200).json({ success: true, message: 'Posted successfully' });
        } else {
            res.status(401).json({ success: false, message: "unauthorized" })
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

module.exports = router;