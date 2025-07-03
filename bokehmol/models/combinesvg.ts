export function combineSvgs(images: any[], width: number, height: number, maxMolsRow: number, backgroundColor: string = "transparent"): string {
    let combinedSvg = '';
    for(let i = 0; i < images.length; i++){
      let row = Math.floor(i/maxMolsRow)
      let col = i % maxMolsRow;
      
      combinedSvg += `<g id="molecule-${i}" transform="translate(${col*width},${row*height})">${images[i]}</g>`;
    }

    return '<svg width="' + width * Math.min(maxMolsRow, images.length) + '" height="' + (Math.ceil(images.length / maxMolsRow) * height) + '" style="background-color:' + backgroundColor + '">' +
              '<g>' +
                  combinedSvg +
              '</g>' +
            '</svg>';
}
