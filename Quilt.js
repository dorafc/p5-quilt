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
    this.hasDrawn = new Set();
    this.canDraw = new Set()
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
        // block.drawBlock()
        this.blocks[i].push(block)
      }
    }

    // seed block
    const seedRow = parseInt(random(this.rows))
    const seedColumn = parseInt(random(this.columns))
    this.blocks[seedColumn][seedRow].drawBlock()
    this.hasDrawn.add(this.convertToString(seedColumn,seedRow))
    this.setToDraw(seedColumn, seedRow)
    this.drawNextBlock()
  }

  convertToString(a, b){
    return '['+ new String(a) + ',' + new String(b) +']'
  }

  // add indexs to the draw set
  setToDraw(col, row){
    if (!this.hasDrawn.has(this.convertToString(col, row-1)) && row-1 >= 0){
      this.canDraw.add(this.convertToString(col, row-1))
    }
    if (!this.hasDrawn.has(this.convertToString(col, row+1)) && row+1 <= this.rows-1){
      this.canDraw.add(this.convertToString(col, row+1))
    }
    if (!this.hasDrawn.has(this.convertToString(col+1, row)) && col+1 <= this.columns-1){
      this.canDraw.add(this.convertToString(col+1, row))
    }
    if (!this.hasDrawn.has(this.convertToString(col-1, row)) && col-1 >= 0){
      this.canDraw.add(this.convertToString(col-1, row))
    }
    
    this.drawNextBlock()
  }

  drawNextBlock(){
    let drawNext = this.canDraw.entries()

    for (let [next] of drawNext) {
      let [col, row] = eval(next)
      col = parseInt(col)
      row = parseInt(row)
      this.canDraw.delete(next)
      this.blocks[col][row].drawBlock()
      this.hasDrawn.add(next)
      this.setToDraw(col, row)
    }
  }

  

}

