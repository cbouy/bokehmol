import * as p from "core/properties"
import {BaseHover, BaseHoverView} from "./base_hover"
import {SmilesDrawerFormatter} from "./smilesdrawer_formatter"

export class SmilesDrawerHoverView extends BaseHoverView {
  declare model: SmilesDrawerHover

  override initialize(): void {
    super.initialize()
    const {
      formatters, smiles_column, width, height, theme, background_colour, mol_options,
      reaction_options,
    } = this.model
    formatters["@" + smiles_column] = new SmilesDrawerFormatter(
      {
        width: width,
        height: height,
        theme: theme,
        background_colour: background_colour,
        mol_options: mol_options,
        reaction_options: reaction_options,
      }
    )
  }
}

export namespace SmilesDrawerHover {
  export type Attrs = p.AttrsOf<Props>

  export type Props = BaseHover.Props & SmilesDrawerFormatter.Props
}

// @ts-ignore
export interface SmilesDrawerHover extends SmilesDrawerHover.Attrs {}

export class SmilesDrawerHover extends BaseHover {
  declare properties: SmilesDrawerHover.Props
  declare __view_type__: SmilesDrawerHoverView

  constructor(attrs?: Partial<SmilesDrawerHover.Attrs>) {
    super(attrs)
  }

  static __module__ = "bokehmol.models.smilesdrawer_hover"

  static {
    this.prototype.default_view = SmilesDrawerHoverView

    this.define<SmilesDrawerHover.Props>(({String, Dict, Unknown}) => ({
      theme: [ String, "light" ],
      background_colour: [ String, "transparent" ],
      mol_options: [ Dict(Unknown), {} ],
      reaction_options: [ Dict(Unknown), {} ],
    }))

    this.register_alias("smiles_hover", () => new SmilesDrawerHover())
  }

  override tool_name = "SmilesDrawer Hover"
}