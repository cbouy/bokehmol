export function combineSVGs(
  images: string[], width: number, height: number, maxMolsRow: number
): string {
    let grid = ''

    for (let i = 0; i < images.length; i++) {
      let row = Math.floor(i/maxMolsRow)
      let col = i % maxMolsRow
      grid += `<g id="molecule-${i}" transform="translate(${col*width},${row*height})">${images[i]}</g>`
    }

    const parentWidth = width * Math.min(maxMolsRow, images.length)
    const parentHeight = height * Math.ceil(images.length / maxMolsRow)
    return `<svg width="${parentWidth}" height="${parentHeight}"><g>${grid}</g></svg>`
}
