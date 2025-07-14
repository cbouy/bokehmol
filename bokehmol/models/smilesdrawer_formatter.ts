import type * as p from "@bokehjs/core/properties"
import type {Dict} from "@bokehjs/core/types"
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
    mol_options: p.Property<Dict<unknown>>
    reaction_options: p.Property<Dict<unknown>>
  }
}
  
export interface SmilesDrawerFormatter extends SmilesDrawerFormatter.Attrs {}

export class SmilesDrawerFormatter extends BaseFormatter {
  declare properties: SmilesDrawerFormatter.Props
  protected SmiDrawer: smilesdrawer.SmiDrawer
  protected drawer?: smilesdrawer.SmiDrawer

  constructor(attrs?: Partial<SmilesDrawerFormatter.Attrs>) {
    super(attrs)
  }

  static override __module__ = "bokehmol.models.smilesdrawer_formatter"

  static {
    this.define<SmilesDrawerFormatter.Props>(({Str, Dict, Unknown}) => ({
      theme: [ Str, "light" ],
      background_colour: [ Str, "transparent" ],
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

  _setup_drawer(): smilesdrawer.SmiDrawer {
    // @ts-ignore
    const sd = new this.SmiDrawer(this.mol_options, this.reaction_options)
    this.drawer = sd
    return sd
  }

  override draw_svg(smiles: string): string {
    const sd = this.drawer ?? this._setup_drawer()
    const target = this._make_svg_element()
    sd.draw(smiles, target, this.theme)
    const svg = target.outerHTML
    target.remove()
    return svg
  }
}