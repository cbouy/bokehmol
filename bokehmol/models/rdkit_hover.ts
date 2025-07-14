import type * as p from "@bokehjs/core/properties"
import {BaseHover, BaseHoverView} from "./base_hover"
import {RDKitFormatter} from "./rdkit_formatter"

export class RDKitHoverView extends BaseHoverView {
  declare model: RDKitHover

  override initialize(): void {
    super.initialize()
    const {
      formatters, smiles_column, width, height, mols_per_row, prefer_coordgen, 
      remove_hs, sanitize, kekulize, draw_options
    } = this.model
    // @ts-expect-error
    formatters["@" + smiles_column] = new RDKitFormatter(
      {
        width: width,
        height: height,
        mols_per_row: mols_per_row,
        prefer_coordgen: prefer_coordgen,
        remove_hs: remove_hs,
        sanitize: sanitize,
        kekulize: kekulize,
        draw_options: draw_options,
      }
    )
  }
}

export namespace RDKitHover {
  export type Attrs = p.AttrsOf<Props>

  export type Props = BaseHover.Props & RDKitFormatter.Props
}

export interface RDKitHover extends RDKitHover.Attrs {}

export class RDKitHover extends BaseHover {
  declare properties: RDKitHover.Props

  override get computed_icon(): string {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAFVBMVEXc3NwUFP8UPP9kZP+MjP+0tP////9ZXZotAAAAAXRSTlMAQObYZgAAAAFiS0dEBmFmuH0AAAAHdElNRQfmAwsPGi+MyC9RAAAAQElEQVQI12NgQABGQUEBMENISUkRLKBsbGwEEhIyBgJFsICLC0iIUdnExcUZwnANQWfApKCK4doRBsKtQFgKAQC5Ww1JEHSEkAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wMy0xMVQxNToyNjo0NyswMDowMDzr2J4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDMtMTFUMTU6MjY6NDcrMDA6MDBNtmAiAAAAAElFTkSuQmCC"
  }

  constructor(attrs?: Partial<RDKitHover.Attrs>) {
    super(attrs)
  }

  static __module__ = "bokehmol.models.rdkit_hover"

  static {
    this.prototype.default_view = RDKitHoverView

    this.define<RDKitHover.Props>(({Bool, Dict, Unknown}) => ({
      prefer_coordgen: [ Bool, true ],
      remove_hs: [ Bool, true ],
      sanitize: [ Bool, true ],
      kekulize: [ Bool, true ],
      draw_options: [ Dict(Unknown), {} ],
    }))

    this.register_alias("rdkit_hover", () => new RDKitHover())
  }

  override tool_name = "RDKit Hover"
}