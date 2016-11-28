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
        return [].slice.call(cheerio.load(body)('a'))
            .map((element) => {
                return this.getLinkUrl(currentUrl, element);
            }).bind(this)
            .filter((element) =>{
                return !!element;
            });
    }
}

export default utils;