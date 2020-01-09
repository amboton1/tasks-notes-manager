require('../src/db/mongoose')
const Task = require('../src/model/tasks')

// Task.findByIdAndDelete('5dded67036f62b1b94161881').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

const deleteTaskAndCount = async (id) => {
    const deletedUser = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('5de3b2371e6dba173863813e').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})
