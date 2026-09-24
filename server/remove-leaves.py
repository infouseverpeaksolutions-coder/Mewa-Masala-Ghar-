import cv2
import numpy as np
import os
from PIL import Image

BANNERS_DIR = r'c:\Users\Hasnain Ansari\OneDrive\Desktop\mewa-masala-ghar\client\public\banners'
OUT_DIR = r'C:\Users\Hasnain Ansari\.gemini\antigravity\brain\93fabff0-805a-4e96-a3f6-82cc69509508'

def clean_seeds_banner():
    """
    In seeds banner (1024x342):
    Leaves are at x: 0..210, y: 0..320.
    Clean bokeh is at x: 210..420.
    Wood table is at y: 245..342.
    """
    img_path = os.path.join(BANNERS_DIR, 'hero_slide_seeds.png')
    img = cv2.imread(img_path)
    h, w, c = img.shape
    
    # Create clean image
    clean = img.copy()
    
    # 1. Background bokeh:
    # Notice x: 200..380 has the smooth green bokeh background.
    # If we mirror or seamlessly blend x: 200..380 into x: 0..200 for y: 0..245:
    patch_bg = img[0:245, 200:390] # width 190
    patch_bg_flipped = cv2.flip(patch_bg, 1)
    
    # Blend smoothly with a horizontal alpha mask
    # For x: 0 to 200, smoothly transition to img at x: 180..220
    clean_bg = img[0:245, 0:w].copy()
    
    # Place patch
    clean_bg[0:245, 0:190] = patch_bg_flipped
    
    # Smooth the seam around x: 170..210
    mask = np.zeros((245, w), dtype=np.float32)
    mask[:, 0:170] = 1.0
    for x in range(170, 210):
        alpha = (210 - x) / 40.0
        mask[:, x] = alpha
        
    mask_3d = np.repeat(mask[:, :, np.newaxis], 3, axis=2)
    blended_top = (clean_bg * mask_3d + img[0:245, 0:w] * (1.0 - mask_3d)).astype(np.uint8)
    clean[0:245, 0:w] = blended_top

    # 2. Wood table on bottom left:
    # Table is at y: 245..342.
    # At x: 210..380, the table has empty wood grain.
    # Let's clone empty wood table from x: 210..370 to x: 0..160
    table_patch = img[245:h, 210:370] # width 160
    table_flipped = cv2.flip(table_patch, 1)
    
    clean_table = clean[245:h, 0:w].copy()
    clean_table[:, 0:160] = table_flipped
    
    tmask = np.zeros((h - 245, w), dtype=np.float32)
    tmask[:, 0:140] = 1.0
    for x in range(140, 180):
        tmask[:, x] = (180 - x) / 40.0
    tmask_3d = np.repeat(tmask[:, :, np.newaxis], 3, axis=2)
    blended_bottom = (clean_table * tmask_3d + img[245:h, 0:w] * (1.0 - tmask_3d)).astype(np.uint8)
    clean[245:h, 0:w] = blended_bottom
    
    cv2.imwrite(os.path.join(OUT_DIR, 'clean_hero_slide_seeds.png'), clean)
    print("Cleaned seeds banner saved.")

def clean_personal_care_banner():
    """
    In personal care banner (1024x342):
    Leaves are at x: 0..155, y: 50..320.
    Clean pink watercolor background is at x: 155..350.
    Wood table is at y: 245..342.
    """
    img_path = os.path.join(BANNERS_DIR, 'hero_slide_personal_care.png')
    img = cv2.imread(img_path)
    h, w, c = img.shape
    
    clean = img.copy()
    
    # 1. Background pink wash (y: 0..245)
    # Take clean pink wash from x: 160..320
    bg_patch = img[0:245, 160:320]
    bg_flipped = cv2.flip(bg_patch, 1)
    
    clean_bg = img[0:245, 0:w].copy()
    clean_bg[0:245, 0:160] = bg_flipped
    
    mask = np.zeros((245, w), dtype=np.float32)
    mask[:, 0:140] = 1.0
    for x in range(140, 180):
        mask[:, x] = (180 - x) / 40.0
    mask_3d = np.repeat(mask[:, :, np.newaxis], 3, axis=2)
    clean[0:245, 0:w] = (clean_bg * mask_3d + img[0:245, 0:w] * (1.0 - mask_3d)).astype(np.uint8)
    
    # 2. Wood table at bottom (y: 245..342)
    table_patch = img[245:h, 170:310] # width 140
    table_flipped = cv2.flip(table_patch, 1)
    
    clean_table = clean[245:h, 0:w].copy()
    clean_table[:, 0:140] = table_flipped
    
    tmask = np.zeros((h - 245, w), dtype=np.float32)
    tmask[:, 0:120] = 1.0
    for x in range(120, 160):
        tmask[:, x] = (160 - x) / 40.0
    tmask_3d = np.repeat(tmask[:, :, np.newaxis], 3, axis=2)
    clean[245:h, 0:w] = (clean_table * tmask_3d + img[245:h, 0:w] * (1.0 - tmask_3d)).astype(np.uint8)
    
    cv2.imwrite(os.path.join(OUT_DIR, 'clean_hero_slide_personal_care.png'), clean)
    print("Cleaned personal care banner saved.")

def clean_baby_poshan_banner():
    """
    In baby poshan banner (1024x342):
    Leaves are at x: 0..140, y: 170..342 (bottom-left corner).
    Clean sky-blue bokeh at y: 0..230.
    Clean counter at y: 230..342, x: 140..300.
    """
    img_path = os.path.join(BANNERS_DIR, 'hero_slide_baby_poshan.png')
    img = cv2.imread(img_path)
    h, w, c = img.shape
    
    clean = img.copy()
    
    # Bottom left counter & sprig
    # Clean counter from x: 140..290
    counter_patch = img[170:h, 140:290] # width 150
    counter_flipped = cv2.flip(counter_patch, 1)
    
    clean_bottom = clean[170:h, 0:w].copy()
    clean_bottom[:, 0:150] = counter_flipped
    
    mask = np.zeros((h - 170, w), dtype=np.float32)
    mask[:, 0:120] = 1.0
    for x in range(120, 160):
        mask[:, x] = (160 - x) / 40.0
    mask_3d = np.repeat(mask[:, :, np.newaxis], 3, axis=2)
    clean[170:h, 0:w] = (clean_bottom * mask_3d + img[170:h, 0:w] * (1.0 - mask_3d)).astype(np.uint8)
    
    cv2.imwrite(os.path.join(OUT_DIR, 'clean_hero_slide_baby_poshan.png'), clean)
    print("Cleaned baby poshan banner saved.")

def clean_dryfruits_banner():
    """
    In dryfruits banner (1024x342):
    Leaves at top left x: 0..160, y: 0..300.
    Clean window panes at x: 160..340.
    Wood table at y: 245..342, x: 160..300.
    """
    img_path = os.path.join(BANNERS_DIR, 'hero_slide_dryfruits.png')
    img = cv2.imread(img_path)
    h, w, c = img.shape
    
    clean = img.copy()
    
    # 1. Window pane patch (y: 0..245)
    # Mirror x: 160..320 to x: 0..160
    win_patch = img[0:245, 160:320]
    win_flipped = cv2.flip(win_patch, 1)
    
    clean_win = img[0:245, 0:w].copy()
    clean_win[0:245, 0:160] = win_flipped
    
    mask = np.zeros((245, w), dtype=np.float32)
    mask[:, 0:130] = 1.0
    for x in range(130, 170):
        mask[:, x] = (170 - x) / 40.0
    mask_3d = np.repeat(mask[:, :, np.newaxis], 3, axis=2)
    clean[0:245, 0:w] = (clean_win * mask_3d + img[0:245, 0:w] * (1.0 - mask_3d)).astype(np.uint8)
    
    # 2. Wood table at bottom (y: 245..342)
    table_patch = img[245:h, 170:320]
    table_flipped = cv2.flip(table_patch, 1)
    clean_table = clean[245:h, 0:w].copy()
    clean_table[:, 0:150] = table_flipped
    
    tmask = np.zeros((h - 245, w), dtype=np.float32)
    tmask[:, 0:120] = 1.0
    for x in range(120, 160):
        tmask[:, x] = (160 - x) / 40.0
    tmask_3d = np.repeat(tmask[:, :, np.newaxis], 3, axis=2)
    clean[245:h, 0:w] = (clean_table * tmask_3d + img[245:h, 0:w] * (1.0 - tmask_3d)).astype(np.uint8)
    
    cv2.imwrite(os.path.join(OUT_DIR, 'clean_hero_slide_dryfruits.png'), clean)
    print("Cleaned dryfruits banner saved.")

if __name__ == '__main__':
    clean_seeds_banner()
    clean_personal_care_banner()
    clean_baby_poshan_banner()
    clean_dryfruits_banner()
