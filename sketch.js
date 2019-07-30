// dimensions of quilt
const xBlockNum = 12;
const yBlockNum = 10;

// dimensions of block
const blockDimension = 60;

// allowed palette, currently limited to two colors
const univPalette = ['#fa87a0', '#069c13', '#025949', '#ffda1f','#a163f2']
const colorWeights = [1,1,1,1,1]

// weights for each block type
// const weights = [[1,1,1,1,1,1,1,0]]
const weights = [[1,1,1,1,1,1,1,0],
                 [1,1,1,1,1,1,1,0],
                 [1,1,1,1,1,1,1,0]]

// ---------------

// all blocks
let quilt = [];

function setup() {
  createCanvas(xBlockNum*blockDimension, yBlockNum*blockDimension);
  stroke(0,0,0,30)
  for(let i = 0; i < xBlockNum; i++){
    quilt[i] = new Array();
    for (let j = 0; j < yBlockNum; j++){
      let block = new Block(
        univPalette, 
        colorWeights,
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