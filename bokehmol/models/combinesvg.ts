export function combineSVGs(
  images: string[], width: number, height: number, maxMolsRow: number
): string {
    let grid: string[] = []
    let maxWidth = width
    let maxHeight = height
    const parser = new DOMParser()

    for (let i = 0; i < images.length; i++) {
      let svg = images[i]
      let imgWidth = width
      let imgHeight = height

      // handle RDKit's edge case when width or height is set to -1
      if ((width < 0) || (height < 0)) {
        // parse directly from SVG element
        let el = parser.parseFromString(svg, 'image/svg+xml').firstChild
        if (width < 0) {
          // @ts-expect-error
          imgWidth = el.width.baseVal.value
          if (imgWidth > maxWidth) {
            maxWidth = imgWidth
          } else {
            imgWidth = maxWidth
          }
        }
        if (height < 0)
          // @ts-expect-error
          imgHeight = el.height.baseVal.value
          if (imgHeight > maxHeight) {
            maxHeight = imgHeight
          } else {
            imgHeight = maxHeight
          }
      }

      let x = imgWidth * (i % maxMolsRow)
      let y = imgHeight * Math.floor(i / maxMolsRow)
      let b64dump = btoa(svg)
      grid.push(
        `<image id="molecule-${i}" transform="translate(${x},${y})" href='data:image/svg+xml;base64,${b64dump}'></image>`
      )
    }

    const parentWidth = maxWidth * Math.min(maxMolsRow, images.length)
    const parentHeight = maxHeight * Math.ceil(images.length / maxMolsRow)
    return `<svg width="${parentWidth}" height="${parentHeight}">${grid.join("\n")}</svg>`
}
