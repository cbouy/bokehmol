import * as p from "@bokehjs/core/properties"
import {BaseFormatter} from "./base_formatter"
import {combineSvgs} from "./combinesvg"

declare namespace rdkit {
  class RDKitModule {
    prefer_coordgen(prefer: boolean): void
    get_mol(source: string, mol_opts?: string): RDKitMolecule | null
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
    prefer_coordgen: p.Property<boolean>
    remove_hs: p.Property<boolean>
    sanitize: p.Property<boolean>
    kekulize: p.Property<boolean>
    draw_options: p.Property<{[key: string]: unknown}>
  }
}
  
export interface RDKitFormatter extends RDKitFormatter.Attrs {}

export class RDKitFormatter extends BaseFormatter {
  declare properties: RDKitFormatter.Props
  protected RDKitModule: rdkit.RDKitModule
  protected json_draw_opts?: string
  protected json_mol_opts?: string

  constructor(attrs?: Partial<RDKitFormatter.Attrs>) {
    super(attrs)
  }

  static __module__ = "bokehmol.models.rdkit_formatter"

  static {
    this.define<RDKitFormatter.Props>(({Boolean, Dict, Unknown}) => ({
      prefer_coordgen: [ Boolean, true ],
      remove_hs: [ Boolean, true ],
      sanitize: [ Boolean, true ],
      kekulize: [ Boolean, true ],
      draw_options: [ Dict(Unknown), {} ],
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

  _setup_options(): string {
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

  override draw_svg(smiles: string | string[]): string {
    const draw_opts = this.json_draw_opts ?? this._setup_options()
    
    if (Array.isArray(smiles)){
      let images: any[] = []
      for(var index in smiles){
        const mol = this.RDKitModule.get_mol(smiles[index], this.json_mol_opts)
        if (mol == null || !mol.is_valid()) {
          continue
        }
        const svg = mol.get_svg_with_highlights(draw_opts)
        images.push(svg)
        mol.delete()
      }
    return combineSvgs(images, this.width, this.height, 5)        
  }
    
    const mol = this.RDKitModule.get_mol(smiles, this.json_mol_opts)
    if (mol !== null && mol.is_valid()) {
        const svg = mol.get_svg_with_highlights(draw_opts)
        mol.delete()
        return svg
    }
    return super.draw_svg(smiles)
  }
}