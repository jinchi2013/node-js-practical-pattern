/**
 * Created by CalvinJ on 11/28/2016.
 */
"use strict";

class TaskQueue {
    constructor (concurrency) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }

    pushTask (task){
        this.queue.push(task);
        this.next();
    }

    next () {
        while(this.running < this.concurrency && this.queue.length) {
            let task = this.queue.shift();
            task((err)=>{
                this.running--;
                this.next();
            });
            this.running++;
        }
    }
}

export default TaskQueue;