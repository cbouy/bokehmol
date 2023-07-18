import {div} from "core/dom"
import * as p from "core/properties"
import {replace_placeholders} from "core/util/templating"
import {isString} from "core/util/types"
import type {ColumnarDataSource} from "models/sources/columnar_data_source"
import {HoverTool, HoverToolView, TooltipVars} from "models/tools/inspectors/hover_tool"
import {BaseFormatter} from "../formatters/base_formatter"


export class BaseHoverToolView extends HoverToolView {
  declare model: BaseHoverTool

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

export namespace BaseHoverTool {
  export type Attrs = p.AttrsOf<Props>

  export type Props = HoverTool.Props & BaseFormatter.Props & {
    smiles_column: p.Property<String>
  }
}

// @ts-ignore
export interface BaseHoverTool extends BaseHoverTool.Attrs {}

export class BaseHoverTool extends HoverTool {
  declare properties: BaseHoverTool.Props
  declare __view_type__: BaseHoverToolView

  constructor(attrs?: Partial<BaseHoverTool.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = BaseHoverToolView

    this.define<BaseHoverTool.Props>(({String, Number}) => ({
      smiles_column: [ String, "SMILES" ],
      width: [ Number, 160 ],
      height: [ Number, 120 ],
    }))
    this.override<BaseHoverTool.Props>({
      tooltips: [],
    })
  }

  override tool_icon = "bk-tool-icon-hover"
}