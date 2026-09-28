import urllib.request
import cv2
import os

os.makedirs('client/public/products/seeds-aata', exist_ok=True)

# 1. Download pristine Chia Seeds
chia_url = 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80'
urllib.request.urlretrieve(chia_url, 'client/public/products/seeds-aata/chia_seeds.jpg')
print("Downloaded Chia Seeds!")

# 2. Download pristine Flax Seeds
flax_url = 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80'
urllib.request.urlretrieve(flax_url, 'client/public/products/seeds-aata/flax_seeds.jpg')
print("Downloaded Flax Seeds!")

# 3. Whole Wheat Atta from flour_aata.jpg
flour = cv2.imread('client/public/categories/flour_aata.jpg')
fh, fw = flour.shape[:2]
print(f"Flour shape: {fw}x{fh}")

# The Whole Wheat FLOUR bag is at x ~ 530 to 830, y ~ 60 to 600
wheat_bag_crop = flour[60:600, 540:840]
cv2.imwrite('client/public/products/seeds-aata/wheat_atta.jpg', wheat_bag_crop)
print("Saved Whole Wheat Atta bag crop!")

# 4. Multigrain Atta (Whole bowl + grain mix)
# The bowl of fresh ground flour with scoop at x ~ 270 to 680, y ~ 380 to 760
multigrain_crop = flour[380:760, 270:670]
cv2.imwrite('client/public/products/seeds-aata/multigrain_atta.jpg', multigrain_crop)
print("Saved Multigrain Atta crop!")
