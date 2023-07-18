import * as p from "core/properties"
import {BaseFormatter} from "./base_formatter"

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

type RGBA = [number, number, number, number]

export namespace RDKitFormatter {
  export type Attrs = p.AttrsOf<Props>

  export type Props = BaseFormatter.Props & {    
    add_atom_indices: p.Property<boolean>
    add_bond_indices: p.Property<boolean>
    additional_atom_label_padding: p.Property<number>
    add_stereo_annotation: p.Property<boolean>
    annotation_colour: p.Property<RGBA>
    annotation_font_scale: p.Property<number>
    atom_label_deuterium_tritium: p.Property<boolean>
    background_colour: p.Property<RGBA>
    bond_line_width: p.Property<number>
    centre_molecules_before_drawing: p.Property<boolean>
    clear_background: p.Property<boolean>
    comic_mode: p.Property<boolean>
    dummies_are_attachments: p.Property<boolean>
    explicit_methyl: p.Property<boolean>
    fixed_bond_length: p.Property<number>
    fixed_scale: p.Property<number>
    flag_close_contacts_dist: p.Property<number>
    include_radicals: p.Property<boolean>
    max_font_size: p.Property<number>
    min_font_size: p.Property<number>
    multiple_bond_offset: p.Property<number>
    padding: p.Property<number>
    prefer_coordgen: p.Property<boolean>
    prepare_mols_before_drawing: p.Property<boolean>
    remove_hs: p.Property<boolean>
    rotate: p.Property<number>
    sanitize: p.Property<boolean>
    scale_bond_width: p.Property<boolean>
    symbol_colour: p.Property<RGBA>
  }
}
  
export interface RDKitFormatter extends RDKitFormatter.Attrs {}

export class RDKitFormatter extends BaseFormatter {
  declare properties: RDKitFormatter.Props
  protected RDKitModule: rdkit.RDKitModule
  protected draw_opts?: string
  protected mol_opts?: string

  constructor(attrs?: Partial<RDKitFormatter.Attrs>) {
    super(attrs)
  }

  static {
    this.define<RDKitFormatter.Props>(({Boolean, Number, Tuple, Int}) => ({
      add_atom_indices: [ Boolean, false ],
      add_bond_indices: [ Boolean, false ],
      additional_atom_label_padding: [ Number, 0.0 ],
      add_stereo_annotation: [ Boolean, false ],
      annotation_colour: [
        Tuple(Number, Number, Number, Number), [0, 0, 0, 1]
      ],
      annotation_font_scale: [ Number, 0.5 ],
      atom_label_deuterium_tritium: [ Boolean, false ],
      background_colour: [
        Tuple(Number, Number, Number, Number), [1, 1, 1, 1]
      ],
      bond_line_width: [ Number, 2.0 ],
      centre_molecules_before_drawing: [ Boolean, false ],
      clear_background: [ Boolean, true ],
      comic_mode: [ Boolean, false ],
      dummies_are_attachments: [ Boolean, false ],
      explicit_methyl: [ Boolean, false ],
      fixed_bond_length: [ Number, -1.0 ],
      fixed_scale: [ Number, -1.0 ],
      flag_close_contacts_dist: [ Number, 3.0 ],
      include_radicals: [ Boolean, true ],
      max_font_size: [ Int, 40 ],
      min_font_size: [ Int, 6 ],
      multiple_bond_offset: [ Number, 0.15 ],
      padding: [ Number, 0.05 ],
      prefer_coordgen: [ Boolean, true ],
      prepare_mols_before_drawing: [ Boolean, true ],
      remove_hs: [ Boolean, true ],
      rotate: [ Number, 0.0 ],
      sanitize: [ Boolean, true ],
      scale_bond_width: [ Boolean, false ],
      symbol_colour: [
        Tuple(Number, Number, Number, Number), [0, 0, 0, 1]
      ],
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
    this.RDKitModule.prefer_coordgen(this.prefer_coordgen)
    this.mol_opts = JSON.stringify({
      sanitize: this.sanitize,
      removeHs: this.remove_hs,
    })
    return JSON.stringify({
      width: this.width,
      height: this.height,
      addAtomIndices: this.add_atom_indices,
      addBondIndices: this.add_bond_indices,
      additionalAtomLabelPadding: this.additional_atom_label_padding,
      addStereoAnnotation: this.add_stereo_annotation,
      annotationColour: this.annotation_colour,
      annotationFontScale: this.annotation_font_scale,
      atomLabelDeuteriumTritium: this.atom_label_deuterium_tritium,
      backgroundColour: this.background_colour,
      bondLineWidth: this.bond_line_width,
      centreMoleculesBeforeDrawing: this.centre_molecules_before_drawing,
      clearBackground: this.clear_background,
      comicMode: this.comic_mode,
      dummiesAreAttachments: this.dummies_are_attachments,
      explicitMethyl: this.explicit_methyl,
      fixedBondLength: this.fixed_bond_length,
      fixedScale: this.fixed_scale,
      flagCloseContactsDist: this.flag_close_contacts_dist,
      includeRadicals: this.include_radicals,
      maxFontSize: this.max_font_size,
      minFontSize: this.min_font_size,
      multipleBondOffset: this.multiple_bond_offset,
      padding: this.padding,
      prepareMolsBeforeDrawing: this.prepare_mols_before_drawing,
      rotate: this.rotate,
      scaleBondWidth: this.scale_bond_width,
      symbolColour: this.symbol_colour,
    })
  }

  override draw_svg(smiles: string): string {
    const draw_opts = this.draw_opts ?? (this.draw_opts = this.rdkit_options)
    const mol = this.RDKitModule.get_mol(smiles, this.mol_opts)
    if (mol !== null && mol.is_valid()) {
        const svg = mol.get_svg_with_highlights(draw_opts)
        mol.delete()
        return svg
    }
    return super.draw_svg(smiles)
  }
}