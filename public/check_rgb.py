from PIL import Image
import numpy as np

png_path = r"c:\Users\yermi\OneDrive\Empresas\3 Rider Inversiones\App\Calculadora\public\ridermex_hoja_membretada.png"
img = Image.open(png_path).convert("RGB")
arr = np.array(img)

# Reshape to 2D array of RGB values
pixels = arr.reshape(-1, 3)

# Find average RGB
avg_rgb = np.mean(pixels, axis=0)
print(f"Average RGB: {avg_rgb}")

# Let's see some sample pixels from top, middle, and bottom
h, w, _ = arr.shape
print(f"Top-Left RGB (0,0): {arr[0,0]}")
print(f"Top-Middle RGB (0, {w//2}): {arr[0, w//2]}")
print(f"Middle-Middle RGB ({h//2}, {w//2}): {arr[h//2, w//2]}")
print(f"Bottom-Middle RGB ({h-1}, {w//2}): {arr[h-1, w//2]}")
