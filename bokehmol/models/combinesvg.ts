export function combineSvgs(images: any[], width: number, height: number, maxMolsRow: number, backgroundColor: string = "transparent"): string {
    let combinedSvg = '';
    for(let i = 0; i < images.length; i++){
      let row = Math.floor(i/maxMolsRow)
      let col = i % maxMolsRow;
      
      combinedSvg += `<g id="molecule-${i}" transform="translate(${col*width},${row*height})">${images[i]}</g>`;
    }
    let filler = images.length
    while(filler%maxMolsRow != 0){
      filler++
      let row = Math.floor(filler/maxMolsRow)
      let col = filler % maxMolsRow;
      combinedSvg += `<g id="filler_mol" transform="translate(${col*width},${row*height})"></g>`;
    }

    return '<svg width="' + width * maxMolsRow + '" height="' + (Math.ceil(images.length / maxMolsRow) * height) + '" style="background-color:' + backgroundColor + '">' +
              '<g>' +
                  combinedSvg +
              '</g>' +
            '</svg>';
}
