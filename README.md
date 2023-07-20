# bokehmol

[![Powered by RDKit.js](https://img.shields.io/badge/Powered%20by-RDKit-3838ff.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAFVBMVEXc3NwUFP8UPP9kZP+MjP+0tP////9ZXZotAAAAAXRSTlMAQObYZgAAAAFiS0dEBmFmuH0AAAAHdElNRQfmAwsPGi+MyC9RAAAAQElEQVQI12NgQABGQUEBMENISUkRLKBsbGwEEhIyBgJFsICLC0iIUdnExcUZwnANQWfApKCK4doRBsKtQFgKAQC5Ww1JEHSEkAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wMy0xMVQxNToyNjo0NyswMDowMDzr2J4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDMtMTFUMTU6MjY6NDcrMDA6MDBNtmAiAAAAAElFTkSuQmCC)](https://www.rdkit.org/)


**bokehmol** provides custom extensions that help plotting molecules with the [Bokeh](https://docs.bokeh.org/) library.

It currently provides hover tools that can depict molecules on-the-fly using SMILES: no need to
pre-generate the depiction and store them in memory anymore!

## Installation

`bokehmol` requires `NodeJS` to be installed beforehand. This can be done easily with
conda or mamba:
```
conda install nodejs
```

The you should be able to pip install the package:
```
pip install bokehmol
```

Note that importing the package can be fairly slow as it currently needs to compile
some source files to provide the extensions.

## [Notebooks](https://github.com/cbouy/bokehmol/notebooks/)

Some examples on how to use the library

## [Discussions](https://github.com/cbouy/bokehmol/discussions)

Feature requests or questions on how to use should be posted here

## [Issues](https://github.com/cbouy/bokehmol/issues)

Bug tracker 🐞

> Bokehmol, gotta plot them mol!