"use strict";
const fs = require('fs');
function promisify (callbackBasedApi) {
    // the arrow function can not be returned here.
    return function() {
        let args = Array.prototype.slice.call(arguments);
        let promise = new Promise(
            (resolve, reject) => {
                args.push(
                    (err, result) => {
                        if(err) {
                            return reject(err);
                        }
                        resolve(result);
                    }
                );
                callbackBasedApi.apply(null, args);
            }
        );
        return promise;
    }
}

let readFile = promisify(fs.readFile);

readFile('file1.md', 'utf8')
    .then(
        (result)=> {
            console.log(`The result from file1.md ${result}`);
    })
    .catch(
        (err) => {
            console.log(err);
        }
    );
