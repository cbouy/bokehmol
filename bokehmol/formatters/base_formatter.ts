import {CustomJSHover} from "models/tools/inspectors/customjs_hover"
import * as p from "core/properties"

export namespace BaseFormatter {
  export type Attrs = p.AttrsOf<Props>

  export type Props = CustomJSHover.Props & {
    width: p.Property<number>
    height: p.Property<number>
  }
}
  
export interface BaseFormatter extends BaseFormatter.Attrs {}

export class BaseFormatter extends CustomJSHover {
  declare properties: BaseFormatter.Props

  constructor(attrs?: Partial<BaseFormatter.Attrs>) {
    super(attrs)
  }

  static {
    this.define<BaseFormatter.Props>(({Number}) => ({
      width: [ Number, 160 ],
      height: [ Number, 120 ],
    }))
  }

  draw_svg(smiles: string): string {
    smiles;
    return '<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1 1"></svg>'
  }

  override format(value: any, format: string, special_vars: {[key: string]: unknown}): string {
    format; special_vars;
    return this.draw_svg(value)
  }

}