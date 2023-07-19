from bokehmol.models.base_hover import BaseHover
from bokehmol.models.smilesdrawer_formatter import SmilesDrawerFormatter


class SmilesDrawerHover(BaseHover, SmilesDrawerFormatter):
    __implementation__ = "smilesdrawer_hover.ts"


SmilesDrawerHover.register_alias("smiles-hover", lambda: SmilesDrawerHover())


if __name__ == "__main__":
    from bokeh.models import ColumnDataSource
    from bokeh.plotting import figure, show

    source = ColumnDataSource(
        data=dict(x=[1, 8, 3], y=[2, 5, 7], SMILES=["CCO", "c1ccccc1", "[n]"])
    )

    plot = figure(
        x_range=(0, 10),
        y_range=(0, 10),
        title="Molecule Hover",
        background_fill_color="#efefef",
        tools="smiles-hover",
    )

    plot.circle("x", "y", size=10, line_width=0, fill_color="red", source=source)

    show(plot)
