const express = require('express')
const Notes = require('../model/notes')
const auth = require('../middleware/auth')
const router = new express.Router()

// CREATE NOTES
router.post('/notes', auth, async (req, res) => {
    const note = new Notes({
        ...req.body,
        owner: req.user._id
    })

    try {
        await note.save()
        res.status(201).send(note)
    } catch (error) {
        res.status(400).send(error)
    }
})


// GET ALL NOTES
router.get('/notes', auth, async (req, res) => {
    try {
        const notes = await Notes.find({owner: req.user.id})
        res.send(notes)
    } catch (error) {
        res.status(500).send(error)
    }
})

// GET SPECIFIC NOTE
router.get('/notes/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const note = await Notes.findById({_id, owner: req.user._id})
        if (!note) {
            return res.status(404).send()
        }
        res.send(note)
    } catch (error) {
        res.status(500).send(error)
    }
})


// UPDATE NOTE
router.patch('/notes/:id', async (req, res) => {
    const _id = req.params.id
    const body = req.body

    const allowednotesProps = ['description', 'title']
    const newProp = Object.keys(body)

    const isValidOperations = newProp.every((obj) => allowednotesProps.includes(obj))

    if (!isValidOperations) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const note = await Notes.findByIdAndUpdate(_id, body, { new: true, runValidators: true })

        if (!note) {
            return res.status(400).send()
        }

        res.send(note)
    } catch (error) {
        res.status(500).send(error)
    }
})

// DELETE NOTE
router.delete('/notes/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const note = await Notes.findByIdAndDelete(_id)

        if (!note) {
            return res.status(400).send()
        }

        res.send(note)

    } catch (error) {
     res.status(500).send(error)   
    }
})

module.exports = router