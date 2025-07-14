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
  protected SmiDrawer: typeof smilesdrawer.SmiDrawer
  protected drawer: smilesdrawer.SmiDrawer

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
    this.onSmiDrawerReady(true, false, () => {
      // @ts-expect-error
      this.SmiDrawer = SmiDrawer
    })
  }

  onSmiDrawerReady(init: boolean, lib: boolean, callback: () => void): void {
    this.hasLoadedSmiDrawer(init, lib) ? callback() : setTimeout(() => {
      this.onSmiDrawerReady(init, lib, callback)
    }, 100)
  }

  hasLoadedSmiDrawer(init: boolean, lib: boolean): boolean {
    // @ts-expect-error
    return (init ? typeof SmiDrawer !== "undefined" : true)
        && (lib ? typeof this.SmiDrawer !== "undefined" : true)
  }

  override makeSVGElement(): SVGElement {
    const el = super.makeSVGElement()
    el.style.backgroundColor = this.background_colour
    return el
  }

  setupDrawer(): smilesdrawer.SmiDrawer {
    this.onSmiDrawerReady(true, true, () => {
      this.drawer = new this.SmiDrawer(this.mol_options, this.reaction_options)
    })
    return this.drawer
  }

  override draw_svg(smiles: string): string {
    const el = this.makeSVGElement()
    this.onSmiDrawerReady(true, true, () => {
      const sd = this.drawer ?? this.setupDrawer()
      sd.draw(smiles, el, this.theme)
    })
    const svg = el.outerHTML
    el.remove()
    return svg
  }
}