import os
from bokeh.core.has_props import _default_resolver

DEV_ENV = os.environ.get("BOKEHMOL", None)
MODELS = set()


class Hook:
    def __init_subclass__(cls, **kwargs) -> None:
        super().__init_subclass__(**kwargs)
        MODELS.add(cls)
        if not DEV_ENV:
            if hasattr(cls, "__implementation__"):
                del cls.__implementation__
