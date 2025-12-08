#!/usr/bin/env python3
"""
Script to bundle Math4CS_AdaGrad_slides.html and slides-data.js into a single self-contained HTML file.
Merges HTML, inline CSS, JavaScript and embeds images as base64 data URLs.
"""

import os
import base64
import re
from pathlib import Path


def read_file(filepath):
    """Read file content."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()


def image_to_base64(image_path):
    """Convert image file to base64 data URL."""
    with open(image_path, 'rb') as f:
        image_data = f.read()
    
    # Determine MIME type based on extension
    ext = image_path.suffix.lower()
    mime_types = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp'
    }
    mime_type = mime_types.get(ext, 'image/png')
    
    base64_data = base64.b64encode(image_data).decode('utf-8')
    return f'data:{mime_type};base64,{base64_data}'


def embed_images(html_content, base_dir):
    """Find and embed all images as base64 data URLs."""
    # Pattern to match img src attributes
    img_pattern = r'<img\s+([^>]*?)src=["\']([^"\']+)["\']([^>]*?)>'
    
    def replace_image(match):
        before_src = match.group(1)
        img_src = match.group(2)
        after_src = match.group(3)
        
        # Skip if already a data URL
        if img_src.startswith('data:'):
            return match.group(0)
        
        # Resolve relative path
        if img_src.startswith('image/'):
            img_path = base_dir / img_src
        elif img_src.startswith('./image/'):
            img_path = base_dir / img_src[2:]
        else:
            img_path = base_dir / 'image' / img_src
        
        # Convert to base64 if file exists
        if img_path.exists():
            print(f"  Embedding image: {img_path.name}")
            base64_url = image_to_base64(img_path)
            return f'<img {before_src}src="{base64_url}"{after_src}>'
        else:
            print(f"  Warning: Image not found: {img_path}")
            return match.group(0)
    
    return re.sub(img_pattern, replace_image, html_content)


def embed_images_in_js(js_content, base_dir):
    """Find and embed all image paths in JavaScript content as base64 data URLs."""
    # Pattern to match image paths in JavaScript (e.g., "image/xxx.png")
    img_pattern = r'(["\'])(image/[^"\']+\.(?:png|jpg|jpeg|gif|svg|webp))["\']'

    def replace_image_path(match):
        quote = match.group(1)
        img_path_str = match.group(2)

        # Resolve path from base directory
        img_path = base_dir / img_path_str

        # Convert to base64 if file exists
        if img_path.exists():
            print(f"  Embedding image in JS: {img_path.name}")
            base64_url = image_to_base64(img_path)
            return f'{quote}{base64_url}{quote}'
        else:
            print(f"  Warning: Image not found in JS: {img_path}")
            return match.group(0)

    return re.sub(img_pattern, replace_image_path, js_content)


def bundle_adagrad_slides():
    """Bundle Math4CS_AdaGrad_slides.html and slides-data.js into a single HTML file."""
    
    # Define paths
    base_dir = Path(__file__).parent
    html_file = base_dir / 'Math4CS_AdaGrad_slides.html'
    slides_data_file = base_dir / 'slides-data.js'
    output_file = base_dir / 'index.html'
    
    # Check if files exist
    if not html_file.exists():
        print(f"❌ Error: {html_file} not found!")
        return
    
    if not slides_data_file.exists():
        print(f"❌ Error: {slides_data_file} not found!")
        return
    
    # Read source files
    print("Reading source files...")
    html_content = read_file(html_file)
    slides_data_js = read_file(slides_data_file)
    
    # Embed images in JavaScript files (slides-data.js)
    print("Embedding images in JavaScript...")
    slides_data_js = embed_images_in_js(slides_data_js, base_dir)
    
    # Replace external JS script with inline script
    print("Embedding JavaScript...")
    slides_data_inline = f'<script>\n{slides_data_js}\n</script>'
    html_content = html_content.replace(
        '<script src="slides-data.js"></script>',
        slides_data_inline
    )
    
    # Embed images in HTML content
    print("Embedding images in HTML...")
    html_content = embed_images(html_content, base_dir)
    
    # Write bundled file
    print(f"\nWriting bundled file to: {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    file_size_kb = os.path.getsize(output_file) / 1024
    file_size_mb = file_size_kb / 1024
    
    print(f"✅ Successfully created: {output_file}")
    if file_size_mb >= 1:
        print(f"📦 File size: {file_size_mb:.2f} MB")
    else:
        print(f"📦 File size: {file_size_kb:.2f} KB")
    print(f"\n🌐 Open the file in your browser to view the presentation:")
    print(f"   open {output_file}")


if __name__ == '__main__':
    bundle_adagrad_slides()
