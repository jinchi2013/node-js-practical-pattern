"use strict";

const Transform = require('stream').Transform;

class MyTransform  extends Transform {
    constructor (options, searchString, replaceString) {
        super(options);
        this.searchString = searchString;
        this.replaceString = replaceString;
        this.tailPiece = '';
    }

    _transform (chunk, encoding, callback) {
        let pieces = (this.tailPiece + chunk).split(this.searchString);
        let lastPiece = pieces[pieces.length - 1];
        let tailPieceLen = this.searchString.length - 1;

        this.tailPiece = lastPiece.slice(-tailPieceLen);
        pieces[pieces.length - 1] = lastPiece.slice(0, -tailPieceLen);

        this.push(pieces.join(this.replaceString));
        callback();
    }

    _flush (callback) {
        this.push(this.tailPiece);
        callback();
    }
}

module.exports = MyTransform;