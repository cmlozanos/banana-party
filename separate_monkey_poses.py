#!/usr/bin/env python3
"""
Script para separar monkey_poses-removebg-preview.png en 9 archivos PNG individuales.
La imagen ya tiene fondo transparente, solo necesitamos dividirla en 3x3.
"""

from PIL import Image
import os

def separate_monkey_poses():
    # Abrir la imagen PNG con fondo transparente
    img_path = 'images/monkey_poses-removebg-preview.png'
    
    if not os.path.exists(img_path):
        print(f"❌ Error: No se encontró el archivo {img_path}")
        return
    
    img = Image.open(img_path)
    
    # Verificar que tiene canal alpha
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Obtener dimensiones
    width, height = img.size
    print(f"📐 Dimensiones de la imagen: {width}x{height}")
    
    # Dividir en 3x3 = 9 partes
    tile_width = width / 3
    tile_height = height / 3
    
    print(f"📦 Tamaño teórico de cada tile: {tile_width:.1f}x{tile_height:.1f}")
    
    # Crear directorio de salida
    output_dir = 'images/monkey_poses'
    os.makedirs(output_dir, exist_ok=True)
    
    # Nombres descriptivos para cada pose
    pose_names = [
        'idle',           # 1: Mono de pie, brazos cerca del cuerpo
        'point_left',     # 2: Mono señalando a la izquierda
        'wave',           # 3: Mono saludando con brazos extendidos
        'run_left',       # 4: Mono corriendo hacia la izquierda
        'run_forward',    # 5: Mono corriendo hacia adelante
        'high_five',      # 6: Mono levantando la mano para chocar
        'crouch',         # 7: Mono agachado/preparándose para saltar
        'jump',           # 8: Mono saltando/lanzándose
        'kick'            # 9: Mono pateando con efecto de movimiento
    ]
    
    # Extraer cada mono
    # Usar un margen generoso para asegurar que capturamos completamente cada mono
    # incluyendo cualquier parte que se extienda más allá de las divisiones teóricas
    margin = 20  # Margen en píxeles alrededor de cada división
    
    for row in range(3):
        for col in range(3):
            # Calcular coordenadas con margen para capturar completamente cada mono
            left = max(0, int(col * tile_width) - margin)
            top = max(0, int(row * tile_height) - margin)
            
            # Para el último tile de cada fila/columna, asegurar que llegue hasta el final
            if col == 2:
                right = width
            else:
                right = min(width, int((col + 1) * tile_width) + margin)
            if row == 2:
                bottom = height
            else:
                bottom = min(height, int((row + 1) * tile_height) + margin)
            
            print(f"  Tile [{row},{col}]: ({left},{top}) -> ({right},{bottom}) [con margen]")
            
            # Recortar la región con margen
            tile = img.crop((left, top, right, bottom))
            
            # Detectar los límites reales del mono dentro de esta región
            # getbbox() encuentra el rectángulo más pequeño que contiene todos los píxeles no transparentes
            bbox = tile.getbbox()
            
            if bbox:
                print(f"    Bbox inicial detectado: ({bbox[0]},{bbox[1]}) -> ({bbox[2]},{bbox[3]})")
                
                # Analizar los bordes para detectar y eliminar restos de otros monos
                # Buscar el grupo principal de píxeles (el mono principal)
                # y eliminar cualquier contenido aislado cerca de los bordes
                
                # Obtener los datos de píxeles para análisis
                pixels = tile.load()
                width_tile, height_tile = tile.size
                
                # Analizar cada borde para detectar contenido aislado (restos de otros monos)
                # Si hay muy pocos píxeles no transparentes cerca de un borde, probablemente es un resto
                edge_check_size = 20  # Tamaño de la zona de borde a analizar (aumentado)
                min_pixels_for_edge = 30  # Mínimo de píxeles no transparentes para considerar que es parte del mono (reducido para detectar mejor)
                
                # Analizar borde izquierdo
                left_edge_pixels = 0
                for y in range(height_tile):
                    for x in range(min(edge_check_size, width_tile)):
                        if pixels[x, y][3] > 0:  # Alpha > 0
                            left_edge_pixels += 1
                
                # Analizar borde derecho
                right_edge_pixels = 0
                for y in range(height_tile):
                    for x in range(max(0, width_tile - edge_check_size), width_tile):
                        if pixels[x, y][3] > 0:
                            right_edge_pixels += 1
                
                # Analizar borde superior
                top_edge_pixels = 0
                for x in range(width_tile):
                    for y in range(min(edge_check_size, height_tile)):
                        if pixels[x, y][3] > 0:
                            top_edge_pixels += 1
                
                # Analizar borde inferior
                bottom_edge_pixels = 0
                for x in range(width_tile):
                    for y in range(max(0, height_tile - edge_check_size), height_tile):
                        if pixels[x, y][3] > 0:
                            bottom_edge_pixels += 1
                
                # Ajustar el bbox eliminando bordes con muy pocos píxeles (restos de otros monos)
                # Solo eliminamos si el bbox original incluye ese borde Y hay pocos píxeles
                bbox_left = bbox[0]
                bbox_top = bbox[1]
                bbox_right = bbox[2]
                bbox_bottom = bbox[3]
                
                # Calcular el área central del mono (excluyendo los bordes)
                center_left = bbox[0] + edge_check_size
                center_right = bbox[2] - edge_check_size
                center_top = bbox[1] + edge_check_size
                center_bottom = bbox[3] - edge_check_size
                
                # Contar píxeles en el área central (el mono principal)
                center_pixels = 0
                if center_left < center_right and center_top < center_bottom:
                    for y in range(center_top, center_bottom):
                        for x in range(center_left, center_right):
                            if pixels[x, y][3] > 0:
                                center_pixels += 1
                
                # Si hay muy pocos píxeles en un borde comparado con el centro, es probablemente un resto
                if left_edge_pixels < min_pixels_for_edge and bbox[0] < edge_check_size:
                    # Verificar si el borde izquierdo tiene menos del 10% de los píxeles del centro
                    if center_pixels > 0 and left_edge_pixels < center_pixels * 0.1:
                        bbox_left = max(bbox[0], edge_check_size)
                        print(f"    🧹 Eliminando resto en borde izquierdo ({left_edge_pixels} vs {center_pixels} píxeles centrales)")
                
                if right_edge_pixels < min_pixels_for_edge and bbox[2] > width_tile - edge_check_size:
                    if center_pixels > 0 and right_edge_pixels < center_pixels * 0.1:
                        bbox_right = min(bbox[2], width_tile - edge_check_size)
                        print(f"    🧹 Eliminando resto en borde derecho ({right_edge_pixels} vs {center_pixels} píxeles centrales)")
                
                if top_edge_pixels < min_pixels_for_edge and bbox[1] < edge_check_size:
                    if center_pixels > 0 and top_edge_pixels < center_pixels * 0.1:
                        bbox_top = max(bbox[1], edge_check_size)
                        print(f"    🧹 Eliminando resto en borde superior ({top_edge_pixels} vs {center_pixels} píxeles centrales)")
                
                if bottom_edge_pixels < min_pixels_for_edge and bbox[3] > height_tile - edge_check_size:
                    if center_pixels > 0 and bottom_edge_pixels < center_pixels * 0.1:
                        bbox_bottom = min(bbox[3], height_tile - edge_check_size)
                        print(f"    🧹 Eliminando resto en borde inferior ({bottom_edge_pixels} vs {center_pixels} píxeles centrales)")
                
                # Añadir un pequeño margen limpio alrededor del mono detectado
                # Usar un margen pequeño para evitar incluir restos de otros monos
                bbox_margin = 3  # Margen muy pequeño para mantener solo el mono principal
                bbox_left = max(0, bbox_left - bbox_margin)
                bbox_top = max(0, bbox_top - bbox_margin)
                bbox_right = min(width_tile, bbox_right + bbox_margin)
                bbox_bottom = min(height_tile, bbox_bottom + bbox_margin)
                
                print(f"    Bbox final (con margen mínimo): ({bbox_left},{bbox_top}) -> ({bbox_right},{bbox_bottom})")
                
                # Recortar al área del mono principal sin restos
                tile = tile.crop((bbox_left, bbox_top, bbox_right, bbox_bottom))
                
                # Verificación final: asegurarse de que el tile recortado solo contiene el mono principal
                # Si hay píxeles aislados en los bordes del tile recortado, eliminarlos
                final_bbox = tile.getbbox()
                if final_bbox:
                    # Si el bbox final no ocupa todo el tile, hay espacio vacío que podemos eliminar
                    if (final_bbox[0] > 2 or final_bbox[1] > 2 or 
                        final_bbox[2] < tile.width - 2 or final_bbox[3] < tile.height - 2):
                        # Hay espacio vacío significativo, recortar más
                        tile = tile.crop(final_bbox)
                        print(f"    ✂️  Recorte adicional aplicado: {tile.size[0]}x{tile.size[1]}")
            else:
                print(f"    ⚠️  No se detectó contenido en este tile")
            
            # Guardar como PNG (mantiene la transparencia)
            pose_index = row * 3 + col
            output_path = f'{output_dir}/monkey_{pose_names[pose_index]}.png'
            tile.save(output_path, 'PNG')
            print(f"✅ Guardado: {output_path} ({tile.size[0]}x{tile.size[1]})")
    
    print(f"\n🎉 Proceso completado. 9 archivos PNG creados en {output_dir}/")
    print(f"   Archivos creados:")
    for i, name in enumerate(pose_names, 1):
        print(f"   {i}. monkey_{name}.png")

if __name__ == '__main__':
    try:
        separate_monkey_poses()
    except ImportError:
        print("❌ Error: Se requiere la biblioteca Pillow (PIL)")
        print("   Instálala con: pip install Pillow")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
