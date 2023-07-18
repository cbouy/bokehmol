from bokeh.core.properties import Override, String
from bokeh.models import HoverTool

from bokehmol.formatters.rdkit_formatter import RDKitFormatter


class MolHoverTool(HoverTool, RDKitFormatter):
    __implementation__ = "mol_hover_tool.ts"

    smiles_column = String(default="SMILES", help="Column containing SMILES string")
    tooltips = Override(default=[])


if __name__ == "__main__":
    from bokeh.models import ColumnDataSource
    from bokeh.plotting import figure, show

    source = ColumnDataSource(data=dict(x=[1, 8], y=[2, 5], smi=["CCO", "c1ccccc1"]))

    plot = figure(
        x_range=(0, 10),
        y_range=(0, 10),
        title="Molecule Hover",
        background_fill_color="#efefef",
        tools="",
    )

    plot.add_tools(MolHoverTool(smiles_column="smi"))

    plot.circle("x", "y", size=10, line_width=0, fill_color="red", source=source)

    show(plot)
