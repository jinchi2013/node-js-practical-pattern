const fs = require('fs')

const cache = {}

function consistentReadAsync(filename, callback) {
  if(cache[filename]) {
    // this make sure consistentReadAsync is fully asynchronous
    // process.nextTick push the callback to the last of the call stack
    process.nextTick( ()=>{
        callback(cache[filename])
    })
  } else {
    fs.readFile(filename, 'utf8', (err, data)=>{
      cache[filename] = data
      callback(data)
    })
  }
}

function createFileReader(filename) {
  const listeners = []
  consistentReadAsync(filename, (value)=>{
    listeners.forEach((listener)=>{
      listener(value)
    })
  })

  return {
    onDataReady: function(listener) {
      listeners.push(listener)
    }
  }
}


const reader1 = createFileReader('data.txt')
// createFileReader is an asynchronous function
// the callback execuate in the later order of the call stack

// the onDataReady listener registration process is synchronous,
// which will be execuating before the reading data actually available
reader1.onDataReady( (data)=>{
  console.log(`First call data: ${data}`)

  const reader2 = createFileReader('data.txt')

  reader2.onDataReady( (data)=>{
    console.log(`Second call data: ${data}`)
  })
})
