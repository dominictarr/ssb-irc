var pull = require('pull-stream')
var ref = require('ssb-ref')
var hash = require('ssb-keys/util').hash
var markdown = require('ssb-markdown')

function isString (s) {
  return 'string' == typeof s
}

function update (state, msg) {
  if(msg.content.type === 'channel') {
    if(msg.content.subscribed)
      state.channels[msg.content.channel] = msg.content.irc || msg.content.channel
    else
      delete state.channels[msg.content.channel]
  }
  else if(msg.content.type === 'about' && ref.isFeed(msg.content.about) && (msg.content.name || msg.content.irc != null)) {
    state.users[msg.content.about] = msg.content.irc == null ? msg.content.name : msg.content.irc
  }
  return state
}

function init(sbot, id, cb) {
  var state = {users: {}, channels: {}}

  pull(
    sbot.createHistoryStream({id: id || sbot.id, live: true}),
    pull.drain(function (msg) {
      if(msg.sync)
        return cb && cb(null, state)
      state = update(state, msg.value)
    })
  )
  return state
}

function toKey(fn) {
  return function (state, msg) {
    var key
    if(msg.key) {
      key = msg.key
      msg = msg.value
    }
    else
      key = '%'+hash(JSON.stringify(msg, null, 2))
    return fn(state, msg, key)
  }
}

exports.isChannelPost = toKey(function isChannelPost (state, msg, key) {
  if(state.channels[msg.content.channel] && !msg.content.root) {
    var text = msg.content.text
    if(isString(text) && text) {
      text = text.split('\n')
      if(text.length > 1)
        text = text[0]
      else
        text = text[0]

      return [{
        author: msg.author,
        target: msg.content.channel,
        text: text.length > 100 ? text.substring(0, 97)+'...' : text,
        id: key,
        type: 'channel'
      }]
    }
  }
})

function uniq (a) {
  var b = []
  for(var i = 0; i < a.length; i++)
    if(!~b.indexOf(a[i])) b.push(a[i])
  return b
}

function getChannel(state, name) {
  name = name.replace(/^#/,'')
  return state.channels[name] === true ? name : state.channels[name]
}

function surrounding(text, match, length) {
  var i = Math.max(text.indexOf(match)-100, 0)
  return (i > 0 ? '...' : '') + text.substring(i, i+100) + (i + 100 < text.length ? '...' : '')
}

exports.isChannelMention = toKey(function (state, msg, key) {
  var text = msg.content.text
  if(isString(text) && text) {
    text = markdown.inline(text)
    if(!/(#\w+)/.test(text)) return []

    var m = uniq(text.match(/(#\w+)/g))
    return m.filter(function (name) {
      return getChannel(state, name)
    }).map(function (name) {
      return {
        author: msg.author,
        target: getChannel(state, name),
        text: surrounding(text, name, 100),
        id: key,
        type: 'channel'
      }
    })
  }
  return []
})

exports.isUserMention = toKey(function (state, msg, key) {
  var text = msg.content.text
  if(isString(text) && text && Array.isArray(msg.content.mentions)) {
    text = markdown.inline(text)
    return msg.content.mentions.filter(function (mention) {
      return state.users[mention.link]
    }).map(function (mention) {
        return {
          author: msg.author,
          target: state.users[mention.link],
          text: surrounding(markdown.inline(text), '@'+mention.name, 100),
          id: key,
          type: 'user'
        }
    })
  }
})

exports.isUserFollow = toKey(function (state, msg, key) {
  if(msg.content.type == 'contact' && msg.content.following && state.users[msg.content.contact])
    return {
      author: msg.author,
      target: state.users[msg.content.contact],
      text: 'followed you', //this will make sense since the notification will be a direct message
      id: key,
      type: 'user'
    }
})

if(!module.parent) {
  //this is just for testing...
  require('ssb-client')(function (err, sbot) {
    if(err) throw err
    var state = init(sbot, process.argv[2] || sbot.id)
    //XXX: properly persist state with a flumeview?
    setTimeout(function () {
      var tests = [
        exports.isChannelPost,
        exports.isChannelMention,
        exports.isUserMention,
        exports.isUserFollow
     ]

      pull(
        sbot.createLogStream({}),
        pull.drain(function (msg) {
          if(msg.sync) return
          var a = tests.reduce(function (found, test) {
            return found.concat(test(state, msg) || [])
          }, [])
          if(a.length) console.log('ARY', a)
        })
      )
    }, 5000)
  })
}

