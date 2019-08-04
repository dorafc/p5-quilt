class Block{
  constructor(palette, cWeights, twoFab, x, y, dim, weights){
    this.univColor = palette      // universal color palette for the entire quilt
    this.twoFab = twoFab          // allow two fabrics of the same color per square
    this.x = x                    // x coordinate of the origin
    this.y = y                    // y coordinate of the origin
    this.dimension = dim          // dimension of the block
    this.weights = weights        // weights of how often a block will be selected
    this.colors = []              // block color palette
    this.cWeights = cWeights      // weights for the universal color palette
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

    this.colors = this.setColors(this.univColor, this.cWeights)
    this.selectBlock(allowedBlocks)
  }

  /*-- UTIL FUNCTIONS --*/
  // determine random number from weights
  getRandomWeight(weights){
    let weightSum = 0;
    weights.forEach(weight => weightSum += weight)

    return parseInt(random(weightSum)) + 1;
  }

    //  get a weighted value from the array
  getWeightedVal(weights, num){
    // selected index
    let check = -1;

    // current summed weight
    let numSum = 0;

    // iterate over array
    for (let i = 0; i < weights.length; i++){
      numSum = weights[i] + numSum;
      if (num - numSum <= 0){
        check = i
        i = weights.length
      }
    }
    return check;
  }

  // selected rendered block based on weight
  selectBlock(blocks){
    const block = this.getRandomWeight(this.weights[0])
    const check = this.getWeightedVal(this.weights[0], block)
    blocks[check]()
  }

  // determine block color pallete
  setColors(palette, weights){
    colorMode(HSB)
    let checkA = this.getRandomWeight(weights)
    let indexA = this.getWeightedVal(weights, checkA)
    let colorA = palette[indexA]
    
    let newWeights = weights.slice()
    // allow blocks to contain two fabrics of the same color
    if (!this.twoFab) {      
      newWeights[indexA] = 0;
    }
    
    let checkB = this.getRandomWeight(newWeights)
    let indexB = this.getWeightedVal(newWeights, checkB)
    let colorB = palette[indexB]

    if (colorA === colorB){
      if(random() > .5){
        colorB = color(hue(colorA), saturation(colorA), brightness(colorA)-10)
      } else {
        colorA = color(hue(colorB), saturation(colorB), brightness(colorB)-10)
      }  
    }
    
    return ([colorA, colorB])
  }

  // recursive block
  recurseBlock(x, y, dim){
    // let blocks = []
    const newDim = dim/2
    for (let i = 0; i < 2; i++){
      for (let j = 0; j < 2; j++){
        let block = new Block(
          this.univColor, 
          this.cWeights,
          this.twoFab,
          (i*newDim) + this.x, 
          (j*newDim) + this.y, 
          newDim, 
          this.weights.slice(1),
          this.rNum,
          this.totalRows,
          this.hasGrad,
          this.gradColor
        )
        block.drawBlock()
        // blocks.push(block)
      }
    }
  }

  // single block wit no subdivisions
  drawSquare(x, y, dim){
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