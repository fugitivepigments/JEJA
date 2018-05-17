const Nightmare = require('nightmare')
const assert = require('assert')

// describe('Load homepage', function() {
//   // Recommended: 5s locally, 10s to remote server, 30s from airplane ¯\_(ツ)_/¯
//   this.timeout('30s')
//
//   let nightmare = null
//   beforeEach(() => {
//     nightmare = new Nightmare()
//   })
// //load homepage test
//   describe('/ (Home Page)', () => {
//     it('should load without error', done => {
//       // your actual testing urls will likely be `http://localhost:port/path`
//       nightmare.goto('http://localhost:8080')
//         .end()
//         .then(function (result) { done() })
//         .catch(done)
//     })
//   })
// })
// //tests signup
// describe('Signup', function () {
//   this.timeout('30s')
//
//   let nightmare = null
//   beforeEach(() => {
//     // show true lets you see wth is actually happening :)
//     nightmare = new Nightmare({ show: true })
//   })
// //signup should fail with bad data
//   describe('sign up with bad data', () => {
//     it('should fail', done => {
//       nightmare
//       .goto('http://localhost:8080')
//       .on('page', (type, message) => {
//         if (type == 'alert') done()
//       })
//       .click('#signup-form')
//       .wait(2000)
//       .type('#name', 'notgonnawork')
//       .type('#email', 'drymemefan#art')
//       .type('#password', '')
//       .click('.submit-sign-up')
//       .wait(2000)
//       .end()
//       .then(function (result) { done() })
//       .catch(done)
//     })
//   })
//   //should pass with good data
//   describe('sign up with good data', () => {
//     it('should pass', done => {
//       nightmare
//       .goto('http://localhost:8080')
//       .on('page', (type, message) => {
//         if (type == 'alert') done()
//       })
//       .click('#signup-form')
//       .wait(2000)
//       .type('#name', 'ishouldwork')
//       .type('#email', 'ilovedrymemes@art.org')
//       .type('#password', 'validpa$$word')
//       .click('.submit-sign-up')
//       .wait(2000)
//       .end()
//       .then(function (result) { done() })
//       .catch(done)
//     })
//   })
// })

//tests login
describe('Login functionality', function () {
  this.timeout('30s')

  let nightmare = null
  beforeEach(() => {
    // show true lets you see wth is actually happening :)
    nightmare = new Nightmare({ show: true })
  })
//signup should fail with bad data
  describe('log in with bad data', () => {
    it('should fail', done => {
      nightmare
      .goto('http://localhost:8080')
      .on('page', (type, message) => {
        if (type == 'alert') done()
      })
      .click('#btn-login')
      .wait(2000)
      .type('#login-email', 'notgonnawork')
      .type('#login-password', '')
      .click('#signin')
      .wait(2000)
      .end()
      .then(function (result) { done() })
      .catch(done)
    })
  })
  //should pass with good data
  describe('log in with good data', () => {
    it('should pass', done => {
      nightmare
      .goto('http://localhost:8080')
      .on('page', (type, message) => {
        if (type == 'alert') done()
      })
      .click('#btn-login')
      .wait(2000)
      .type('#login-email', 'rusty@ferrari.com')
      .type('#login-password', 'jiminycricket!')
      .click('#signin')
      .wait(2000)
      .end()
      .then(function (result) { done() })
      .catch(done)
    })
  })
})

//tests clicking on artwork
describe('click artwork functionality', function () {
  this.timeout('30s')

  let nightmare = null
  beforeEach(() => {
    // show true lets you see wth is actually happening :)
    nightmare = new Nightmare({ show: true })
  })
//click should pass and take you to meme-editor page
  describe('log in with bad data', () => {
    it('should fail', done => {
      nightmare
      .goto('http://localhost:8080')
      .on('page', (type, message) => {
        if (type == 'alert') done()
      })
      .click('.artwork')
      .wait(5000)
      .end()
      .then(function (result) { done() })
      .catch(done)
    })
  })
  //then go to meme-editor page and edit meme
})
