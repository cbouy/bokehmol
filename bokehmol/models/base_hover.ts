import {div} from "core/dom"
import * as p from "core/properties"
import {replace_placeholders} from "core/util/templating"
import {isString} from "core/util/types"
import type {ColumnarDataSource} from "models/sources/columnar_data_source"
import {HoverTool, HoverToolView, TooltipVars} from "models/tools/inspectors/hover_tool"
import {tool_icon_hover} from "styles/icons.css"
import {BaseFormatter} from "./base_formatter"


export class BaseHoverView extends HoverToolView {
  declare model: BaseHover

  override _render_tooltips(ds: ColumnarDataSource, vars: TooltipVars): HTMLElement | null {
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

export namespace BaseHover {
  export type Attrs = p.AttrsOf<Props>

  export type Props = HoverTool.Props & BaseFormatter.Props & {
    smiles_column: p.Property<String>
  }
}

// @ts-ignore
export interface BaseHover extends BaseHover.Attrs {}

export class BaseHover extends HoverTool {
  declare properties: BaseHover.Props
  declare __view_type__: BaseHoverView

  override get computed_icon(): string {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAt1BMVEUAAAAAAAArKyskJCQcHBwrKyscHBwmJiYjIyMhISEgICAfHx8dHR0kJCQiIiIhISEhISEgICAkJCQkJCQjIyMiIiIiIiIhISEkJCQjIyMiIiIiIiIjIyMjIyMkJCQjIyMiIiIkJCQhISEjIyMiIiIiIiIiIiIkJCQjIyMiIiIiIiIiIiIiIiIhISEjIyMjIyMiIiIiIiIjIyMiIiIiIiIhISEiIiIiIiIiIiIiIiIhISEjIyP///9o30WSAAAAPHRSTlMAAQYHCQwSFBYXGBkaKy0uLzAxMjM0NTY5UVJTV1hdYHJyc3V3eHmBk5SVlpeZmpucnaqtrrCytLa7wMBTv07WAAAAAWJLR0Q8p2phzwAAAKRJREFUGBmtwQkagUAAgNF/ZAtZo2yRIrusofvfi+ab0gG8xx85gS8FDjlabJuS/db4WQ1RRksy+p3ZRZpxbZA6t8gYJxRzTc7WQhKPCjnlSJDwXEIdRQ9xPRKeS+eAcurjeiTEo8JhgNTdU44EUm9D9SlIRDV2FkrYZjHhazrHOJLS7xReRSi+CtzqZJYjmiUoNRn7/GixbUr2WyPHCXwpcPifD0UBD3u/QqniAAAAAElFTkSuQmCC"
  }

  constructor(attrs?: Partial<BaseHover.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = BaseHoverView

    this.define<BaseHover.Props>(({String, Number}) => ({
      smiles_column: [ String, "SMILES" ],
      width: [ Number, 160 ],
      height: [ Number, 120 ],
    }))
    this.override<BaseHover.Props>({
      tooltips: [],
    })
  }

  override tool_icon = tool_icon_hover
}