let Map = require('./TileMap.js')

module.exports = class Game {
  constructor () {
    this.tilemap = new Map(5, 5)
  }
}
