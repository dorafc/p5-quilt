class Quilt{
  constructor(rows, columns, dim, colors, colorWeights, allowTwoFabrics, hasGrad, gradColors, bWeights){
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

    // sets for rendering
    this.hasDrawn = new Set()
    this.canDraw = new Set()

    // seed block
    this.seedRow = parseInt(random(this.rows))
    this.seedColumn = parseInt(random(this.columns))
  }  

  generateGradientColors(colorA, colorB, rows){
    let gradient = []
    gradient.push(colorA)
    for (let i = 1; i < rows-1; i++){
      gradient.push(lerpColor(colorA, colorB, i/(this.rows-1)))
    }
    gradient.push(colorB)
    return gradient
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

        let block = new Block(
          rowPalette, 
          this.colorWeights,
          this.allowTwoFabrics,
          i*this.dimensions, 
          j*this.dimensions, 
          this.dimensions, 
          this.blockWeights
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

  convertToString(a, b){
    return '['+ new String(a) + ',' + new String(b) +']'
  }
}

