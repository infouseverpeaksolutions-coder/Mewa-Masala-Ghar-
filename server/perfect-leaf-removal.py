import cv2
import numpy as np
import os

BANNERS_DIR = r'c:\Users\Hasnain Ansari\OneDrive\Desktop\mewa-masala-ghar\client\public\banners'
USER_DIR = r'C:\Users\Hasnain Ansari\.gemini\antigravity\brain\93fabff0-805a-4e96-a3f6-82cc69509508\.user_uploaded'
OUT_DIR = r'C:\Users\Hasnain Ansari\.gemini\antigravity\brain\93fabff0-805a-4e96-a3f6-82cc69509508'

def clean_seeds():
    img = cv2.imread(os.path.join(USER_DIR, 'media_1790024459265.png'))
    h, w, _ = img.shape
    clean = img.copy()

    # 1. Pure bokeh from x: 180..340 (width 160)
    bokeh_patch = img[0:245, 180:340]
    bokeh_flipped = cv2.flip(bokeh_patch, 1)

    top_clean = clean[0:245, 0:w].copy()
    top_clean[:, 0:160] = bokeh_flipped

    # Smooth transition from x: 130 to 180 into the original clean bokeh
    mask_top = np.zeros((245, w), dtype=np.float32)
    mask_top[:, 0:130] = 1.0
    for x in range(130, 180):
        t = (x - 130) / 50.0
        mask_top[:, x] = 0.5 * (1.0 + np.cos(np.pi * t))
    mask_top_3d = np.repeat(mask_top[:, :, np.newaxis], 3, axis=2)
    clean[0:245, 0:w] = (top_clean * mask_top_3d + img[0:245, 0:w] * (1.0 - mask_top_3d)).astype(np.uint8)

    # 2. Pure table from x: 130..300 (width 170)
    table_patch = img[245:h, 130:300]
    table_flipped = cv2.flip(table_patch, 1)

    bot_clean = clean[245:h, 0:w].copy()
    bot_clean[:, 0:170] = table_flipped

    mask_bot = np.zeros((h - 245, w), dtype=np.float32)
    mask_bot[:, 0:130] = 1.0
    for x in range(130, 180):
        t = (x - 130) / 50.0
        mask_bot[:, x] = 0.5 * (1.0 + np.cos(np.pi * t))
    mask_bot_3d = np.repeat(mask_bot[:, :, np.newaxis], 3, axis=2)
    clean[245:h, 0:w] = (bot_clean * mask_bot_3d + img[245:h, 0:w] * (1.0 - mask_bot_3d)).astype(np.uint8)

    cv2.imwrite(os.path.join(OUT_DIR, 'clean_perfect_seeds.png'), clean)
    cv2.imwrite(os.path.join(BANNERS_DIR, 'hero_slide_seeds.png'), clean)
    print("Cleaned seeds successfully!")

if __name__ == '__main__':
    clean_seeds()
