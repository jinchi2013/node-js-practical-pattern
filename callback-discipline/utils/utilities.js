/**
 * Created by CalvinJ on 11/27/2016.
 */
"use strict";
const urlParse = require('url').parse;
const slug = require('slug');
const path = require('path');

class urlToFilename {
    constructor (url) {
        this.parsedUrl = urlParse(url);
        this.urlPath = urlParse(url).path.split('/')
            .filter((component)=>{
                return component !== '';
            })
            .map((component)=>{
                return slug(component);
            })
            .join('/');
    }

    filename () {
        let filename = path.join(this.parsedUrl.hostname, this.urlPath);
        if(!path.extname(filename).match(/htm/)){
            filename +=".html";
        }
        return filename;
    }
}

export default urlToFilename;