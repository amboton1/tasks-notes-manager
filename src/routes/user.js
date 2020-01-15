const express = require('express')
const User = require('../model/users')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const { sendCancelationEmail } = require('../emails/accounts')

// POST CREATION OF USERS RESOURCE
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()

        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

// GET USER
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token 
        })

        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        console.log(req.user.tokens)

        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})


// UPDATE USER
router.patch('/users/me', auth, async (req, res) => {
    const body = req.body

    const allowedUserUpdates = ['name', 'age', 'email', 'password']
    const newUsersProperty = Object.keys(body)

    const isValidOperations = newUsersProperty.every((obj) => allowedUserUpdates.includes(obj))

    if (!isValidOperations) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        newUsersProperty.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()

        res.send(req.user)

    } catch (error) {
        res.status(500).send(error)
    }
})

// LOGGING USER
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send()
    }
})

// DELETE USER
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        // sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error) {
     res.status(500).send()   
    }
})

const avatar = new multer({
    'limits': {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match('\.(jpg|jpeg|png)$')) {
            return cb(new Error('Please upload jpg, jpeg or png file.'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (error) {
        res.status(400).send()
    }
})

module.exports = router
