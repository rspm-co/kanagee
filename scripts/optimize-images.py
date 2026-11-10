"""Convert public PNGs to WebP, preserving source files outside the deployed site."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json
from io import BytesIO

root = Path(__file__).resolve().parent.parent
public = root / 'public'
sources = root / 'source-assets' / 'images'
sources.mkdir(parents=True, exist_ok=True)
files = {p.name: p for p in sources.glob('*.png')}
files.update({p.name: p for p in public.glob('*.png')})
logos = {'kanagee-logo-transparent', 'ladachi-kulfi-logo', 'rs-papal-logo', 'udyami-maharashtra-logo', 'mea-logo', 'travelyfoodie-logo', 'mla-logo'}
responsive = {'heritage-thali-cutout', 'experience-thali-cutout', 'seafood-platter', 'festival-thali', 'konkan-fried-fish', 'konkan-fish-curry', 'western-maharashtra-meat-curry', 'western-maharashtra-thali', 'vidarbha-saoji-thali', 'marathwada-dhapate-thali', 'uttar-maharashtra-khandeshi-thali', 'uttar-maharashtra-dal-bati'}
results = []
for name, path in sorted(files.items()):
    with Image.open(path) as original:
        image = ImageOps.exif_transpose(original)
        image = image.convert('RGBA' if 'A' in image.getbands() else 'RGB')
        logo_limits = {'travelyfoodie-logo':256, 'mla-logo':256, 'mea-logo':480,
                       'udyami-maharashtra-logo':320, 'ladachi-kulfi-logo':256,
                       'rs-papal-logo':495}
        if path.stem in logo_limits:
            limit = logo_limits[path.stem]
            image.thumbnail((limit, limit), Image.Resampling.LANCZOS)
        target = public / (path.stem + '.webp')
        options = {'format': 'WEBP', 'method': 4, 'exact': True}
        if path.stem in logos:
            options.update(quality=82)
        else:
            options.update(quality=82 if path.stem == 'chairman-portrait' else 76)
        image.save(target, **options)
        if path.stem in logos:
            lossless = BytesIO()
            image.save(lossless, format='WEBP', lossless=True, method=4, exact=True)
            if len(lossless.getvalue()) < target.stat().st_size:
                target.write_bytes(lossless.getvalue())
        with Image.open(target) as check:
            assert check.size == image.size, name
            if 'A' in image.getbands():
                assert check.convert('RGBA').getchannel('A').tobytes() == image.getchannel('A').tobytes(), 'Alpha changed: ' + name
        if path.stem == 'kanagee-logo-transparent':
            for width in (128, 256):
                sized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
                sized.save(public / f'{path.stem}-{width}w.webp', **options)
        if path.stem in responsive:
            for width in (480, 640, 800):
                if width >= image.width:
                    continue
                sized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
                sized.save(public / f'{path.stem}-{width}w.webp', **options)
        results.append({'name': name, 'original': path.stat().st_size, 'webp': target.stat().st_size})
    if path.parent == public:
        archive = sources / name
        if not path.resolve().is_relative_to(root) or not archive.resolve().is_relative_to(root):
            raise RuntimeError('Source archive path outside workspace')
        if archive.exists():
            raise RuntimeError('Original already archived: ' + name)
        path.rename(archive)

# Additional supplied WebP originals: generate small display variants without
# repeatedly recompressing the source assets.
for stem, widths in [('madhura-bachal-portrait', (240, 360))]:
    source = public / (stem + ('-800w.webp' if stem == 'madhura-bachal-portrait' else '.webp'))
    with Image.open(source) as image:
        for width in widths:
            sized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
            sized.save(public / f'{stem}-{width}w.webp', format='WEBP', quality=80, method=4, exact=True)

preview_names = ['kanagee-logo-transparent', 'heritage-thali-cutout', 'seafood-platter', 'chairman-portrait']
canvas = Image.new('RGB', (640, len(preview_names)*260), '#fff9e6')
draw = ImageDraw.Draw(canvas)
for row, stem in enumerate(preview_names):
    for col, path in enumerate((sources/(stem+'.png'), public/(stem+'.webp'))):
        with Image.open(path) as image:
            image = image.convert('RGBA')
            image.thumbnail((290, 225), Image.Resampling.LANCZOS)
            x = col*320+(320-image.width)//2
            y = row*260+24+(225-image.height)//2
            canvas.paste(image, (x,y), image)
        draw.text((col*320+12,row*260+7), 'Original PNG' if col==0 else 'Optimized WebP', fill='#4e1716')
preview = root/'tmp'/'image-optimization-preview.jpg'
preview.parent.mkdir(exist_ok=True)
canvas.save(preview, quality=90)
print(json.dumps(results))
old = sum(r['original'] for r in results)
new = sum(r['webp'] for r in results)
print(f'TOTAL: {old:,} -> {new:,} bytes; reduction {(1-new/old)*100:.1f}%')
