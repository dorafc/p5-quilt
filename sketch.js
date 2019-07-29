// import Block from '/block.js'

// dimensions of quilt
const xBlockNum = 3;
const yBlockNum = 3;

// dimensions of block
const blockDimension = 250;

// allowed palette, currently limited to two colors
const univPalette = ['#f5abcc', '#30c93b']

// all blocks
let quilt = [];

// weights for each block type
const weights = [1,1,1,1,1,1,1]
// const weights = [1,0,0,5,5,0,0]
// const weights = [1,1,1,0,0,0,1]

function setup() {
  createCanvas(xBlockNum*blockDimension, yBlockNum*blockDimension);
  stroke(0,0,0,30)
  for(let i = 0; i < xBlockNum; i++){
    quilt[i] = new Array();
    for (let j = 0; j < yBlockNum; j++){
      let block = new Block(
        univPalette, 
        i*blockDimension, 
        j*blockDimension, 
        blockDimension, 
        weights
      )
      block.drawBlock()
      quilt[i].push(block)
    }
  }
}

function draw() {
  
}