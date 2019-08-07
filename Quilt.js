class Quilt{
  constructor(rows, columns, dim, colors, colorWeights, allowTwoFabrics, hasGrad, gradColors, bWeights, neighborColors){
    // dimensions
    this.rows = rows
    this.columns = columns
    this.dimensions = dim

    // colors
    this.palette = colors
    this.colorWeights = colorWeights
    this.allowTwoFabrics = allowTwoFabrics

    //gradient info
    this.hasGradient = hasGrad
    this.gradientColors = gradColors
    if (this.hasGradient) {
      this.gradient = this.generateGradientColors(
        color(this.palette[this.gradientColors[0]]), 
        color(this.gradientColors[1]), 
        this.rows
      )
    }

    // block options
    this.blockWeights = bWeights

    // blocks
    this.blocks = []

    // pick blocks based on neighboring colors
    this.neighborColors = neighborColors

    // sets for rendering
    this.hasDrawn = new Set()
    this.canDraw = new Set()

    // seed block
    this.seedRow = parseInt(random(this.rows))
    this.seedColumn = parseInt(random(this.columns))
  }  

  /*-- UTIL FUNCTIONS --*/
  // determine random number from weights
  getRandomWeight(weights){
    let weightSum = 0;
    weights.forEach(weight => weightSum += weight)

    return parseInt(random(weightSum)) + 1;
  }

  // get a weighted value from the array
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

  // converts an array to an array-esque string
  convertToString(a, b){
    return '['+ new String(a) + ',' + new String(b) +']'
  }
  /*-- /UTIL FUNCTIONS --*/

  // generate gradient
  generateGradientColors(colorA, colorB, rows){
    let gradient = []
    gradient.push(colorA)
    for (let i = 1; i < rows-1; i++){
      gradient.push(lerpColor(colorA, colorB, i/(this.rows-1)))
    }
    gradient.push(colorB)
    return gradient
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

  initQuilt(){

    for(let i = 0; i < this.columns; i++){
      this.blocks[i] = new Array();

      for (let j = 0; j < this.rows; j++){

        // update gradient color
        let rowPalette = this.palette.slice();
        if (this.hasGradient){
          rowPalette[this.gradientColors[0]] = this.gradient[j]
        }

        // generate color palette for the block
        let colors = []
        if (this.neighborColors){
          colors = [this.palette[0], this.palette[2]]
        } else {
          colors = this.setColors(this.palette, this.colorWeights)
        }

        let block = new Block(
          rowPalette, 
          this.colorWeights,
          this.allowTwoFabrics,
          i*this.dimensions, 
          j*this.dimensions, 
          this.dimensions, 
          this.blockWeights,
          colors
        )
        this.blocks[i].push(block)
      }
    }

    // add seed block to set of blocks to draw
    if (this.hasDrawn.size === 0){
      this.canDraw.add(this.convertToString(this.seedColumn, this.seedRow))
    }
    

    
  }

  renderBlock(){
    // get iterators of set to draw
    // let drawNext = this.canDraw.entries()
    let drawNext = this.canDraw.values()

    // for (let [next] of drawNext) {
    let next = drawNext.next().value
    if (next){
      let [col, row] = eval(next)
      
      // remove from canDraw set
      this.canDraw.delete(next)

      // // get edges from neighbors
      this.blocks[col][row].setEdges([
        (row-1 >= 0) ? this.blocks[col][row-1].getBottomEdge() : -1,
        (col+1 < this.columns) ? this.blocks[col+1][row].getLeftEdge() : -1,
        (row+1 < this.rows) ? this.blocks[col][row+1].getTopEdge() : -1,
        (col-1 >= 0) ? this.blocks[col-1][row].getRightEdge() : -1
      ])
      // // draw block
      this.blocks[col][row].drawBlock()
      this.hasDrawn.add(next)
      
      if (!this.hasDrawn.has(this.convertToString(col, row-1)) && row-1 >= 0){
        this.canDraw.add(this.convertToString(col, row-1))
      }
      if (!this.hasDrawn.has(this.convertToString(col, row+1)) && row+1 < this.rows){
        this.canDraw.add(this.convertToString(col, row+1))
      }
      if (!this.hasDrawn.has(this.convertToString(col+1, row)) && col+1 < this.columns){
        this.canDraw.add(this.convertToString(col+1, row))
      }
      if (!this.hasDrawn.has(this.convertToString(col-1, row)) && col-1 >= 0){
        this.canDraw.add(this.convertToString(col-1, row))
      }
    }
  }
}

