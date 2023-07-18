import {CustomJSHover} from "models/tools/inspectors/customjs_hover"
import * as p from "core/properties"

declare namespace rdkit {
  class RDKitModule {
    get_mol(source: string): RDKitMolecule
    version(): string
  }

  class RDKitMolecule {
    is_valid(): boolean
    delete(): void
    get_svg(width: number, height: number): string
  }
}

export namespace RDKitFormatter {
  export type Attrs = p.AttrsOf<Props>

  export type Props = CustomJSHover.Props & {
    width: p.Property<number>
    height: p.Property<number>
  }
}
  
export interface RDKitFormatter extends RDKitFormatter.Attrs {}

export class RDKitFormatter extends CustomJSHover {
  declare properties: RDKitFormatter.Props
  declare RDKitModule: rdkit.RDKitModule

  constructor(attrs?: Partial<RDKitFormatter.Attrs>) {
    super(attrs)
  }

  static {
    this.define<RDKitFormatter.Props>(({Number}) => ({
      width: [ Number, 160 ],
      height: [ Number, 120 ],
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

  draw_svg(smiles: string): string {
    const mol = this.RDKitModule.get_mol(smiles)
    let svg = ""
    if (mol.is_valid()) {
        svg = mol.get_svg(this.width, this.height)
    }
    mol.delete();
    if (svg == "") {
        svg = '<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1 1"></svg>'
    }
    return svg
  }

  override format(value: any, format: string, special_vars: {[key: string]: unknown}): string {
    format; special_vars;
    return this.draw_svg(value)
  }

}