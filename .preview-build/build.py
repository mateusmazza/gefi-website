import pathlib,base64,zipfile,io,json,urllib.request,hashlib,shutil
r=pathlib.Path('.')
encoded=''.join(p.read_text() for p in sorted((r/'.preview-build').glob('part-*')))
zipfile.ZipFile(io.BytesIO(base64.b64decode(encoded))).extractall(r)
for item in json.loads((r/'.preview-downloads.json').read_text()):
 p=r/item['path'];p.parent.mkdir(parents=True,exist_ok=True)
 data=urllib.request.urlopen(item['source_url'],timeout=90).read()
 assert hashlib.sha256(data).hexdigest()==item['sha256'],item['path']
 p.write_bytes(data)
shutil.rmtree(r/'.preview-build');(r/'.preview-downloads.json').unlink()
(r/'.github/workflows/rebuild-preview.yml').unlink()
