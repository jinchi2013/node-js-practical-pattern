/**
 * Created by chi on 8/4/16.
 */
'use strict';
const fs = require('fs');

function stats(file){
    return new Promise(
        (resolve,  reject)=>{
            fs.stat(file, (err, data)=>{
                if(err){
                    return reject (err)
                }
                resolve(data)
            })
        }
    )
}
Promise.all([stats('file1'), stats('file2'), stats('file3')]).then(
    (data)=>{
        return console.log(data)
    }
).catch(
    (err)=>{
        return console.log(err)
    }
);