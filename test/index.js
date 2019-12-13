const { urlParser } = require('../index.js');
const should = require('chai').should();

// Run tests on urlParser  
describe('Test urlParser', function () {
    it('Should parse URL with single part (no slash) and no parameters', function () {
        let hash = urlParser(':version', '6');
        hash.should.be.deep.equal({
            version: '6'
        });
    });

    it('Should parse URL with a single part and no parameters', function () {
        let hash = urlParser('/:version', '/6');
        hash.should.be.deep.equal({
            version: '6'
        });
    });

    it('Should parse URL with a single part and multiple parameters', function () {
        let hash = urlParser('/:version', '/6?sort=desc&limit=10&test=abcd');
        hash.should.be.deep.equal({
            version: '6',
            sort: 'desc',
            limit: '10',
            test: 'abcd'
        });
    });

    it('Should parse URL with multiple parts no parameters', function () {
        let hash = urlParser('/:version/api/:collection/:id', '/6/api/listings/3');
        hash.should.be.deep.equal({
            version: '6',
            collection: 'listings',
            id: '3'
        });
    });

    it('Should parse URL with multiple parts and a single parameter', function () {
        let hash = urlParser('/:version/api/:collection/:id', '/6/api/listings/3?sort=desc');
        hash.should.be.deep.equal({
            version: '6',
            collection: 'listings',
            id: '3',
            sort: 'desc'
        });
    });

    it('Should parse URL with multiple parts (no initial slash) and multiple parameters', function () {
        let hash = urlParser(':version/api/:collection/:id', '6/api/listings/3?sort=desc&limit=10');
        hash.should.be.deep.equal({
            version: '6',
            collection: 'listings',
            id: '3',
            sort: 'desc',
            limit: '10'
        });
    });

    it('Should parse URL with multiple parts and multiple parameters', function () {
        let hash = urlParser('/:version/api/:collection/:id', '/6/api/listings/3?sort=desc&limit=10');
        hash.should.be.deep.equal({
            version: '6',
            collection: 'listings',
            id: '3',
            sort: 'desc',
            limit: '10'
        });
    });

    it('Should parse URL with parameters only', function () {
        let hash = urlParser('/', '/?sort=desc&limit=10');
        hash.should.be.deep.equal({
            sort: 'desc',
            limit: '10'
        });
    });    

    it('Should fail when passing empty format string', function () {
        (function() {
            urlParser('', '/6/api/listings/3?sort=desc&limit=10')
        }).should.throw('You must provide a format string');
    });

    it('Should fail when passing empty URL string', function () {
        (function() {
            urlParser('/:version/api/:collection/:id', '')
        }).should.throw('You must provide a URL');
    });

    it('Should fail when passing URL with different parts count', function () {
        (function() {
            urlParser('/:version/api/:collection/:id', '/6/listings/3?sort=desc&limit=10')
        }).should.throw('The URL does not match the format string');
    });
});

