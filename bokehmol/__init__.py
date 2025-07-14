# ruff: noqa: F401
from bokehmol import hover
from bokehmol.config import settings
from bokehmol.hover import register_alias
from bokehmol.utils import PatchedResources, show

PatchedResources.enable()
del PatchedResources
