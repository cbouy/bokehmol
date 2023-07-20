from bokehmol.models.base_hover import BaseHover
from bokehmol.models.smilesdrawer_formatter import SmilesDrawerFormatter


class SmilesDrawerHover(BaseHover, SmilesDrawerFormatter):
    __implementation__ = "smilesdrawer_hover.ts"
