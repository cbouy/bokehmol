import type * as p from "@bokehjs/core/properties"
import type {Dict} from "@bokehjs/core/types"
import type {RDKitModule} from "@rdkit/rdkit"
import {BaseFormatter} from "./base_formatter"


export namespace RDKitFormatter {
  export type Attrs = p.AttrsOf<Props>

  export type Props = BaseFormatter.Props & {    
    prefer_coordgen: p.Property<boolean>
    remove_hs: p.Property<boolean>
    sanitize: p.Property<boolean>
    kekulize: p.Property<boolean>
    draw_options: p.Property<Dict<unknown>>
  }
}
  
export interface RDKitFormatter extends RDKitFormatter.Attrs {}

export class RDKitFormatter extends BaseFormatter {
  declare properties: RDKitFormatter.Props
  protected RDKitModule: RDKitModule
  protected json_draw_opts?: string
  protected json_mol_opts?: string

  constructor(attrs?: Partial<RDKitFormatter.Attrs>) {
    super(attrs)
  }

  static override __module__ = "bokehmol.models.rdkit_formatter"

  static {
    this.define<RDKitFormatter.Props>(({Bool, Dict, Unknown}) => ({
      prefer_coordgen: [ Bool, true ],
      remove_hs: [ Bool, true ],
      sanitize: [ Bool, true ],
      kekulize: [ Bool, true ],
      draw_options: [ Dict(Unknown), {} ],
    }))
  }

  override initialize(): void {
    super.initialize()
    // @ts-expect-error
    initRDKitModule().then((RDKitModule: RDKitModule) => {
      this.RDKitModule = RDKitModule
      console.log("RDKit version: " + RDKitModule.version())
    })
  }

  _wait_rdkit_module(): void {
    // blocks until the rdkit module is available
     if (typeof this.RDKitModule === "undefined"){
          setTimeout(this._wait_rdkit_module, 100)
      }
  }

  _setup_options(): string {
    this._wait_rdkit_module()
    this.RDKitModule.prefer_coordgen(this.prefer_coordgen)
    this.json_mol_opts = JSON.stringify({
      removeHs: this.remove_hs,
      sanitize: this.sanitize,
      kekulize: this.kekulize,
    })
    this.json_draw_opts = JSON.stringify({
      width: this.width,
      height: this.height,
      ...this.draw_options,
    })
    return this.json_draw_opts
  }

  override draw_svg(smiles: string): string {
    const draw_opts = this.json_draw_opts ?? this._setup_options()
    const mol = this.RDKitModule.get_mol(smiles, this.json_mol_opts)
    if (mol !== null && mol.is_valid()) {
        const svg = mol.get_svg_with_highlights(draw_opts)
        mol.delete()
        return svg
    }
    return super.draw_svg(smiles)
  }
}