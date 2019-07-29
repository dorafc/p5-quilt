class Block{
  constructor(palette, x, y, dim, weights){
    this.colors = this.setColors(palette)
    this.x = x
    this.y = y
    this.dimension = dim
    this.weights = weights;
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
    
    // random(allowedBlocks)()
    this.selectBlock(allowedBlocks)
  }

  // selected rendered block based on weight
  selectBlock(blocks){

    // sum possible weights for each block
    let weightSum = 0;
    this.weights.forEach(weight => weightSum += weight)

    // generate random integer and add 1 to work with weight values
    const block = parseInt(random(weightSum)) + 1;

    // value for iterating over possible weights
    let w = 0;

    // final value for selected block
    let check = 0;

    // iterate over array
    for (let i = 0; i < this.weights.length; i++){
      w = this.weights[i] + w;
      if (block - w <= 0){
        check = i
        i = this.weights.length
      }
    }

    blocks[check]()
  }

  // determine block color pallete
  setColors(palette){
    if (random() >= .5){
      return([palette[0], palette[1]])
    } else {
      return([palette[1], palette[0]])
    }
  }

  // recursive bloc
  recurseBlock(){
    
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