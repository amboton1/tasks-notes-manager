require('../src/db/mongoose')
const User = require('../src/model/users')

// User.findByIdAndUpdate('5ddaa3d4f7c10a1650f98da6', { age: 27 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 27 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

// User.updateMany({ age: 0 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 0 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return { user, count }
}

const updateManyUsers = async (age) => {
    const user = await User.updateMany({ age })
    const count = await User.countDocuments({ age })
    return { count };
}

// updateAgeAndCount('5ddaa3d4f7c10a1650f98da6', 2).then((count) => {
//     console.log(count)
// }).catch((e) => {
//     console.log(e)
// })

updateManyUsers(0).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})