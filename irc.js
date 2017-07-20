var IRC = module.exports = function (config, cb) {
  var IRC = require('node-irc')
  var conf = config.irc || {}
  var irc = new IRC(
    conf.host || 'irc.freenode.net',
    conf.port || 6667,
    conf.name || 'ssbbot'
  )
  ;(function connect() {
    irc.connect()
    irc.client.on('error', reconnect)
    irc.client.on('close', reconnect)
    var retry = false
    function reconnect () {
      if(retry) return
      retry = true
      setTimeout(connect, 10e3)
    }
  })
  irc.on('ready', cb)
  irc.on('error', function () {

  })
  return irc
}

IRC.toChannel = function (channel) {
  return channel[0] == '#' ? channel : '#'+channel
}

//join if not already joined...
IRC.join = function (irc, channel) {
  if(!irc.channels) irc.channels = {}
  if(!irc.channels[channel]) {
    irc.channels[channel] = true
    irc.join(IRC.toChannel(channel))
  }
}

IRC.channel = function (irc, channel, message) {
  IRC.join(irc, channel)
  irc.say(IRC.toChannel(channel), message)
}

IRC.private = function (irc, nick, message) {
  irc.say(nick, message)
}


//if(!module.parent) {
//  var ssb = require('./ssb')
//  var irc = IRC({}, function (err) {
//    var note = {
//      author: 'dominic',
//      target: 'domanic',
//      text: 'test 1 2 3, @domanic',
//      id: '%v6y1c1VYXthYbNYh0RqmXfC18HyhHnozDN3ZhrWLThU=.sha256'
//    }
//    var config = {}
//
//    function notify (note) {
//      irc.say(
//        note.type == 'channel'
//      ? IRC.toChannel(note.target)
//      : note.target
//      ,
//      ssb.render(note, ssb.link(note.id, config))
//      )
//    }
//
//    notify(note)
//  })
//}
//



