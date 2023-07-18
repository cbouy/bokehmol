from bokeh.core.properties import Bool, Float, Int, Tuple

from bokehmol.config import settings
from bokehmol.formatters.base_formatter import BaseFormatter


class RDKitFormatter(BaseFormatter):
    __implementation__ = "rdkit_formatter.ts"
    __javascript__ = settings.rdkitjs_src

    add_atom_indices = Bool(default=False)
    add_bond_indices = Bool(default=False)
    additional_atom_label_padding = Float(default=0.0)
    add_stereo_annotation = Bool(default=False)
    annotation_colour = Tuple(Float, Float, Float, Float, default=(0, 0, 0, 1))
    annotation_font_scale = Float(default=0.5)
    atom_label_deuterium_tritium = Bool(default=False)
    background_colour = Tuple(Float, Float, Float, Float, default=(1, 1, 1, 1))
    bond_line_width = Float(default=2.0)
    centre_molecules_before_drawing = Bool(default=False)
    clear_background = Bool(default=True)
    comic_mode = Bool(default=False)
    dummies_are_attachments = Bool(default=False)
    explicit_methyl = Bool(default=False)
    fixed_bond_length = Float(default=-1.0)
    fixed_scale = Float(default=-1.0)
    flag_close_contacts_dist = Float(default=3.0)
    include_radicals = Bool(default=True)
    max_font_size = Int(default=40)
    min_font_size = Int(default=6)
    multiple_bond_offset = Float(default=0.15)
    padding = Float(default=0.05)
    prefer_coordgen = Bool(default=True)
    prepare_mols_before_drawing = Bool(default=True)
    remove_hs = Bool(default=True)
    rotate = Float(default=0.0)
    sanitize = Bool(default=True)
    scale_bond_width = Bool(default=False)
    symbol_colour = Tuple(Float, Float, Float, Float, default=(0, 0, 0, 1))


if __name__ == "__main__":
    from bokeh.models import ColumnDataSource, HoverTool
    from bokeh.plotting import figure, show

    source = ColumnDataSource(
        data=dict(x=[1, 8, 3], y=[2, 5, 7], smi=["CCO", "c1ccccc1", "[n]"])
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
        <div style="position: relative; left=0;">@smi{custom}</div>
        <div style="position: relative;">
            <span style="font-size: 10px; word-wrap: break-word;">@smi</span>
        </div>
    </div>"""

    plot.add_tools(
        HoverTool(
            tooltips=hover_tooltip,
            formatters={"@smi": RDKitFormatter()},
        )
    )

    plot.circle("x", "y", size=10, line_width=0, fill_color="red", source=source)

    show(plot)
