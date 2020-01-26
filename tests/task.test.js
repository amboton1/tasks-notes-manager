const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/model/tasks')
const { userOneId, userOne, userTwoId, userTwo, taskOne, taskTwo, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create new task', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Test Description',
            owner: userOneId
        }).expect(201)

    //Assert that the database was changed correctly
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
    expect(task.description).toMatch('Test Description')
    expect(task.owner).toEqual(userOneId)
});

test('Should get tasks for the first user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body).toHaveLength(2)
});

test('Should fail if second user tries to delete the first task', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

        const task = await Task.findById(taskOne._id)
        expect(task).not.toBeNull()
});