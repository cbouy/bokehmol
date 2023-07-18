import {div} from "core/dom"
import * as p from "core/properties"
import {replace_placeholders} from "core/util/templating"
import {isString} from "core/util/types"
import type {ColumnarDataSource} from "models/sources/columnar_data_source"
import {HoverTool, HoverToolView, TooltipVars} from "models/tools/inspectors/hover_tool"
import {RDKitFormatter} from "../formatters/rdkit_formatter"


export class MolHoverToolView extends HoverToolView {
  declare model: MolHoverTool

  override initialize(): void {
    super.initialize()
    const {formatters, smiles_column, height, width} = this.model
    formatters["@" + smiles_column] = new RDKitFormatter({width: width, height: height})
  }

  _render_tooltips(ds: ColumnarDataSource, vars: TooltipVars): HTMLElement | null {
    const {tooltips, smiles_column} = this.model
    const i = vars.index

    let user_tooltip = tooltips

    if (user_tooltip === null) {
      user_tooltip = ""
    }

    if (!isString(user_tooltip)) {
      const template = this._template_el ?? (
        // @ts-ignore
        this._template_el = this._create_template(user_tooltip)
      )
      // @ts-ignore
      user_tooltip = this._render_template(template, user_tooltip, ds, vars).outerHTML
    }

    const mol_tooltip = "<div>@" + smiles_column + "{custom}</div>" + user_tooltip
    const content = replace_placeholders(
      {html: mol_tooltip}, ds, i, this.model.formatters, vars
    )
    return div(content)
  }
}

export namespace MolHoverTool {
  export type Attrs = p.AttrsOf<Props>

  export type Props = HoverTool.Props & RDKitFormatter.Props & {
    smiles_column: p.Property<String>
  }
}

// @ts-ignore
export interface MolHoverTool extends MolHoverTool.Attrs {}

export class MolHoverTool extends HoverTool {
  declare properties: MolHoverTool.Props
  declare __view_type__: MolHoverToolView
  declare _mol_div: string

  constructor(attrs?: Partial<MolHoverTool.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = MolHoverToolView

    this.define<MolHoverTool.Props>(({String, Number}) => ({
      smiles_column: [ String, "SMILES" ],
      width: [ Number, 160 ],
      height: [ Number, 120 ],
    }))
    this.override<MolHoverTool.Props>({
      tooltips: [],
    })

    this.register_alias("molhover", () => new MolHoverTool())
  }

  override tool_name = "Molecule Hover"
  override tool_icon = "bk-tool-icon-hover"
}