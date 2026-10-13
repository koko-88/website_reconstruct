"""Original, reproducible sculpture. Run only in a separate --background --factory-startup process."""
import bpy
import math
import pathlib
import sys

destination = pathlib.Path(sys.argv[sys.argv.index('--') + 1]).resolve()
destination.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
material = bpy.data.materials.new('Oxide satin')
material.use_nodes = True
shader = next(n for n in material.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
shader.inputs['Base Color'].default_value = (0.48, 0.15, 0.07, 1)
shader.inputs['Metallic'].default_value = 0.55
shader.inputs['Roughness'].default_value = 0.28
for index in range(3):
    bpy.ops.mesh.primitive_torus_add(major_radius=1.15 - index * 0.22, minor_radius=0.13,
                                   major_segments=64, minor_segments=12,
                                   rotation=(math.pi / 2, index * math.pi / 3, index * math.pi / 3))
    ring = bpy.context.object
    ring.name = f'Folded orbit {index + 1}'
    ring.data.materials.append(material)
    for polygon in ring.data.polygons:
        polygon.use_smooth = True
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.38)
bpy.context.object.name = 'Core'
bpy.context.object.data.materials.append(material)
bpy.ops.wm.save_as_mainfile(filepath=str(destination / 'form.blend'))
bpy.ops.export_scene.gltf(filepath=str(destination / 'form.raw.glb'), export_format='GLB',
                          export_apply=True, export_yup=True, export_cameras=False, export_lights=False)
print('CREATIVE_EXPORT_COMPLETE')
