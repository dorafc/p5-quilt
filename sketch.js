// dimensions of quilt
const xBlockNum = 10;
const yBlockNum = 12;

// dimensions of block
const blockDimension = 60;

// allowed palette
const univPalette = ['#f5abcc', '#30c93b']

// all blocks
let quilt = [];

function setup() {
  createCanvas(xBlockNum*blockDimension, yBlockNum*blockDimension);
  stroke(0,0,0,30)
  for(let i = 0; i < xBlockNum; i++){
    quilt[i] = new Array();
    for (let j = 0; j < yBlockNum; j++){
      // test.drawBlock(i*blockDimension, j*blockDimension, blockDimension);
      let block = new Block(univPalette, i*blockDimension, j*blockDimension, blockDimension)
      block.drawBlock()
      quilt[i].push(block)
    }
  }
  console.log(quilt)
}

function draw() {
  
}

class Block{
  constructor(palette, x, y, dim){
    this.colors = this.setColors(palette)
    this.x = x
    this.y = y
    this.dimension = dim
  }

  drawBlock(x, y, dim){
    // block types
    const allowedBlocks = [ 
      () => this.drawSquare(),
      () => this.drawVertical(),
      () => this.drawHorizontal(),
      () => this.drawDiagonalLeft(),
      () => this.drawDiagonalRight(),
      () => this.drawBothDiagonal(),
      () => this.drawBothStraight()
    ]
    const blockNum = allowedBlocks.length
    
    random(allowedBlocks)()
  }

  // determine block color pallete
  setColors(palette){
    if (random() >= .5){
      return([palette[0], palette[1]])
    } else {
      return([palette[1], palette[0]])
    }
  }
  // single block wit no subdivisions
  drawSquare(){
    // const colors = this.setColors()
    fill(this.colors[0])
    rect(this.x, this.y, this.dimension, this.dimension)
  }

  // Single Straight Blocks
  drawVertical(){
    fill(this.colors[0])
    rect(this.x, this.y, this.dimension/2, this.dimension);
    fill(this.colors[1])
    rect(this.x+this.dimension/2, this.y, this.dimension/2, this.dimension)
  }

  drawHorizontal(){
    fill(this.colors[0])
    rect(this.x, this.y, this.dimension, this.dimension/2);
    fill(this.colors[1])
    rect(this.x, this.y+this.dimension/2, this.dimension, this.dimension/2)
  }

  // Single Diagonal Blocks
  drawDiagonalRight(){
    fill(this.colors[0])
    triangle(this.x, this.y, this.x+this.dimension, this.y, this.x+this.dimension, this.y+this.dimension)
    fill(this.colors[1])
    triangle(this.x, this.y, this.x, this.y+this.dimension, this.x+this.dimension, this.y+this.dimension)
  }

  drawDiagonalLeft(){
    fill(this.colors[0])
    triangle(this.x, this.y, this.x+this.dimension, this.y, this.x, this.y+this.dimension)
    fill(this.colors[1])
    triangle(this.x, this.y+this.dimension, this.x+this.dimension, this.y+this.dimension, this.x+this.dimension, this.y)
  }

  // Double Straight Block
  drawBothStraight(){
    fill(this.colors[0])
    rect(this.x, this.y, this.dimension/2, this.dimension/2);
    rect(this.x+this.dimension/2, this.y+this.dimension/2, this.dimension/2, this.dimension/2);
    fill(this.colors[1])
    rect(this.x+this.dimension/2, this.y, this.dimension/2, this.dimension/2);
    rect(this.x, this.y+this.dimension/2, this.dimension/2, this.dimension/2);
    
  }

  // Double Diagonal Straight Block
  drawBothDiagonal(){
    fill(this.colors[0])
    triangle(this.x, this.y, this.x+this.dimension, this.y, this.x+(this.dimension/2), this.y+(this.dimension/2))
    triangle(this.x, this.y+this.dimension, this.x+this.dimension/2, this.y+this.dimension/2, this.x+this.dimension, this.y+this.dimension)
    fill(this.colors[1])
    triangle(this.x, this.y, this.x+this.dimension/2, this.y+this.dimension/2, this.x, this.y+this.dimension)
    triangle(this.x+this.dimension, this.y, this.x+this.dimension/2, this.y+this.dimension/2, this.x+this.dimension, this.y+this.dimension)
  }
}