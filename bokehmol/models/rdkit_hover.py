from bokehmol.models.base_hover import BaseHover
from bokehmol.models.rdkit_formatter import RDKitFormatter


class RDKitHover(BaseHover, RDKitFormatter):
    __implementation__ = "rdkit_hover.ts"


RDKitHover.register_alias("rdkit_hover", lambda: RDKitHover())
