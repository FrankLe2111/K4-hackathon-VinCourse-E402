#!/usr/bin/env bash
set -eu

cd "$(dirname "$0")/epub"
rm -f ../demo-slides.epub
zip -q -X0 ../demo-slides.epub mimetype
zip -q -Xr9 ../demo-slides.epub META-INF OEBPS
cd ..
mutool convert -W 1280 -H 720 -S 24 -o ../demo-slides.pdf demo-slides.epub
echo "Built demo-slides.pdf"
