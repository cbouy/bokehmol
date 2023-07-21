from bokehmol import hover
from bokehmol.config import settings
from bokehmol.hover import register_alias
from bokehmol.utils import Hook, show

if not settings.dev_mode:
    Hook.enable()

del Hook
