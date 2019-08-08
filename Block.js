class Block{
  constructor(palette, cWeights, twoFab, x, y, dim, weights, colors, neighbors){
    this.univColor = palette          // universal color palette for the entire quilt
    this.twoFab = twoFab              // allow two fabrics of the same color per square
    this.x = x                        // x coordinate of the origin
    this.y = y                        // y coordinate of the origin
    this.dimension = dim              // dimension of the block
    this.weights = weights            // weights of how often a block will be selected
    this.colors = colors              // block color palette
    this.cWeights = cWeights          // weights for the universal color palette
    this.edges = [0, 0, 0, 0]         // initialize with the edges of the block
    this.neighborColors = neighbors   // show if neighbors are related or not
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
    
    if (this.neighborColors){
      // this.colors = [this.univColor[0], this.univColor[2]]
      this.drawEdgeBlock()
    } else {
      // this.colors = this.setColors(this.univColor, this.cWeights)
      this.selectBlock(allowedBlocks)
    }
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
  /*-- /UTIL FUNCTIONS --*/

  /*-- GET FUNCTIONS--*/
  getTopEdge(){
    return this.edges[0]
  }

  getRightEdge(){
    return this.edges[1]
  }

  getBottomEdge(){
    return this.edges[2]
  }

  getLeftEdge(){
    return this.edges[3]
  }
  /*-- /GET FUNCTIONS--*/

  // select a block to draw based on the known edges
  drawEdgeBlock(){
    let allowedBlocks = [ 
      () => this.drawSquare(this.x, this.y, this.dimension),
      () => this.drawDiagonalLeft(this.x, this.y, this.dimension),
      () => this.drawDiagonalRight(this.x, this.y, this.dimension)
    ]
    let hasRendered = false;

    do {
      hasRendered = random(allowedBlocks)()
      // console.log(hasRendered)
    } while (!hasRendered)
  }

  // set egdes from neighbors
  setEdges(edges){
    this.edges = edges
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
          this.setColors(this.univColor, this.cWeights),
          this.neighborColors
        )
        block.drawBlock()
        // blocks.push(block)
      }
    }
  }

  // single block wit no subdivisions
  drawSquare(x, y, dim){
    let colorA
    if (this.neighborColors){
      let edgeSort = this.edges.slice()
      edgeSort = edgeSort.sort()

      if (typeof edgeSort[0] !== 'string'){
        colorA = random(this.colors)
      } else 
      if (typeof edgeSort[0] === 'string' && typeof edgeSort[1] !== 'string'){
        colorA = edgeSort[0]
      } else
      if (typeof edgeSort[0] === 'string' && edgeSort[0] === edgeSort[1]){
        colorA = edgeSort[0]
      } else {
        return false
      }
    } else {
      colorA = random(this.colors)
    }
    
    
    fill(colorA)
    rect(x, y, dim, dim)
    this.edges = [colorA,colorA,colorA,colorA]
    if (this.neighborColors){
      return true
    }
  }

  drawDiagonalLeft(x, y, dim){
    let edgeSort = this.edges.slice()
    edgeSort = edgeSort.sort()
    let colorA, colorB

    if (this.neighborColors){
      // no known edges
      if (typeof edgeSort[0] !== 'string'){
        colorA = random(this.colors).toString()
        colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
      } else

      // only one edge
      if (typeof edgeSort[0] === 'string' && typeof edgeSort[1] !== 'string'){
        if (typeof this.edges[0] === 'string' || typeof this.edges[3] === 'string'){
          colorA = edgeSort[0].toString()
          colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
        } else {
          colorB = edgeSort[0].toString()
          colorA = this.colors[this.colors.findIndex(e => e !== colorB)].toString()
        }
      } else
      
      // two edges are the same
      if ((edgeSort[0] === edgeSort[1]) && (this.edges[0] === this.edges[3]) && (typeof this.edges[0] === 'string')){
        colorA = edgeSort[0].toString()
        colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
      } else 
      if ((edgeSort[0] === edgeSort[1]) && (this.edges[1] === this.edges[2]) && (typeof this.edges[1] === 'string')){
        colorB = edgeSort[0].toString()
        colorA = this.colors[this.colors.findIndex(e => e !== colorB)].toString()
      } else

      // both edges are different
      if ((typeof this.edges[0] === 'string' && typeof this.edges[3] !== 'string') && (typeof this.edges[1] === 'string' && this.edges[1] !== this.edges[0])){
        colorA = this.edges[0].toString()
        colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
      } else
      if ((typeof this.edges[0] === 'string' && typeof this.edges[3] !== 'string') && (typeof this.edges[2] === 'string' && this.edges[2] !== this.edges[0])){
        colorA = this.edges[0].toString()
        colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
      } else
      if ((typeof this.edges[3] === 'string' && typeof this.edges[0] !== 'string') && (typeof this.edges[1] === 'string' && this.edges[1] !== this.edges[3])){
        colorA = this.edges[3].toString()
        colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
      } else
      if ((typeof this.edges[3] === 'string' && typeof this.edges[0] !== 'string') && (typeof this.edges[2] === 'string' && this.edges[2] !== this.edges[3])){
        colorA = this.edges[3].toString()
        colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
      }

      else {
        return false
      }
    } else {
      colorA = random(this.colors).toString()
      colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
    }
    
    fill(colorA)
    triangle(x, y, x+dim, y, x, y+dim)
    fill(colorB)
    triangle(x, y+dim, x+dim, y+dim, x+dim, y)
    this.edges = [colorA, colorB, colorB, colorA]

    if (this.neighborColors){
      return true;
    }
  }

    // Single Diagonal Blocks
    drawDiagonalRight(x, y, dim){
      let edgeSort = this.edges.slice()
      edgeSort = edgeSort.sort()
      let colorA, colorB
      
      if (this.neighborColors){
        // no known edges
        if (typeof edgeSort[0] !== 'string'){
          colorA = random(this.colors).toString()
          colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
        } else

        // one known edge
        if (typeof edgeSort[0] === 'string' && typeof edgeSort[1] !== 'string'){
          if (typeof this.edges[0] === 'string' || typeof this.edges[1] === 'string'){
            colorA = edgeSort[0].toString()
            colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
          } else {
            colorB = edgeSort[0].toString()
            colorA = this.colors[this.colors.findIndex(e => e !== colorB)].toString()
          }
        } else

        // both edges are the same
        if ((typeof this.edges[0] === 'string' && typeof this.edges[1] === 'string') && (this.edges[0] === this.edges[1])){
          colorA = this.edges[0].toString()
          colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
        } else 
        if ((typeof this.edges[2] === 'string' && typeof this.edges[3] === 'string') && (this.edges[2] === this.edges[3])){
          colorB = this.edges[2].toString()
          colorA = this.colors[this.colors.findIndex(e => e !== colorB)].toString()
        } else

        // both edges are different
        if ((typeof this.edges[0] === 'string' && typeof this.edges[1] !== 'string') && (typeof this.edges[2] === 'string' && this.edges[2] !== this.edges[0])){
          colorA = this.edges[0].toString()
          colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
        } else
        if ((typeof this.edges[0] === 'string' && typeof this.edges[1] !== 'string') && (typeof this.edges[3] === 'string' && this.edges[3] !== this.edges[0])){
          colorA = this.edges[0].toString()
          colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
        } else
        if ((typeof this.edges[1] === 'string' && typeof this.edges[0] !== 'string') && (typeof this.edges[2] === 'string' && this.edges[2] !== this.edges[1])){
          colorA = this.edges[1].toString()
          colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
        } else
        if ((typeof this.edges[1] === 'string' && typeof this.edges[0] !== 'string') && (typeof this.edges[3] === 'string' && this.edges[3] !== this.edges[1])){
          colorA = this.edges[1].toString()
          colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
        }

        else {
          return false
        }
      } else {
        colorA = random(this.colors).toString()
        colorB = this.colors[this.colors.findIndex(e => e !== colorA)].toString()
      }
    
      fill(colorA)
      triangle(x, y, x+dim, y, x+dim, y+dim)
      fill(colorB)
      triangle(x, y, x, y+dim, x+dim, y+dim)
      this.edges = [colorA, colorA, colorB, colorB]

      return true;
    }

  // Single Straight Blocks
  drawVertical(x, y, dim){
    const colorA = this.colors[0].toString()
    const colorB = this.colors[1].toString()
    fill(colorA)
    rect(x, y, dim/2, dim);
    fill(colorB)
    rect(x+dim/2, y, dim/2, dim)
    this.edges = [[colorA,colorB], colorB, [colorB, colorA], colorA]
  }

  drawHorizontal(x, y, dim){
    const colorA = this.colors[0].toString()
    const colorB = this.colors[1].toString()
    fill(colorA)
    rect(x, y, dim, dim/2);
    fill(colorB)
    rect(x, y+dim/2, dim, dim/2)
    this.edges = [colorA, [colorA, colorB], colorB, [colorB,colorA]]
  }



  // Double Straight Block
  drawBothStraight(x, y, dim){
    const colorA = this.colors[0].toString()
    const colorB = this.colors[1].toString()
    fill(colorA)
    rect(x, y, dim/2, dim/2);
    rect(x+dim/2, y+dim/2, dim/2, dim/2);
    fill(colorB)
    rect(x+dim/2, y, dim/2, dim/2);
    rect(x, y+dim/2, dim/2, dim/2); 
    this.edges = [[colorA, colorB], [colorB, colorA], [colorA, colorB], [colorB,colorA]]
  }

  // Double Diagonal Straight Block
  drawBothDiagonal(x, y, dim){
    const colorA = this.colors[0].toString()
    const colorB = this.colors[1].toString()
    fill(colorA)
    triangle(x, y, x+dim, y, x+(dim/2), y+(dim/2))   
    triangle(x, y+dim, x+dim/2, y+dim/2, x+dim, y+dim)
    fill(colorB)
    triangle(x, y, x+dim/2, y+dim/2, x, y+dim)
    triangle(x+dim, y, x+dim/2, y+dim/2, x+dim, y+dim)
    this.edges = [colorA, colorB, colorA, colorB]
  }
}