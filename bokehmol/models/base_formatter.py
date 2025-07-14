from bokeh.core.properties import Int
from bokeh.models import CustomJSHover


class BaseFormatter(CustomJSHover):
    width = Int(default=160, help="Image width")
    height = Int(default=120, help="Image height")
