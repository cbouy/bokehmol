import {CustomJSHover} from "@bokehjs/models/tools/inspectors/customjs_hover"
import type * as p from "@bokehjs/core/properties"
import {combineSVGs} from "./combinesvg"

export namespace BaseFormatter {
  export type Attrs = p.AttrsOf<Props>

  export type Props = CustomJSHover.Props & {
    width: p.Property<number>
    height: p.Property<number>
    mols_per_row: p.Property<number>
  }
}
  
export interface BaseFormatter extends BaseFormatter.Attrs {}

export class BaseFormatter extends CustomJSHover {
  declare properties: BaseFormatter.Props

  constructor(attrs?: Partial<BaseFormatter.Attrs>) {
    super(attrs)
  }

  static override __module__ = "bokehmol.models.base_formatter"

  static {
    this.define<BaseFormatter.Props>(({Int}) => ({
      width: [ Int, 160 ],
      height: [ Int, 120 ],
      mols_per_row: [ Int, 5 ],
    }))
  }

  makeSVGElement(): SVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink")
    svg.setAttributeNS(null, "width", "" + this.width)
    svg.setAttributeNS(null, "height", "" + this.height)
    return svg
  }

  draw_grid(smiles_array: string[]): string {
    const images: string[] = []
    smiles_array.forEach((smiles) => {
      let svg = this.draw_svg(smiles)
      images.push(svg)
    })
    return combineSVGs(images, this.width, this.height, this.mols_per_row) 
  }

  // @ts-expect-error
  draw_svg(smiles: string): string {
    const el = this.makeSVGElement()
    const svg = el.outerHTML
    el.remove()
    return svg
  }

  override format(value: any, format: string, special_vars: {[key: string]: unknown}): string {
    format; special_vars;
    return Array.isArray(value) ? this.draw_grid(value) : this.draw_svg(value)
  }

}