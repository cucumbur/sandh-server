module.exports = class TileMap {
  constructor (width, height) {
    this.width = width
    this.height = height
    this.tiles = new Array(width)
    // Initialize map with 1s, the grass tile
    for (let i = 0; i < width; i++) {
      this.tiles[i] = Array.apply(null, Array(height)).map(Number.prototype.valueOf, 1)
    }
  }

  // toView: returns a 2D subarray of the map with the specified width and length
  // with origin x,y
  toView (x, y, width, height) {
    let view = new Array(width)
    // Initialize the subarray with zeros (aka the default tile)
    for (let i = 0; i < width; i++) {
      view[i] = Array.apply(null, Array(height)).map(Number.prototype.valueOf, 0)
    }

    // TODO: convert this to use a .map function
    for (let i = x; (i - x < width) && (i < this.width); i++) {
      for (let j = y; (j - y < height) && (j < this.height); j++) {
        view[i - x][j - y] = this.tiles[i][j]
      }
    }

    return view
  }
}
