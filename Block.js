class Block{
  constructor(palette, x, y, dim, weights, rNum){
    this.colors = this.setColors(palette)
    this.x = x
    this.y = y
    this.dimension = dim
    this.weights = weights
  }

  drawBlock(x, y, dim){
    // block types
    const allowedBlocks = [ 
      () => this.drawSquare(this.x, this.y, this.dimension),
      () => this.drawVertical(this.x, this.y, this.dimension),
      () => this.drawHorizontal(this.x, this.y, this.dimension),
      () => this.drawDiagonalLeft(this.x, this.y, this.dimension),
      () => this.drawDiagonalRight(this.x, this.y, this.dimension),
      () => this.drawBothDiagonal(this.x, this.y, this.dimension),
      () => this.drawBothStraight(this.x, this.y, this.dimension),
      () => this.recurseBlock(this.x, this.y, this.dimension)
    ]
    
    // random(allowedBlocks)()
    this.selectBlock(allowedBlocks)
  }

  // selected rendered block based on weight
  selectBlock(blocks){

    // sum possible weights for each block
    let weightSum = 0;
    this.weights[0].forEach(weight => weightSum += weight)
    
    // generate random integer and add 1 to work with weight values
    const block = parseInt(random(weightSum)) + 1;

    // value for iterating over possible weights
    let w = 0;

    // final value for selected block
    let check = -1;

    // iterate over array
    for (let i = 0; i < this.weights[0].length; i++){
      w = this.weights[0][i] + w;
      if (block - w <= 0){
        check = i
        i = this.weights[0].length
      }
    }
    if (check == -1){
      this.recurseBlock(this.x, this.y, this.dimension)
    } else {
      blocks[check]()
    }
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
  recurseBlock(x, y, dim){
    // let blocks = []
    const newDim = dim/2
    for (let i = 0; i < 2; i++){
      for (let j = 0; j < 2; j++){
        let block = new Block(
          this.colors, 
          (i*newDim) + this.x, 
          (j*newDim) + this.y, 
          newDim, 
          this.weights.slice(1),
        )
        block.drawBlock()
        // blocks.push(block)
      }
    }
  }

  // single block wit no subdivisions
  drawSquare(x, y, dim){
    // const colors = this.setColors()
    fill(this.colors[0])
    rect(x, y, dim, dim)
  }

  // Single Straight Blocks
  drawVertical(x, y, dim){
    fill(this.colors[0])
    rect(x, y, dim/2, dim);
    fill(this.colors[1])
    rect(x+dim/2, y, dim/2, dim)
  }

  drawHorizontal(x, y, dim){
    fill(this.colors[0])
    rect(x, y, dim, dim/2);
    fill(this.colors[1])
    rect(x, y+dim/2, dim, dim/2)
  }

  // Single Diagonal Blocks
  drawDiagonalRight(x, y, dim){
    fill(this.colors[0])
    triangle(x, y, x+dim, y, x+dim, y+dim)
    fill(this.colors[1])
    triangle(x, y, x, y+dim, x+dim, y+dim)
  }

  drawDiagonalLeft(x, y, dim){
    fill(this.colors[0])
    triangle(x, y, x+dim, y, x, y+dim)
    fill(this.colors[1])
    triangle(x, y+dim, x+dim, y+dim, x+dim, y)
  }

  // Double Straight Block
  drawBothStraight(x, y, dim){
    fill(this.colors[0])
    rect(x, y, dim/2, dim/2);
    rect(x+dim/2, y+dim/2, dim/2, dim/2);
    fill(this.colors[1])
    rect(x+dim/2, y, dim/2, dim/2);
    rect(x, y+dim/2, dim/2, dim/2); 
  }

  // Double Diagonal Straight Block
  drawBothDiagonal(x, y, dim){
    fill(this.colors[0])
    triangle(x, y, x+dim, y, x+(dim/2), y+(dim/2))   
    triangle(x, y+dim, x+dim/2, y+dim/2, x+dim, y+dim)
    fill(this.colors[1])
    triangle(x, y, x+dim/2, y+dim/2, x, y+dim)
    triangle(x+dim, y, x+dim/2, y+dim/2, x+dim, y+dim)
  }
}