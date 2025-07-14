from bokeh.core.properties import Any, Bool, Dict, String

from bokehmol.config import settings
from bokehmol.models.base_formatter import BaseFormatter


class RDKitFormatter(BaseFormatter):
    __javascript__ = settings.rdkitjs_src

    remove_hs = Bool(default=True)
    sanitize = Bool(default=True)
    kekulize = Bool(default=True)
    prefer_coordgen = Bool(default=True)
    draw_options = Dict(
        String,
        Any,
        default={},
        help="https://www.rdkitjs.com/#drawing-molecules-all-options",
    )


if __name__ == "__main__":
    from bokeh.models import ColumnDataSource, HoverTool
    from bokeh.plotting import figure, show

    source = ColumnDataSource(
        data=dict(x=[1, 8, 3], y=[2, 5, 7], SMILES=[["CCO", "CC"], "c1ccccc1", "[n]"])
    )

    plot = figure(
        x_range=(0, 10),
        y_range=(0, 10),
        title="RDKit Hover",
        background_fill_color="#efefef",
        tools="",
    )

    hover_tooltip = """
    <div style="font-size: 14px;">
        <div style="position: relative; left=0;">@SMILES{custom}</div>
        <div style="position: relative;">
            <span style="font-size: 10px; word-wrap: break-word;">@SMILES</span>
        </div>
    </div>"""
    
    plot.add_tools(
        HoverTool(
            tooltips=hover_tooltip,
            formatters={
                "@SMILES": RDKitFormatter(
                    sanitize=False,
                    draw_options={
                        "addAtomIndices": True,
                    },
                )
            },
        )
    )
    
    plot.scatter("x", "y", size=10, line_width=0, fill_color="red", source=source)

    show(plot)
