import * as p from "core/properties"
import {BaseFormatter} from "./base_formatter"

declare namespace rdkit {
  class RDKitModule {
    get_mol(source: string): RDKitMolecule
    version(): string
  }

  class RDKitMolecule {
    is_valid(): boolean
    delete(): void
    get_svg_with_highlights(options: string): string
  }
}

export namespace RDKitFormatter {
  export type Attrs = p.AttrsOf<Props>

  export type Props = BaseFormatter.Props & {
    options: p.Property<{[key: string]: unknown}>
  }
}
  
export interface RDKitFormatter extends RDKitFormatter.Attrs {}

export class RDKitFormatter extends BaseFormatter {
  declare properties: RDKitFormatter.Props
  protected RDKitModule: rdkit.RDKitModule
  protected draw_opts?: string

  constructor(attrs?: Partial<RDKitFormatter.Attrs>) {
    super(attrs)
  }

  static {
    this.define<RDKitFormatter.Props>(({Dict, Unknown}) => ({
      options: [ Dict(Unknown), {} ],
    }))
  }

  override initialize(): void {
    super.initialize()
    // @ts-ignore
    initRDKitModule().then((RDKitModule: rdkit.RDKitModule) => {
      this.RDKitModule = RDKitModule
      console.log("RDKit version: " + RDKitModule.version())
    })
  }

  get rdkit_options(): string {
    return JSON.stringify({
      width: this.width,
      height: this.height,
      ...this.options,
    })
  }

  override draw_svg(smiles: string): string {
    const draw_opts = this.draw_opts ?? (this.draw_opts = this.rdkit_options)
    const mol = this.RDKitModule.get_mol(smiles)
    if (mol.is_valid()) {
        const svg = mol.get_svg_with_highlights(draw_opts)
        mol.delete()
        return svg
    }
    return super.draw_svg(smiles)
  }
}