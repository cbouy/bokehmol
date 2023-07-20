import typing as t

Tooltips = t.Optional[t.Union[str, t.List[t.Tuple[str, str]]]]


def register_alias(rdkit_hover: bool = True, smiles_hover: bool = True) -> None:
    """Register the alias for hover tools to be used directly in the `tools`
    parameter of a figure, i.e. `rdkit_hover` and `smiles_hover`.
    """
    if rdkit_hover:
        from bokehmol.models.rdkit_hover import RDKitHover

        RDKitHover.register_alias("rdkit_hover", lambda: RDKitHover())
    if smiles_hover:
        from bokehmol.models.smilesdrawer_hover import SmilesDrawerHover

        SmilesDrawerHover.register_alias("smiles_hover", lambda: SmilesDrawerHover())


def rdkit(
    smiles_column: str = "SMILES",
    tooltips: Tooltips = None,
    width: int = 160,
    height: int = 120,
    remove_hs: bool = True,
    sanitize: bool = True,
    kekulize: bool = True,
    prefer_coordgen: bool = True,
    draw_options: t.Optional[t.Dict[str, t.Any]] = None,
    **kwargs: t.Any,
) -> "RDKitHover":
    """Hover tool that uses RDKit.js and the RDKit's Minimal Lib to depict
    SMILES strings on hover.

    Notes
    -----
    See https://www.npmjs.com/package/@rdkit/rdkit for the readme.

    Parameters
    ----------
    smiles_column: str = "SMILES"
        Column in the `ColumnDataSource` object containing the SMILES string.
    tooltips: t.Union[str, t.List[t.Tuple[str, str]]] = None
        Tooltips to render below the depiction. Can be an HTML string, or a list of
        tuples specifying the display name and column name that you want to display.
        Column names must be prefixed with `@` (or `$` for bokeh's internal
        variables), see bokeh's docs for more info on tooltips formats::

            >>> bokehmol.hover.rdkit(
            ...     tooltips=[
            ...         ("SMILES", "@SMILES"),
            ...         ("Name", "@{Molecule name}"),
            ...     ]
            ... )

    width: int = 160
        Image width in pixels
    height: int = 120
        Image height in pixels
    remove_hs: bool = True
        Remove hydrogens from the depiction
    sanitize: bool = True
        Sanitize the molecule
    kekulize: bool = True
        Kekulize the molecule
    prefer_coordgen: bool = True
        Prefer the CoordGen library for macrocycle rendering
    draw_options: t.Dict[str, t.Any] = None
        RDKit's MolDrawOptions to control the style of the drawing:
        https://www.rdkitjs.com/#drawing-molecules-all-options.::

            >>> bokehmol.hover.rdkit(
            ...     draw_options={
            ...         "addAtomIndices": True,
            ...     }
            ... )

    **kwargs: t.Any
        Additional parameters passed to bokeh's Hover tool.

    Returns
    -------
    An RDKit-based hover tool ready to be added to a bokeh plot::

        >>> from bokeh.plotting import figure
        >>> plot = figure(...)
        >>> hover_tool = bokehmol.hover.rdkit()
        >>> plot.add_tools(hover_tool)

    """
    from bokehmol.models.rdkit_hover import RDKitHover

    if tooltips is None:
        tooltips = []
    if draw_options is None:
        draw_options = {}
    return RDKitHover(
        smiles_column=smiles_column,
        tooltips=tooltips,
        width=width,
        height=height,
        remove_hs=remove_hs,
        sanitize=sanitize,
        kekulize=kekulize,
        prefer_coordgen=prefer_coordgen,
        draw_options=draw_options,
        **kwargs,
    )


def smiles_drawer(
    smiles_column: str = "SMILES",
    tooltips: Tooltips = None,
    width: int = 160,
    height: int = 120,
    theme: t.Literal[
        "light",
        "dark",
        "oldschool",
        "solarized",
        "solarized-dark",
        "matrix",
        "github",
        "carbon",
        "cyberpunk",
        "gruvbox",
        "gruvbox-dark",
    ] = "light",
    background_colour: str = "transparent",
    mol_options: t.Optional[t.Dict[str, t.Any]] = None,
    reaction_options: t.Optional[t.Dict[str, t.Any]] = None,
    **kwargs: t.Any,
) -> "SmilesDrawerHover":
    """Hover tool that uses SmilesDrawer to depict SMILES strings on hover.

    Notes
    -----
    See https://github.com/reymond-group/smilesDrawer#readme for the readme.
    Please cite the SmilesDrawer paper doi:10.1021/acs.jcim.7b00425 if you use this
    in academic work.

    Parameters
    ----------
    smiles_column: str = "SMILES"
        Column in the `ColumnDataSource` object containing the SMILES string.
    tooltips: t.Union[str, t.List[t.Tuple[str, str]]] = None
        Tooltips to render below the depiction. Can be an HTML string, or a list of
        tuples specifying the display name and column name that you want to display.
        Column names must be prefixed with `@` (or `$` for bokeh's internal
        variables), see bokeh's docs for more info on tooltips formats::

            >>> bokehmol.hover.smiles_drawer(
            ...     tooltips=[
            ...         ("SMILES", "@SMILES"),
            ...         ("Name", "@{Molecule name}"),
            ...     ]
            ... )

    width: int = 160
        Image width in pixels
    height: int = 120
        Image height in pixels
    theme: str = "light"
        Theme used for the rendering. One of the following list: light, dark,
        oldschool, solarized, solarized-dark, matrix, github, carbon, cyberpunk,
        gruvbox, gruvbox-dark.
    background_colour: str = "transparent"
        Any valid CSS color specification.
    mol_options: t.Dict[str, t.Any] = None
        SmilesDrawer options to control the style of the molecule's drawing:
        https://smilesdrawer.surge.sh/playground.html.::

            >>> bokehmol.hover.smiles_drawer(
            ...     mol_options={
            ...         "atomVisualization": "balls",
            ...     }
            ... )

    reaction_options: t.Dict[str, t.Any] = None
        Same as above for reaction's drawing.
    **kwargs: t.Any
        Additional parameters passed to bokeh's Hover tool.

    Returns
    -------
    A SmilesDrawer-based hover tool ready to be added to a bokeh plot::

        >>> from bokeh.plotting import figure
        >>> plot = figure(...)
        >>> hover_tool = bokehmol.hover.smiles_drawer()
        >>> plot.add_tools(hover_tool)

    """
    from bokehmol.models.smilesdrawer_hover import SmilesDrawerHover

    if tooltips is None:
        tooltips = []
    if mol_options is None:
        mol_options = {}
    if reaction_options is None:
        reaction_options = {}
    return SmilesDrawerHover(
        smiles_column=smiles_column,
        tooltips=tooltips,
        width=width,
        height=height,
        theme=theme,
        background_colour=background_colour,
        mol_options=mol_options,
        reaction_options=reaction_options,
        **kwargs,
    )
