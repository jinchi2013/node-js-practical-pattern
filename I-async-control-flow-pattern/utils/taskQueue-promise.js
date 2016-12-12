'use strict';

class TaskQueuePromise {
    constructor (concurrency) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }

    pushTask (task) {
        this.queue.push(task);
        this.next();
    }

    next () {
        while(this.running < this.concurrency && this.queue.length) {
            let task = this.queue.shift();
            task().then(()=>{
                this.running--;
                this.next();
            });
            this.running++;
        }
    }
}

export default TaskQueuePromise;
