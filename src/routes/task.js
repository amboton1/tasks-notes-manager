const express = require('express')
const Tasks = require('../model/tasks')
const auth = require('../middleware/auth')
const router = new express.Router()

// CREATE TASKS
router.post('/tasks', auth, async (req, res) => {
    // const task = new Tasks(req.body)
    const task = new Tasks ({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})


// GET ALL TASKS
router.get('/tasks', auth, async (req, res) => {
    
    const match = {}
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})


// GET SPECIFIC TASK
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        // const task = await Tasks.findById(_id)

        const task = await Tasks.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})


// UPDATE TASK
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const body = req.body

    const allowedTasksProps = ['description', 'completed']
    const newProp = Object.keys(body)

    const isValidOperations = newProp.every((obj) => allowedTasksProps.includes(obj))

    if (!isValidOperations) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Tasks.findOne({_id, owner: req.user._id})

        // const task = await Tasks.findByIdAndUpdate(_id, body, { new: true, runValidators: true })

        if (!task) {
            return res.status(404).send()
        }

        newProp.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(500).send('Something went wrong')
    }
})

// DELETE TASK
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Tasks.findOneAndDelete({_id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)

    } catch (error) {
     res.status(500).send(error)   
    }
})

module.exports = router