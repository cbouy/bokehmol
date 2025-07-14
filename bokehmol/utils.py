import json
import os
import warnings
from functools import lru_cache
from importlib.metadata import Distribution
from importlib.resources import files as pkg_files
from tempfile import NamedTemporaryFile
from typing import ClassVar

from bokeh.io import output_file
from bokeh.models import Model
from bokeh.plotting import save
from bokeh.resources import Resources

from bokehmol.config import settings


@lru_cache(maxsize=1)
def is_editable_install() -> bool:
    is_editable = False
    direct_url = Distribution.from_name("bokehmol").read_text("direct_url.json")
    if direct_url:
        is_editable = json.loads(direct_url).get("dir_info", {}).get("editable", False)
    return is_editable


class PatchedResources:
    """Patches the bokeh class that handles including the JS dependencies in the final
    document.
    """

    _raw_resolve: ClassVar = Resources._resolve

    @classmethod
    def enable(cls):
        def patched(self, *args, **kwargs):
            kind = args[0] if args else kwargs["kind"]
            files, raw, hashes = cls._raw_resolve(self, kind)
            if kind == "js":
                if is_editable_install() and settings.use_packaged_js:
                    warnings.warn(
                        "Editable install detected, patching bokeh resources to "
                        "include local compiled bokehmol as raw JS file. Remember to "
                        "rerun `pip install -e .` after any JS-side modification."
                    )
                    bokehmol_min_js = (
                        pkg_files("bokehmol")
                        .joinpath("dist/bokehmol.min.js")
                        .read_text()
                    )
                    raw.append(bokehmol_min_js)
            return files, raw, hashes

        Resources._resolve = patched

    @classmethod
    def restore(cls):
        Resources._resolve = cls._raw_resolve


def show(plot):
    """For JupyterLab: alternative to `bokeh.plotting.show` that will temporarily save
    the plot to a local tempfile, load the written content in memory, delete the file,
    and display the content using an `IPython.display.HTML` object. Works on Windows
    too...
    """
    from IPython.display import HTML

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
