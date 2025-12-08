#!/bin/bash

# Export Math4CS_AdaGrad.ipynb to release/Math4CS_AdaGrad.html
echo "Exporting notebook to HTML..."
jupyter nbconvert --to html --output release/Math4CS_AdaGrad.html Math4CS_AdaGrad.ipynb

# Run bundle_adagrad_slides.py
echo "Running bundle_adagrad_slides.py..."
python bundle_adagrad_slides.py

# Copy index.html to release/present.html
echo "Copying index.html to release/present.html..."
cp index.html release/present.html

# Copy Math4CS_AdaGrad.ipynb to release
echo "Copying notebook to release directory..."
cp Math4CS_AdaGrad.ipynb release/

echo "Release process completed!"
