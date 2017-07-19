

var tape = require('tape')

var u = require('../util')

  var state = {
    channels: {
      scuttlebutt: true,
      dat: true,
      ipfs: true,
      beaker: true
    },
    users: {
      "@EMovhfIrFk4NihAKnRNhrfRaqIhBv1Wj8pTxJNgvCCY=.ed25519": "domanic"
    }
  }

tape('is channel post', function (t) {

  var msg = require('./fixtures/channel-and-channel-mention.json')

  var n = u.isChannelPost(state, msg)
  console.log('n', n)
  t.ok(Array.isArray(n))
  t.equal(n.length, 1)
  n = n.shift()
  t.equal(n.author, msg.author)
  t.equal(n.target, 'scuttlebutt')

  var m = u.isChannelMention(state, msg)
  t.ok(Array.isArray(m))
  t.equal(m.length, 3)
  console.log(m)
  t.equal(m[0].author, msg.author)
  t.equal(m[0].target, 'dat')
  t.equal(m[1].author, msg.author)
  t.equal(m[1].target, 'ipfs')
  t.equal(m[2].author, msg.author)
  t.equal(m[2].target, 'beaker')

  t.end()

})

tape('user mention', function (t) {
  var msg = require('./fixtures/mention.json')
  console.log(msg)
  var m = u.isUserMention(state, msg)
  console.log(m)
  t.equal(m.length, 1)
  t.equal(m[0].author, msg.author) //substack
  t.equal(m[0].target, 'domanic') //the irc name for this user
  t.end()
})

