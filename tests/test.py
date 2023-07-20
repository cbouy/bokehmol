from bokeh.models import ColumnDataSource
from bokeh.plotting import figure, show

import bokehmol

bokehmol.register_alias()

source = ColumnDataSource(
    data=dict(x=[1, 8, 3], y=[2, 5, 7], SMILES=["CCO", "c1ccccc1", "[n]"])
)

plot = figure(
    x_range=(0, 10),
    y_range=(0, 10),
    title="Molecule Hover",
    background_fill_color="#efefef",
    tools="rdkit_hover",
)

plot.circle("x", "y", size=10, line_width=0, fill_color="red", source=source)

show(plot)
