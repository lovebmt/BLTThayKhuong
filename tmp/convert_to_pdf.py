#!/usr/bin/env python3
"""
Convert HTML to PDF using weasyprint
"""
import sys
from pathlib import Path

try:
    from weasyprint import HTML
    
    html_file = Path('../Math4CS_AdaGrad.html')
    pdf_file = Path('../Math4CS_AdaGrad.pdf')
    
    if not html_file.exists():
        print(f"Error: {html_file} not found!")
        sys.exit(1)
    
    print(f"Converting {html_file} to {pdf_file}...")
    HTML(str(html_file)).write_pdf(str(pdf_file))
    print(f"✅ Successfully created PDF: {pdf_file}")
    sys.exit(0)
    
except ImportError:
    print("Error: weasyprint not installed")
    print("Install with: pip install weasyprint")
    sys.exit(1)
except Exception as e:
    print(f"Error converting to PDF: {e}")
    sys.exit(1)
