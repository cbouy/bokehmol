from bokeh.core.properties import Int
from bokeh.models import CustomJSHover

from bokehmol.utils import Hook


class BaseFormatter(Hook, CustomJSHover):
    __implementation__ = "base_formatter.ts"

    width = Int(default=160, help="Image width")
    height = Int(default=120, help="Image height")
