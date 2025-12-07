#!/usr/bin/env python3
"""
Script to bundle the present folder into a single self-contained HTML file.
Merges index.html, style.css, script.js and embeds images as base64 data URLs.
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
        if img_src.startswith('../'):
            img_path = base_dir.parent / img_src[3:]
        elif img_src.startswith('./'):
            img_path = base_dir / img_src[2:]
        else:
            img_path = base_dir / img_src
        
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
    # Pattern to match image paths in JavaScript (e.g., "../image/xxx.png" or "../reports_dfl/xxx.png")
    img_pattern = r'(["\'])(\.\./(?:image|reports_dfl)/[^"\']+\.(?:png|jpg|jpeg|gif|svg|webp))["\']'

    def replace_image_path(match):
        quote = match.group(1)
        img_path_str = match.group(2)

        # Resolve relative path from present directory
        img_path = base_dir.parent / img_path_str.replace('../', '')

        # Convert to base64 if file exists
        if img_path.exists():
            print(f"  Embedding image in JS: {img_path.name}")
            base64_url = image_to_base64(img_path)
            return f'{quote}{base64_url}{quote}'
        else:
            print(f"  Warning: Image not found in JS: {img_path}")
            return match.group(0)

    return re.sub(img_pattern, replace_image_path, js_content)


def bundle_presentation():
    """Bundle all presentation files into a single HTML file."""
    
    # Define paths
    present_dir = Path(__file__).parent / 'present'
    output_file = Path(__file__).parent / 'index.html'
    
    # Read source files
    print("Reading source files...")
    html_content = read_file(present_dir / 'index.html')
    css_content = read_file(present_dir / 'style.css')
    slides_data_js = read_file(present_dir / 'slides-data.js')
    slides_renderer_js = read_file(present_dir / 'slides-renderer.js')
    
    # Embed images in JavaScript files (slides-data.js)
    print("Embedding images in JavaScript...")
    # First, embed direct image paths (../reports_dfl/...) as before
    slides_data_js = embed_images_in_js(slides_data_js, present_dir)

    # Additionally, embed images referenced by 'image' and 'dialogImage' fields in slides-data.js
    def embed_slide_image_fields(js_content, base_dir):
        # Matches: "image": "../image/xxx.png" or "../reports_dfl/xxx.png"
        field_pattern = r'(["\'])(image|dialogImage)["\']\s*:\s*(["\'])(\.\./(?:image|reports_dfl)/[^"\']+\.(?:png|jpg|jpeg|gif|svg|webp))["\']'
        def replace_field(match):
            field_quote = match.group(1)
            field_name = match.group(2)
            value_quote = match.group(3)
            img_path_str = match.group(4)
            img_path = base_dir.parent / img_path_str.replace('../', '')
            if img_path.exists():
                print(f"  Embedding {field_name} image: {img_path.name}")
                base64_url = image_to_base64(img_path)
                return f'{field_quote}{field_name}{field_quote}: {value_quote}{base64_url}{value_quote}'
            else:
                print(f"  Warning: {field_name} image not found: {img_path}")
                return match.group(0)
        return re.sub(field_pattern, replace_field, js_content)

    slides_data_js = embed_slide_image_fields(slides_data_js, present_dir)
    
    # Replace external CSS link with inline styles
    print("Embedding CSS...")
    css_inline = f'<style>\n{css_content}\n</style>'
    html_content = html_content.replace(
        '<link rel="stylesheet" href="style.css">',
        css_inline
    )
    
    # Replace external JS scripts with inline scripts
    print("Embedding JavaScript...")
    # Replace slides-data.js
    slides_data_inline = f'<script>\n{slides_data_js}\n</script>'
    html_content = html_content.replace(
        '<script src="slides-data.js"></script>',
        slides_data_inline
    )
    
    # Replace slides-renderer.js
    slides_renderer_inline = f'<script>\n{slides_renderer_js}\n</script>'
    html_content = html_content.replace(
        '<script src="slides-renderer.js"></script>',
        slides_renderer_inline
    )
    
    # Embed images as base64
    print("Embedding images...")
    html_content = embed_images(html_content, present_dir)
    
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
    bundle_presentation()
