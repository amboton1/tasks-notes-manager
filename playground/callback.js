const doWorkCallBack = (callback) => {
    setTimeout(() => {
        // callback('This is my error!', undefined);
        callback(undefined, [1,2,3]);
    }, 2000);
}

doWorkCallBack((error, result) => {
    if (error) {
        return console.log(error);
    } else {
        return console.log(result);
    }
})