# ssb-irc

notify irc when something happens on ssb.

(not attached to IRC yet...)

## why irc?

take relavant ssb messages and let people on irc know.
I choose IRC because it's also mostly decentralized,
and all the hackers use it, but unlike email it's simple
and hasn't been co-opted by corporates.

## basic plan

* if an ssb channel corresponds to a irc channel, post ssb-viewer links to channel posts in the corresponding irc channel.
* if a ssb message mentions an irc channel (aka hashtag) post that to the irc channel
* if a ssb user is also on irc, irc message them when someone ssb mentions them.
* also, irc message users when someone follows them on ssb.

## names, etc

A ssb user might use a different name on irc, and channels might be different too.
to fix this, ssb-irc uses about messages. only users which the pub has a name for get notified.
same with channels, only channels the pub subscribe to get notified (and adding another property
on the subscribe means mapping to a different channel name is possible)

take relavant ssb messages and let people on irc know.
I choose IRC because it's also mostly decentralized,
and all the hackers use it, but unlike email it's simple
and hasn't been co-opted by corporates.

take relavant ssb messages and let people on irc know.
I choose IRC because it's also mostly decentralized,
and all the hackers use it, but unlike email it's simple
and hasn't been co-opted by corporates.

take relavant ssb messages and let people on irc know.
I choose IRC because it's also mostly decentralized,
and all the hackers use it, but unlike email it's simple
and hasn't been co-opted by corporates.

take relavant ssb messages and let people on irc know.
I choose IRC because it's also mostly decentralized,
and all the hackers use it, but unlike email it's simple
and hasn't been co-opted by corporates.

There are a bunch of matchers which return an array of objects like this:

```
{ author: '@EMovhfIrFk4NihAKnRNhrfRaqIhBv1Wj8pTxJNgvCCY=.ed25519',
  target: 'beaker',
  text: '...icate whatever they push. The same would be really useful for p2p music as well as maybe #dat #ipfs ...',
  id: '%gI8goB5F6FppchtnKQY+E1RLm7qOnMZo8z9q86LLCjQ=.sha256',
  type: 'channel' }
```

if the type is `channel` it gets posted in a irc channel publically,
if it's a user, it's posted as a direct message to them.

## config

`ssb-irc` supports the following configuration options

```
"irc": {
  //domain where your ssb-viewer is hosted.
  "viewer": <http://yourhost.com> || http://viewer.scuttlebot.io,
  "host": <irc_host> || "irc.freenode.net",
  "port:" <irc_port> || 6667,
  "name": <name_of_ircbot> || "ssbbot"
}
```

## more ideas

also give out ssb invites to people on irc (and set up notifications for them too, obviously)

## License

MIT

