from PIL import Image
import numpy as np

png_path = r"c:\Users\yermi\OneDrive\Empresas\3 Rider Inversiones\App\Calculadora\public\ridermex_hoja_membretada.png"
img = Image.open(png_path).convert("L")
arr = np.array(img)

total_pixels = arr.size
white_pixels = np.sum(arr >= 250)
percent_white = (white_pixels / total_pixels) * 100

print(f"Total pixels: {total_pixels}")
print(f"White pixels (>=250 grayscale): {white_pixels} ({percent_white:.2f}%)")
print(f"Non-white pixels: {total_pixels - white_pixels} ({100 - percent_white:.2f}%)")
