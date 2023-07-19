import * as p from "core/properties"
import {BaseFormatter} from "./base_formatter"

declare namespace smilesdrawer {
  class SmiDrawer {
    constructor(moleculeOptions: object, reactionOptions: object)
    draw(smiles: string, target: SVGElement, theme?: string): void
  }
}

export namespace SmilesDrawerFormatter {
  export type Attrs = p.AttrsOf<Props>

  export type Props = BaseFormatter.Props & {    
    theme: p.Property<string>
    background_colour: p.Property<string>
    mol_options: p.Property<{[key: string]: unknown}>
    reaction_options: p.Property<{[key: string]: unknown}>
  }
}
  
export interface SmilesDrawerFormatter extends SmilesDrawerFormatter.Attrs {}

export class SmilesDrawerFormatter extends BaseFormatter {
  declare properties: SmilesDrawerFormatter.Props
  protected SmiDrawer: smilesdrawer.SmiDrawer

  constructor(attrs?: Partial<SmilesDrawerFormatter.Attrs>) {
    super(attrs)
  }

  static {
    this.define<SmilesDrawerFormatter.Props>(({String, Dict, Unknown}) => ({
      theme: [ String, "light" ],
      background_colour: [ String, "transparent" ],
      mol_options: [ Dict(Unknown), {} ],
      reaction_options: [ Dict(Unknown), {} ],
    }))
  }

  override initialize(): void {
    super.initialize()
    // @ts-ignore
    this.SmiDrawer = SmiDrawer
  }

  _make_svg_element(): SVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink")
    svg.setAttributeNS(null, "width", "" + this.width)
    svg.setAttributeNS(null, "height", "" + this.height)
    svg.style.backgroundColor = this.background_colour
    return svg
  }

  override draw_svg(smiles: string): string {
    const target = this._make_svg_element()
    // @ts-ignore
    const sd = new this.SmiDrawer(this.mol_options, this.reaction_options)
    sd.draw(smiles, target, this.theme)
    const svg = target.outerHTML
    target.remove()
    return svg
  }
}