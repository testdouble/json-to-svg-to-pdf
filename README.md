# json-to-svg-to-pdf

This is a silly module we wrote to generate business cards. As a result,
consider this module very
[YMMV](https://en.wiktionary.org/wiki/your_mileage_may_vary). (Spoiler alert:
the code is intentionally dense for use as a refactoring exercise.)

To use this yourself:

1. Define two SVG templates in `template/front.svg` and `template/back.svg` with
   whatever [mustache](https://mustache.github.io) template strings you like
   (e.g. `{{fullName}}`)
2. Create a JSON/CSON for each person in `input/` (e.g. `input/justin.cson`)
   that defines those mustache attribute names
3. Run `json-to-svg-to-pdf`

What you'll get is, for each input file, a pair of font-embedded PDFs in
`output/` (e.g.
`output/justin-front.pdf` and `output/justin-back.pdf`).

## Prerequisites

The PDF generation relies on [Inkscape](https://inkscape.org/)'s `inkscape`
binary being on your path.

To install it on a Mac with [Homebrew](https://brew.sh) and
[Homebrew Cask](https://caskroom.github.io/), run
`brew cask install xquartz inkscape`.

## TODO

The glaring limitation currently is the code assumes you have exactly two
templates defined for each input. It could be complicated/improved to discover
1…n templates and follow the same naming pattern
