// dimensions of quilt
const colBlockNum = 50; //columns
const rowBlockNum = 50; //rows

// dimensions of block
const blockDimension = 80;

// allowed palette, currently limited to two colors
const univPalette = ['#fa87a0', '#069c13', '#025949', '#ffda1f','#a163f2', '#4d0c70', '#cccccc']
const colorWeights = [1,1,1,5000,1,1,0]
const allowTwoFabrics = true;

// gradient info
const hasGradient = true;
const gradientColors = [3, '#333a33']

// weights for each block type
const weights = [[1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,0]]

// ---------------

// all blocks
let quilt = [];

function setup() {
  frameRate(5)
  createCanvas(colBlockNum*blockDimension, rowBlockNum*blockDimension);
  // stroke(0,0,0,30)
  // for(let i = 0; i < colBlockNum; i++){
  //   quilt[i] = new Array();
  //   for (let j = 0; j < rowBlockNum; j++){
  //     let block = new Block(
  //       univPalette, 
  //       colorWeights,
  //       allowTwoFabrics,
  //       i*blockDimension, 
  //       j*blockDimension, 
  //       blockDimension, 
  //       weights,
  //       j,
  //       rowBlockNum,
  //       hasGradient,
  //       gradientColors
  //     )
  //     block.drawBlock()
  //     quilt[i].push(block)
  //   }
  // }
}

function draw() {
  background(255)
  // stroke(0,0,0,30)
  noStroke()
  for(let i = 0; i < colBlockNum; i++){
    quilt[i] = new Array();
    for (let j = 0; j < rowBlockNum; j++){
      let block = new Block(
        univPalette, 
        colorWeights,
        allowTwoFabrics,
        i*blockDimension, 
        j*blockDimension, 
        blockDimension, 
        weights,
        j,
        rowBlockNum,
        hasGradient,
        gradientColors
      )
      block.drawBlock()
      quilt[i].push(block)
    }
  }
}