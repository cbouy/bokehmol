from bokehmol import hover
from bokehmol.config import settings
from bokehmol.models.rdkit_hover import RDKitHover
from bokehmol.models.smilesdrawer_hover import SmilesDrawerHover
from bokehmol.utils import Hook as _hook

_hook.enable()
del _hook
