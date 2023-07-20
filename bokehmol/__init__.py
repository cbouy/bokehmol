from bokehmol import hover
from bokehmol.config import settings
from bokehmol.hover import register_alias
from bokehmol.utils import Hook as _hook

if not settings.dev_mode:
    _hook.enable()

del _hook
