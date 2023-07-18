from bokeh.core.properties import Override, String
from bokeh.models import HoverTool

from bokehmol.formatters.base_formatter import BaseFormatter


class BaseHoverTool(HoverTool, BaseFormatter):
    __implementation__ = "base_hover_tool.ts"

    smiles_column = String(default="SMILES", help="Column containing SMILES string")
    tooltips = Override(default=[])
