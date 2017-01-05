var io = require('socket.io')(7331)
var _ = require('lodash')

let Room = require('./lib/Room.js')
let Game = require('./lib/Game.js')
// let TileMap = require('./lib/TileMap.js')

let rooms = {}

// server event: connection
// when a user first connects to the socket
io.on('connection', function (socket) {
  console.log('a new socket connection has been made')
  io.emit('update number online', _.size(io.sockets.connected))

  // socket event: join room
  // when a player attempts to join a room
  socket.on('join room', function (data) {
    // cancel the join room attempt if the user is already in a room
    if (socket.room) {
      socket.emit('join room failure')
    } else {
      let username = data.username
      socket.name = username
      let roomName = data.roomName

      // create a new room if it does not already exist
      console.log(rooms)
      if (!rooms.hasOwnProperty(roomName)) {
        console.log('creating room ' + roomName)
        rooms[roomName] = new Room(roomName, rooms, io)
      }

      // attempt to join room
      let room = rooms[roomName]
      if (room && room.addUser(socket)) {
        socket.emit('join room success', {roomInfo: room.info(), username: username})
        socket.broadcast.to(roomName).emit('player joined', {username: username, roomInfo: room.info()})
      } else {
        socket.emit('join room failure')
      }
    }
  })

  // socket event: leave room
  // when a player leaves a room voluntarily
  socket.on('leave room', function () {
    if (socket.room === null) {
      console.log('a player tried to leave a room but they were not in a room')
    } else {
      socket.emit('left room')
      socket.room.removeUser(socket)
    }
  })

  // socket event: disconnect
  // when a player closes their browser or loses internet connection
  socket.on('disconnect', function () {
    if (socket.room) {
      socket.room.removeUser(socket)
      console.log(socket.name + ' disconnected')
    } else {
      console.log('a socket disconnected')
    }
    io.emit('update number online', _.size(io.sockets.connected)) // TODO: make this more robust and useful
  })

  // socket event: chat message
  // when a player submits a message in the chat
  socket.on('chat message', function (text) {
    console.log('recieved chat message') // TODO remove this log statement
    if (socket.room) {
      io.to(socket.room.name).emit('chat message', {name: socket.name, text: text})
    }
  })

  socket.on('start game', function () {
    if (socket.room) {
      console.log(socket.name + ' started the game in room ' + socket.room.name)
      io.to(socket.room.name).emit('start game')
      socket.room.game = new Game()
    }
  })

  socket.on('map update request', function () {
    if (socket.room) {
      socket.emit('map update', socket.room.game.tilemap.toView(0, 0, 10, 10))
    }
  })
})

console.log('s&h server started')
