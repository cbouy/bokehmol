from bokeh.core.properties import Override, String
from bokeh.models import HoverTool

from bokehmol.models.base_formatter import BaseFormatter


class BaseHover(BaseFormatter, HoverTool):
    smiles_column = String(default="SMILES", help="Column containing SMILES string")
    tooltips = Override(default=[])
