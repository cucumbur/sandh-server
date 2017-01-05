module.exports = class Room {
  constructor (name, roomList, io) {
    this.name = name
    this.players = []
    this.maxPlayers = 4
    this.game = null
    this.roomList = roomList
    this.io = io
  }

  // TODO: implement?
  disband () {
    // sanity check to make sure the room is empty
    if (this.players.length > 0) {
      console.console.warn('attempted to disband occupied room')
    } else {
      delete this.roomList[this.name]
      console.log('room ' + this.name + ' disbanded')
    }
  }

  // addUser: returns true if successful, false otherwise
  addUser (user) {
    if (this.players.length < this.maxPlayers) {
      if (this.players.findIndex(player => player.name === user.name) === -1) {
        this.players.push(user)
        user.join(this.name)
        user.room = this
        console.log('user ' + user.name + ' joined room ' + this.name)
        return true
      } else {
        console.log('user ' + user.name + ' tried to join room ' + this.name + ' but a player in that room already had that name')
        return false
      }
    } else {
      return false
    }
  }

  // removeUser: returns true if successful, false otherwise
  removeUser (user) {
    if (this.players.findIndex(player => player.name === user.name) === -1) {
      return false
    } else {
      this.players = this.players.filter(player => player.name !== user.name)
      user.leave(this.name)
      user.room = null
      console.log('user ' + user.name + ' left room ' + this.name)
      this.io.to(this.name).emit('player left', {roomInfo: this.info(), username: user.name})
      // Disband if the room is now empty
      if (this.players.length === 0) {
        this.disband()
      }

      return true
    }
  }

  // info: returns the room name and a list of player name strings
  info () {
    return {
      name: this.name,
      players: this.players.map(player => player.name)
    }
  }
}
