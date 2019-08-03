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
    this.hasGradient = true
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

  renderQuilt(){
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
          this.blockWeights,
          j,
          this.rows,
          this.hasGradient,
          this.gradient
        )
        block.drawBlock()
        this.blocks[i].push(block)
      }
    }
  }
}