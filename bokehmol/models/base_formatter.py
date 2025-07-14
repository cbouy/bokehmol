from bokeh.core.properties import Int
from bokeh.models import CustomJSHover


class BaseFormatter(CustomJSHover):
    width = Int(default=160, help="Image width")
    height = Int(default=120, help="Image height")
    mols_per_row = Int(
        default=3, help="Number of molecules per row if a list is provided"
    )
