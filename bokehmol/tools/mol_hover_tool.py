from bokehmol.formatters.rdkit_formatter import RDKitFormatter
from bokehmol.tools.base_hover_tool import BaseHoverTool


class MolHoverTool(BaseHoverTool, RDKitFormatter):
    __implementation__ = "mol_hover_tool.ts"


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

    plot.add_tools(
        MolHoverTool(smiles_column="smi", width=300, options={"addAtomIndices": True})
    )

    plot.circle("x", "y", size=10, line_width=0, fill_color="red", source=source)

    show(plot)
