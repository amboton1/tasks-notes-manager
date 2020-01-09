const doWorkPromise = new Promise((resolve,reject) => {
    setTimeout(() => {    
        reject('This is reject - error!')
    }, 2000);
})

doWorkPromise.then((result) => {
    console.log('Success! ', result)
}).catch((result) => {
    console.log('Error! ', result)
})