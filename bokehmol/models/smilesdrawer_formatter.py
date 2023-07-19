from bokeh.core.properties import Any, Dict, String

from bokehmol.config import settings
from bokehmol.models.base_formatter import BaseFormatter


class SmilesDrawerFormatter(BaseFormatter):
    __implementation__ = "smilesdrawer_formatter.ts"
    __javascript__ = settings.smilesdrawer_src

    theme = String(
        default="light",
        help="light, dark, oldschool, solarized, solarized-dark, matrix, github, carbon, cyberpunk, gruvbox, gruvbox-dark",
    )
    background_colour = String(default="transparent")
    mol_options = Dict(
        String, Any, default={}, help="https://smilesdrawer.surge.sh/playground.html"
    )
    reaction_options = Dict(
        String, Any, default={}, help="https://smilesdrawer.surge.sh/playground.html"
    )


if __name__ == "__main__":
    from bokeh.models import ColumnDataSource, HoverTool
    from bokeh.plotting import figure, show

    source = ColumnDataSource(
        data=dict(x=[1, 8, 3], y=[2, 5, 7], SMILES=["CCO", "c1ccccc1", "[n]"])
    )

    plot = figure(
        x_range=(0, 10),
        y_range=(0, 10),
        title="SmilesDrawer Hover",
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
                "@SMILES": SmilesDrawerFormatter(
                    theme="gruvbox-dark",
                    background_colour="grey",
                    mol_options={"bondThickness": 4},
                )
            },
        )
    )

    plot.circle("x", "y", size=10, line_width=0, fill_color="red", source=source)

    show(plot)
