import * as p from "@bokehjs/core/properties"
import {BaseHover, BaseHoverView} from "./base_hover"
import {RDKitFormatter} from "./rdkit_formatter"

export class RDKitHoverView extends BaseHoverView {
  declare model: RDKitHover

  override initialize(): void {
    super.initialize()
    const {
      formatters, smiles_column, width, height, prefer_coordgen, 
      remove_hs, sanitize, kekulize, draw_options
    } = this.model
    formatters["@" + smiles_column] = new RDKitFormatter(
      {
        width: width,
        height: height,
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

  static __module__ = "bokehmol.models.rdkit_hover"

  static {
    this.prototype.default_view = RDKitHoverView

    this.define<RDKitHover.Props>(({Boolean, Dict, Unknown}) => ({
      prefer_coordgen: [ Boolean, true ],
      remove_hs: [ Boolean, true ],
      sanitize: [ Boolean, true ],
      kekulize: [ Boolean, true ],
      draw_options: [ Dict(Unknown), {} ],
    }))

    this.register_alias("rdkit_hover", () => new RDKitHover())
  }

  override tool_name = "RDKit Hover"
}