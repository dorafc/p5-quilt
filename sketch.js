// dimensions of quilt
const colBlockNum = 8; //columns
const rowBlockNum = 10; //rows

// dimensions of block
const blockDimension = 80;

// allowed palette, currently limited to two colors
const univPalette = ['#fa87a0', '#069c13', '#025949', '#ffda1f','#a163f2', '#4d0c70', '#cccccc', '#c0ffee']
const colorWeights = [1,1,1,10,1,0,0]
const allowTwoFabrics = false;

// gradient info
const hasGradient = false;
const gradientColors = [3, '#333a33']

// weights for each block type
const weights = [[1,1,1,1,1,1,1,0],
                 [1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,0]]

// colors determined by neighbors
const neighborColors = true;

let quiltObj;

// ---------------

function setup() {
  frameRate(24)
  createCanvas(colBlockNum*blockDimension, rowBlockNum*blockDimension);
  // background('red')
  
  stroke(0,0,0,30)

  quiltObj = new Quilt(
    rowBlockNum, 
    colBlockNum, 
    blockDimension, 
    univPalette,
    colorWeights,
    allowTwoFabrics,
    hasGradient,
    gradientColors,
    weights,
    neighborColors
  )
  
  quiltObj.initQuilt()
  // quiltObj.renderBlock()
  // quiltObj.renderBlock()
}

function draw() {
  // quiltObj.initQuilt()
  quiltObj.renderBlock()
}