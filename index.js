var ssb = require('./ssb')
var IRC = require('./irc')
//this should just wrap the stuff in util.js

exports.init = function (sbot, config) {
  //
  var n = 2
  //load current state
  var state = ssb.init(sbot, process.argv[2] || sbot.id, next)
  var irc = IRC(config, next)


  function notify (note) {
    irc.say(
      note.type == 'channel'
    ? IRC.toChannel(note.target)
    : note.target
    ,
    ssb.render(note, ssb.link(note.id, config))
    )
  }

  function next (err, state) {
    if(--n) return
    //XXX: properly persist state with a flumeview?

    //make sure we have joined every channel
    for(var k in state.channels) {
      var channel = state.channels[k]
      IRC.join(irc, channel)
    }

    //only notify about live posts.
    //this may cut out if the connection to IRC drops
    //though, since 

    pull(
      sbot.createLogStream({live: true}),
      pull.drain(function (msg) {
        if(msg.sync) return
        var a = tests.reduce(function (found, test) {
          return found.concat(exports.match(state, msg) || [])
        }, [])

        if(a.length)
          a.forEach(notify)
      })
    )
  }
}


