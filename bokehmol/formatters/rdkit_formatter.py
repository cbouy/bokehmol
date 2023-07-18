from bokeh.core.properties import Any, Dict, String

from bokehmol.backends.rdkit_backend import get_minimal_lib
from bokehmol.formatters.base_formatter import BaseFormatter


class RDKitFormatter(BaseFormatter):
    __implementation__ = "rdkit_formatter.ts"
    __javascript__ = get_minimal_lib()

    options = Dict(
        String,
        Any,
        default=lambda: dict(),
        help="Options for the rendering (https://www.rdkitjs.com/#drawing-molecules-all-options).",
    )


if __name__ == "__main__":
    from bokeh.models import ColumnDataSource, HoverTool
    from bokeh.plotting import figure, show

    source = ColumnDataSource(data=dict(x=[1, 8], y=[2, 5], smi=["CCO", "c1ccccc1"]))

    plot = figure(
        x_range=(0, 10),
        y_range=(0, 10),
        title="RDKit Hover",
        background_fill_color="#efefef",
        tools="",
    )

    hover_tooltip = """
    <div style="font-size: 14px;">
        <div style="position: relative; left=0;">@smi{custom}</div>
        <div style="position: relative;">
            <span style="font-size: 10px; word-wrap: break-word;">@smi</span>
        </div>
    </div>"""

    plot.add_tools(
        HoverTool(
            tooltips=hover_tooltip,
            formatters={"@smi": RDKitFormatter(options={"addAtomIndices": True})},
        )
    )

    plot.circle("x", "y", size=10, line_width=0, fill_color="red", source=source)

    show(plot)
