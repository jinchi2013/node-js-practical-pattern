/**
 * Created by CalvinJ on 11/27/2016.
 */
"use strict";
const urlParse = require('url').parse;
const urlFormat = require('url').format;
const urlResolve = require('url').resolve;
const slug = require('slug');
const path = require('path');
const cheerio = require('cheerio'); //jquery lib

class utils {
    constructor () {}

    filename (url) {
        let parsedUrl = urlParse(url);
        let urlPath = urlParse(url).path.split('/')
            .filter((component)=>{
                return component !== '';
            })
            .map((component)=>{
                return slug(component);
            })
            .join('/');
        let filename = path.join(parsedUrl.hostname, urlPath);
        if(!path.extname(filename).match(/htm/)){
            filename +=".html";
        }
        return filename;
    }

    getLinkUrl (currentUrl, element) {
        let link = urlResolve(currentUrl, element.attribs.href || "");
        let parsedLink = urlParse(link);
        let currentParsedUrl = urlParse(currentUrl);
        if(parsedLink.hostname !== currentParsedUrl.hostname || !parsedLink.pathname) {
            return null;
        }
        return link;
    }

    getPageLinks (currentUrl, body) {
        return Array.slice.call(cheerio.load(body)('a'))
            .map((element) => {
                return this.getLinkUrl(currentUrl, element);
            }).bind(this)
            .filter((element) =>{
                return !!element;
            });
    }

    promisify (callbackBasedApi) {
        return function promisified() {
            let args = Array.slice.call(arguments);
            let promise = new Promise((resolve, reject)=>{
                args.push((err, result) => {
                    if(err) {
                        return reject(err);
                    }
                    if(arguments.length <= 2) {
                        resolve(result);
                    } else {
                        resolve(Array.slice.call(arguments, 1));
                    }
                });
                callbackBasedApi.apply(null, args);
            });
            return promise;
        };
    }
}

export default utils;