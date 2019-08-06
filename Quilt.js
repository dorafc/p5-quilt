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
    // sets for rendering
    const hasDrawn = new Set()
    const canDraw = new Set()

    // seed block
    const seedRow = parseInt(random(this.rows))
    const seedColumn = parseInt(random(this.columns))

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
    canDraw.add(this.convertToString(seedColumn, seedRow))

    // get iterators of set to draw
    let drawNext = canDraw.entries()

    for (let [next] of drawNext) {
      let [col, row] = eval(next)
      // remove from canDraw set
      canDraw.delete(next)

      // get edges from neighbors
      this.blocks[col][row].setEdges([
        (row-1 >= 0) ? this.blocks[col][row-1].getBottomEdge() : -1,
        (col+1 <= this.columns-1) ? this.blocks[col+1][row].getLeftEdge() : -1,
        (row+1 <= this.rows-1) ? this.blocks[col][row+1].getTopEdge() : -1,
        (col-1 >= 0) ? this.blocks[col-1][row].getRightEdge() : -1
      ])
      // console.log(this.blocks[col][row].edges)

      // draw block
      this.blocks[col][row].drawBlock()
      hasDrawn.add(next)
      
      if (!hasDrawn.has(this.convertToString(col, row-1)) && row-1 >= 0){
        canDraw.add(this.convertToString(col, row-1))
      }
      if (!hasDrawn.has(this.convertToString(col, row+1)) && row+1 <= this.rows-1){
        canDraw.add(this.convertToString(col, row+1))
      }
      if (!hasDrawn.has(this.convertToString(col+1, row)) && col+1 <= this.columns-1){
        canDraw.add(this.convertToString(col+1, row))
      }
      if (!hasDrawn.has(this.convertToString(col-1, row)) && col-1 >= 0){
        canDraw.add(this.convertToString(col-1, row))
      }   
      // console.log(canDraw.size)     
    }
  }

  convertToString(a, b){
    return '['+ new String(a) + ',' + new String(b) +']'
  }
}

