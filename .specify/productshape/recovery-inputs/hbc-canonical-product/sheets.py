from PIL import Image, ImageOps, ImageDraw
from pathlib import Path
import json,sys,math
root=Path.cwd(); d=root/'.specify/productshape/recovery-inputs/hbc-canonical-product'
b=json.loads((d/'active-batch.json').read_text())
imgs=[s for s in b if Path(s['path']).suffix.lower() in ['.png','.jpg','.jpeg','.webp','.gif']]
for k in range(0,len(imgs),6):
 group=imgs[k:k+6]; canvas=Image.new('RGB',(1800,660*math.ceil(len(group)/3)),(240,240,240)); draw=ImageDraw.Draw(canvas)
 for j,s in enumerate(group):
  im=Image.open(root/s['path']); im.load()
  x=(j%3)*600;y=(j//3)*660
  thumb=ImageOps.contain(im.convert('RGB'),(590,600))
  canvas.paste(thumb,(x,y+48));draw.text((x+5,y+4),s['id']+' '+Path(s['path']).name,fill='black');draw.text((x+5,y+22),str(im.size),fill='black')
 out=d/f'sheet-{sys.argv[1]}-{k//6+1}.jpg';canvas.save(out,quality=88); print(str(out))
