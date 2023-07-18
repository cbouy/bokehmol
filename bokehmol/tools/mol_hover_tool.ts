import * as p from "core/properties"
import {RDKitFormatter} from "../formatters/rdkit_formatter"
import {BaseHoverTool, BaseHoverToolView} from "./base_hover_tool"

export class MolHoverToolView extends BaseHoverToolView {
  declare model: MolHoverTool

  override initialize(): void {
    super.initialize()
    const {formatters, smiles_column, height, width, options} = this.model
    formatters["@" + smiles_column] = new RDKitFormatter(
      {width: width, height: height, options: options}
    )
  }
}

export namespace MolHoverTool {
  export type Attrs = p.AttrsOf<Props>

  export type Props = BaseHoverTool.Props & RDKitFormatter.Props
}

// @ts-ignore
export interface MolHoverTool extends MolHoverTool.Attrs {}

export class MolHoverTool extends BaseHoverTool {
  declare properties: MolHoverTool.Props
  declare __view_type__: MolHoverToolView

  constructor(attrs?: Partial<MolHoverTool.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = MolHoverToolView

    this.define<MolHoverTool.Props>(({Dict, Unknown}) => ({
      options: [ Dict(Unknown), {} ],
    }))

    // does not seem to work
    this.register_alias("molhover", () => new MolHoverTool())
  }

  override tool_name = "Molecule Hover"
}