#!/bin/bash

# Activate virtual environment
source ../.venv/bin/activate

# Try to export notebook to PDF (requires LaTeX)
echo "Exporting notebook to PDF..."
if jupyter nbconvert --to pdf --output ../Math4CS_AdaGrad.pdf Math4CS_AdaGrad.ipynb 2>/dev/null; then
    echo "✅ PDF created successfully with LaTeX"
else
    echo "⚠️  PDF conversion failed (requires pandoc and LaTeX)"
    echo "   Creating HTML version instead..."
    jupyter nbconvert --to html --output ../Math4CS_AdaGrad.html Math4CS_AdaGrad.ipynb
    echo "   To enable PDF: brew install pandoc basictex"
fi

# Run bundle_adagrad_slides.py (which outputs to ../index.html)
echo "Running bundle_adagrad_slides.py..."
python bundle_adagrad_slides.py

# Copy Math4CS_AdaGrad.ipynb to parent directory
echo "Copying notebook to root directory..."
cp Math4CS_AdaGrad.ipynb ../

echo "✅ Release process completed!"
echo ""
echo "Output files in root directory:"
echo "  - index.html (presentation)"
if [ -f "../Math4CS_AdaGrad.pdf" ]; then
    echo "  - Math4CS_AdaGrad.pdf (notebook)"
else
    echo "  - Math4CS_AdaGrad.html (notebook)"
fi
echo "  - Math4CS_AdaGrad.ipynb (notebook source)"
