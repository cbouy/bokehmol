import warnings
from pathlib import Path
from typing import ClassVar

from bokeh.resources import Resources

from bokehmol.config import settings


class Hook:
    _resolve: ClassVar = None

    def __init_subclass__(cls, **kwargs) -> None:
        if hasattr(cls, "__implementation__"):
            if settings.dev_mode:
                pass
            else:
                del cls.__implementation__
                cls.__qualified_model__ = f"{cls.__module__}.{cls.__name__}"
        super().__init_subclass__(**kwargs)

    @classmethod
    def enable(cls):
        cls._resolve = Resources._resolve

        def resolve(self, *args, **kwargs):
            kind = args[0] if args else kwargs["kind"]
            files, raw, hashes = cls._resolve(self, kind)
            bokehmol_file = Path(settings.bokehmol_js)
            if bokehmol_file.is_file():
                raw.append(bokehmol_file.read_text())
            else:
                warnings.warn(
                    "Could not find local bokehmol.min.js file in "
                    f"{bokehmol_file.parent}"
                )
            return files, raw, hashes

        Resources._resolve = resolve

    @classmethod
    def restore(cls):
        Resources._resolve = cls._resolve
