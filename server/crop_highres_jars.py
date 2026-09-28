import cv2
import os

os.makedirs('client/public/products/spices', exist_ok=True)
os.makedirs('client/public/products/seeds-aata', exist_ok=True)

# 1. SPICES JARS from spices_jars.jpg (768 x 1376)
spices = cv2.imread('client/public/banners/spices_jars.jpg')
h, w = spices.shape[:2]
print(f"Spices shape: {w}x{h}")

# The 3 jars are positioned side by side:
# Jar 1 (Haldi): x ~ 370 to 620, y ~ 230 to 670
# Jar 2 (Lal Mirch): x ~ 610 to 860, y ~ 230 to 670
# Jar 3 (Dhaniya): x ~ 850 to 1100, y ~ 230 to 670

# Let's crop square/portrait with clean margins:
haldi_crop = spices[220:680, 360:620]
lal_mirch_crop = spices[220:680, 600:860]
dhaniya_crop = spices[220:680, 840:1100]

cv2.imwrite('client/public/products/spices/haldi.jpg', haldi_crop)
cv2.imwrite('client/public/products/spices/lal_mirch.jpg', lal_mirch_crop)
cv2.imwrite('client/public/products/spices/dhaniya.jpg', dhaniya_crop)
print("Saved spices jars successfully!")

# 2. SEEDS JARS from seed_jars.jpg (682 x 1024)
seeds = cv2.imread('client/public/banners/seed_jars.jpg')
sh, sw = seeds.shape[:2]
print(f"Seeds shape: {sw}x{sh}")

# Jar 1 (Mix Seeds): x ~ 90 to 380, y ~ 80 to 570
# Jar 2 (Sunflower Seeds): x ~ 360 to 650, y ~ 80 to 570
# Jar 3 (Watermelon/Pumpkin Seeds): x ~ 630 to 920, y ~ 80 to 570

mix_seeds_crop = seeds[80:570, 95:385]
sunflower_crop = seeds[80:570, 365:655]
pumpkin_crop = seeds[80:570, 635:925]

cv2.imwrite('client/public/products/seeds-aata/mix_seeds.jpg', mix_seeds_crop)
cv2.imwrite('client/public/products/seeds-aata/sunflower_seeds.jpg', sunflower_crop)
cv2.imwrite('client/public/products/seeds-aata/pumpkin_seeds.jpg', pumpkin_crop)
print("Saved seed jars successfully!")
