import os
from tempfile import NamedTemporaryFile
from typing import ClassVar

from bokeh.io import output_file
from bokeh.models import Model
from bokeh.plotting import save
from bokeh.resources import Resources
from IPython.display import HTML

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
            del cls.__implementation__
            cls.__qualified_model__ = f"{cls.__module__}.{cls.__name__}"
        super().__init_subclass__(**kwargs)

    @classmethod
    def enable(cls):
        cls._resolve = Resources._resolve

        def patched_resolve(self, *args, **kwargs):
            kind = args[0] if args else kwargs["kind"]
            files, raw, hashes = cls._resolve(self, kind)
            if kind == "js":
                bokehmol_min_js = settings.bokehmol_js
                if "{" in bokehmol_min_js:
                    raw.append(bokehmol_min_js)
            return files, raw, hashes

        Resources._resolve = patched_resolve

    @classmethod
    def restore(cls):
        Resources._resolve = cls._resolve


def show(plot):
    """For JupyterLab: alternative to `bokeh.plotting.show` that will temporarily save
    the plot to a local tempfile, load the written content in memory, delete the file,
    and display the content using an `IPython.display.HTML` object. Works on Windows
    too...
    """
    try:
        # save plot to tempfile, delete=False for Windows
        with NamedTemporaryFile("w", suffix=".html", delete=False) as tf:
            output_file(tf.name)
            save(plot)

        # load content and remove tempfile
        with open(tf.name, "r") as fh:
            data = fh.read()
        os.remove(tf.name)

        # avoid bokeh error `Models must be owned by only a single document` when
        # displaying another plot
        for model in plot.select({"type": Model}):
            prev_doc = model.document
            model._document = None
            if prev_doc:
                prev_doc.remove_root(model)

        return HTML(data)
    finally:
        try:
            os.remove(tf.name)
        except Exception:
            pass
