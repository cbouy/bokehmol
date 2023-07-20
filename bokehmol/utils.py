from typing import ClassVar

from bokeh.resources import Resources

from bokehmol.config import settings


class Hook:
    """Class inherited by all models for multiple purposes:

    - avoid having to delete the `__implementation__` attribute outside of
      prototyping
    - register the models with the correct name on the JS side
    - also includes a classmethod that patches the bokeh class that handles
      including the JS dependencies in the final document.
    """

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

        def patched_resolve(self, *args, **kwargs):
            kind = args[0] if args else kwargs["kind"]
            files, raw, hashes = cls._resolve(self, kind)
            bokehmol_min_js = settings.bokehmol_js
            if "{" in bokehmol_min_js:
                raw.append(bokehmol_min_js)
            return files, raw, hashes

        Resources._resolve = patched_resolve

    @classmethod
    def restore(cls):
        Resources._resolve = cls._resolve
