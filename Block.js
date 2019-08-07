class Block{
  constructor(palette, cWeights, twoFab, x, y, dim, weights, colors){
    this.univColor = palette      // universal color palette for the entire quilt
    this.twoFab = twoFab          // allow two fabrics of the same color per square
    this.x = x                    // x coordinate of the origin
    this.y = y                    // y coordinate of the origin
    this.dimension = dim          // dimension of the block
    this.weights = weights        // weights of how often a block will be selected
    this.colors = colors              // block color palette
    this.cWeights = cWeights      // weights for the universal color palette
    this.edges = [0, 0, 0, 0]     // initialize with the edges of the block
    this.neighborColors = false;
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
    let edgeSort = this.edges.slice()
    edgeSort.sort()
    let allowedBlocks = [];
    
    // first block, any edges
    if (this.edges.every(e => e == 0 || e == -1)){
      console.log('no edges')
      allowedBlocks = [ 
        () => this.drawSquare(this.x, this.y, this.dimension),
        // () => this.drawVertical(this.x, this.y, this.dimension),
        // () => this.drawHorizontal(this.x, this.y, this.dimension),
        () => this.drawDiagonalLeft(this.x, this.y, this.dimension),
        () => this.drawDiagonalRight(this.x, this.y, this.dimension),
        // () => this.drawBothDiagonal(this.x, this.y, this.dimension),
        // () => this.drawBothStraight(this.x, this.y, this.dimension),
      ]
      allowedBlocks[parseInt(random(allowedBlocks.length))]()
    } else
    // one solid color
    if ((typeof edgeSort[0] === 'string') && (typeof edgeSort[1] === 'number') && (typeof edgeSort[3] === 'number')){
      console.log('one solid color')
      console.log(this.edges, this.colors)
      if (edgeSort[0] !== this.colors[0]){
        let newColors = [this.colors[1], this.colors[0]]
        this.colors = newColors
      }
      allowedBlocks = [ 
        () => this.drawSquare(this.x, this.y, this.dimension),
        // () => this.drawVertical(this.x, this.y, this.dimension),
        // () => this.drawHorizontal(this.x, this.y, this.dimension),
        () => this.drawDiagonalLeft(this.x, this.y, this.dimension),
        () => this.drawDiagonalRight(this.x, this.y, this.dimension),
        // () => this.drawBothStraight(this.x, this.y, this.dimension),
      ]
      allowedBlocks[parseInt(random(allowedBlocks.length))]()
    } else 
    // one dual color
    if ((typeof edgeSort[0] === 'object') && (typeof edgeSort[1] === 'number') && (typeof edgeSort[3] === 'number')){
      // console.log('one dual color')
      allowedBlocks = [ 
        // () => this.drawVertical(this.x, this.y, this.dimension),
        // () => this.drawHorizontal(this.x, this.y, this.dimension),
        // () => this.drawBothStraight(this.x, this.y, this.dimension),
      ]
      allowedBlocks[parseInt(random(allowedBlocks.length))]()
    } else 
    // two solid colors
    if ((typeof edgeSort[0] === 'string') && (typeof edgeSort[1] === 'string')){
      if (edgeSort[0] === edgeSort[1]){
        console.log('two solid colors: SAME')
        if (edgeSort[0] !== this.colors[0]){
          let newColors = [this.colors[1], this.colors[0]]
          this.colors = newColors
        }
        allowedBlocks = [ 
          () => this.drawSquare(this.x, this.y, this.dimension),
          () => this.drawDiagonalLeft(this.x, this.y, this.dimension),
          () => this.drawDiagonalRight(this.x, this.y, this.dimension),
        ]
        allowedBlocks[parseInt(random(allowedBlocks.length))]()
      } else {
        console.log('two solid colors: DIFF')
        // console.log(this.colors, [edgeSort[0], edgeSort[1]])
        this.colors = [edgeSort[0], edgeSort[1]]
        allowedBlocks = [ 
          () => this.drawDiagonalLeft(this.x, this.y, this.dimension),
          () => this.drawDiagonalRight(this.x, this.y, this.dimension),
          // () => this.drawBothDiagonal(this.x, this.y, this.dimension),
        ]
        allowedBlocks[parseInt(random(allowedBlocks.length))]()
      }
    } else 
    // two dual colors
    if ((typeof edgeSort[0] === 'object') && (typeof edgeSort[1] === 'object')){
      if (edgeSort[0][0] === edgeSort[1][0]){
        // console.log('two dual colors: SAME')
        allowedBlocks = [ 
          // () => this.drawBothStraight(this.x, this.y, this.dimension),
        ]
        allowedBlocks[parseInt(random(allowedBlocks.length))]()
      } else {
        // console.log('two dual colors: DIFF')
        allowedBlocks = [ 
          // () => this.drawBothStraight(this.x, this.y, this.dimension),
        ]
        allowedBlocks[parseInt(random(allowedBlocks.length))]()
      }
    } else 
    // one solid, one dual
    if ((typeof edgeSort[0] === 'string' && typeof edgeSort[1] === 'object') || (typeof edgeSort[0] === 'object' && typeof edgeSort[1] === 'string')){
      // console.log('both types')
      allowedBlocks = [ 
        () => this.drawVertical(this.x, this.y, this.dimension),
        () => this.drawHorizontal(this.x, this.y, this.dimension)
      ]
      allowedBlocks[parseInt(random(allowedBlocks.length))]()
    } else {
      console.log(edgeSort)
      console.log("INVALID BLOCK")
    }
    // console.log(this.colors)
    // console.log(this.edges)    
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
          this.setColors(this.univColor, this.cWeights)
        )
        block.drawBlock()
        // blocks.push(block)
      }
    }
  }

  // single block wit no subdivisions
  drawSquare(x, y, dim){
    const color = this.colors[0]
    fill(color)
    rect(x, y, dim, dim)
    this.edges = [color,color,color,color]
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

  // Single Diagonal Blocks
  drawDiagonalRight(x, y, dim){
    const colorA = this.colors[0].toString()
    const colorB = this.colors[1].toString()
    fill(colorA)
    triangle(x, y, x+dim, y, x+dim, y+dim)
    fill(colorB)
    triangle(x, y, x, y+dim, x+dim, y+dim)
    this.edges = [colorA, colorA, colorB, colorB]
  }

  drawDiagonalLeft(x, y, dim){
    const colorA = this.colors[0].toString()
    const colorB = this.colors[1].toString()
    fill(colorA)
    triangle(x, y, x+dim, y, x, y+dim)
    fill(this.colors[1])
    triangle(x, y+dim, x+dim, y+dim, x+dim, y)
    this.edges = [colorA, colorB, colorB, colorA]
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