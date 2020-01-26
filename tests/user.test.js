const request = require('supertest')
const app = require('../src/app')
const User = require('../src/model/users')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Ammar',
        email: 'ammar.botonjic@test.com',
        password: 'MyPass3367!'
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'Ammar',
            email: 'ammar.botonjic@test.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass3367!')
});

test('Should not signup with invalid name/email/password', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Tester',
            email: 'botonjic@bota.hr',
            password: 'password'
        }).expect(400)
});

test('Should not update user if unauthenticated', async () => {
    const response = await request(app)
        .patch('/users/me')
        .send({ password: 'newpass231111',  })
        .expect(401)
});

test('Should not update user with invalid name/email/password', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ email: '',  })
        .expect(500)
    const user = await User.findById(userOneId)
    expect(user.email).toBe('mike@test.com')
});

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)

    expect(response.body.token).toBe(user.tokens[1].token)

});

test('Should not login nonexistence user', async () => {
    await request(app).post('/users/login').send({
        email: 'nouser@email.com',
        password: '1223testov'
    }).expect(400)
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
});

test('Should delete user account', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).not.toBeNull()
});

test('Should not delete unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
});

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)

    // When working with objects and their properties(toEqual)
    expect(user.avatar).toEqual(expect.any(Buffer))
});


test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'New update',  })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toMatch('New update')
});

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: 'New York',  })
        .expect(400)
});