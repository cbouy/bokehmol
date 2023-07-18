import * as p from "core/properties"
import {RDKitFormatter} from "../formatters/rdkit_formatter"
import {BaseHover, BaseHoverView} from "./base_hover"

export class RDKitHoverView extends BaseHoverView {
  declare model: RDKitHover

  override initialize(): void {
    super.initialize()
    const {
      formatters, smiles_column, width, height, add_atom_indices, add_bond_indices,
      additional_atom_label_padding, add_stereo_annotation, annotation_colour,
      annotation_font_scale, atom_label_deuterium_tritium, background_colour,
      bond_line_width, centre_molecules_before_drawing, clear_background, comic_mode,
      dummies_are_attachments, explicit_methyl, fixed_bond_length, fixed_scale,
      flag_close_contacts_dist, include_radicals, max_font_size, min_font_size,
      multiple_bond_offset, padding, prefer_coordgen, prepare_mols_before_drawing,
      remove_hs, rotate, sanitize, scale_bond_width, symbol_colour
    } = this.model
    formatters["@" + smiles_column] = new RDKitFormatter(
      {
        width: width,
        height: height,
        add_atom_indices: add_atom_indices,
        add_bond_indices: add_bond_indices,
        additional_atom_label_padding: additional_atom_label_padding,
        add_stereo_annotation: add_stereo_annotation,
        annotation_colour: annotation_colour,
        annotation_font_scale: annotation_font_scale,
        atom_label_deuterium_tritium: atom_label_deuterium_tritium,
        background_colour: background_colour,
        bond_line_width: bond_line_width,
        centre_molecules_before_drawing: centre_molecules_before_drawing,
        clear_background: clear_background,
        comic_mode: comic_mode,
        dummies_are_attachments: dummies_are_attachments,
        explicit_methyl: explicit_methyl,
        fixed_bond_length: fixed_bond_length,
        fixed_scale: fixed_scale,
        flag_close_contacts_dist: flag_close_contacts_dist,
        include_radicals: include_radicals,
        max_font_size: max_font_size,
        min_font_size: min_font_size,
        multiple_bond_offset: multiple_bond_offset,
        padding: padding,
        prefer_coordgen: prefer_coordgen,
        prepare_mols_before_drawing: prepare_mols_before_drawing,
        remove_hs: remove_hs,
        rotate: rotate,
        sanitize: sanitize,
        scale_bond_width: scale_bond_width,
        symbol_colour: symbol_colour,
      }
    )
  }
}

export namespace RDKitHover {
  export type Attrs = p.AttrsOf<Props>

  export type Props = BaseHover.Props & RDKitFormatter.Props
}

// @ts-ignore
export interface RDKitHover extends RDKitHover.Attrs {}

export class RDKitHover extends BaseHover {
  declare properties: RDKitHover.Props
  declare __view_type__: RDKitHoverView

  override get computed_icon(): string {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAFVBMVEXc3NwUFP8UPP9kZP+MjP+0tP////9ZXZotAAAAAXRSTlMAQObYZgAAAAFiS0dEBmFmuH0AAAAHdElNRQfmAwsPGi+MyC9RAAAAQElEQVQI12NgQABGQUEBMENISUkRLKBsbGwEEhIyBgJFsICLC0iIUdnExcUZwnANQWfApKCK4doRBsKtQFgKAQC5Ww1JEHSEkAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wMy0xMVQxNToyNjo0NyswMDowMDzr2J4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDMtMTFUMTU6MjY6NDcrMDA6MDBNtmAiAAAAAElFTkSuQmCC"
  }

  constructor(attrs?: Partial<RDKitHover.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = RDKitHoverView

    this.define<RDKitHover.Props>(({Boolean, Number, Tuple, Int}) => ({
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

    this.register_alias("rdkit-hover", () => new RDKitHover())
  }

  override tool_name = "RDKit Hover"
}