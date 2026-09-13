"""
matching.py
------------
Core AI matching logic for the Lost & Found system.

What this does:
1. Loads a pretrained ResNet-50 model (no training involved).
2. Extracts a feature vector from any image.
3. Compares two feature vectors using Cosine Similarity.
4. Combines image similarity with category, location, and time
   matching into one final weighted match score.

This file has NO Flask code — it's pure logic, so it can be
imported into app.py later, or run standalone for testing.
"""

import torch
import torchvision.models as models
from torchvision import transforms
from PIL import Image
from scipy.spatial.distance import cosine
from datetime import datetime
from difflib import SequenceMatcher

# ------------------------------------------------------------------
# STEP 1: Load the pretrained ResNet-50 model (ONCE, when this file
# is imported). We remove the final classification layer so the
# output is a feature vector, not a class prediction.
# ------------------------------------------------------------------
print("Loading pretrained ResNet-50... (first run may take a minute)")
_model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
_model = torch.nn.Sequential(*list(_model.children())[:-1])  # drop last layer
_model.eval()
print("Model loaded successfully.")

_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])


# ------------------------------------------------------------------
# STEP 2: Feature extraction function
# ------------------------------------------------------------------
def get_features(image_path):
    """Takes an image path, returns a 2048-length feature vector."""
    img = Image.open(image_path).convert('RGB')
    img_tensor = _transform(img).unsqueeze(0)  # add batch dimension
    with torch.no_grad():
        features = _model(img_tensor)
    return features.flatten().numpy()


# ------------------------------------------------------------------
# STEP 3: Image similarity (Cosine Similarity)
# ------------------------------------------------------------------
def image_similarity(image_path_1, image_path_2):
    """Returns a similarity score between 0 and 1 (1 = identical)."""
    f1 = get_features(image_path_1)
    f2 = get_features(image_path_2)
    similarity = 1 - cosine(f1, f2)  # cosine() returns distance, so we invert
    return max(0, similarity)  # clip negative values to 0


# ------------------------------------------------------------------
# STEP 4: Category match (simple exact match, case-insensitive)
# ------------------------------------------------------------------
def category_match(category_1, category_2):
    return 1.0 if category_1.strip().lower() == category_2.strip().lower() else 0.0


# ------------------------------------------------------------------
# STEP 5: Location match (simple exact match, case-insensitive)
# ------------------------------------------------------------------
def location_match(location_1, location_2):
    return 1.0 if location_1.strip().lower() == location_2.strip().lower() else 0.0


# ------------------------------------------------------------------
# STEP 5b: Description match (simple text similarity, no extra
# libraries needed -- uses Python's built-in difflib).
# Returns a value between 0 and 1 (1 = identical text).
# ------------------------------------------------------------------
def description_match(description_1, description_2):
    if not description_1 or not description_2:
        return 0.0  # if either description is missing, treat as no info
    text1 = description_1.strip().lower()
    text2 = description_2.strip().lower()
    return SequenceMatcher(None, text1, text2).ratio()


# ------------------------------------------------------------------
# STEP 6: Time closeness (1.0 if within 48 hrs, scaled down after)
# ------------------------------------------------------------------
def time_closeness(datetime_str_1, datetime_str_2, max_hours=48):
    fmt = "%Y-%m-%d %H:%M"
    t1 = datetime.strptime(datetime_str_1, fmt)
    t2 = datetime.strptime(datetime_str_2, fmt)
    diff_hours = abs((t2 - t1).total_seconds()) / 3600

    if diff_hours >= max_hours:
        return 0.0
    return 1 - (diff_hours / max_hours)  # closer in time = closer to 1.0


# ------------------------------------------------------------------
# STEP 7: Final combined match score
# ------------------------------------------------------------------
def calculate_match_score(lost_item, found_item):
    """
    lost_item / found_item: dicts with keys
      'image_path', 'category', 'location', 'date_time',
      and optionally 'description'.
    Returns match score as a percentage (0-100).

    Weights (sum to 100%):
      Image similarity   -> 50%
      Category match      -> 20%
      Location match      -> 15%
      Time closeness       -> 10%
      Description match  -> 5%   (minor tiebreaker only)
    """
    img_score = image_similarity(lost_item['image_path'], found_item['image_path'])
    cat_score = category_match(lost_item['category'], found_item['category'])
    loc_score = location_match(lost_item['location'], found_item['location'])
    time_score = time_closeness(lost_item['date_time'], found_item['date_time'])
    desc_score = description_match(
        lost_item.get('description', ''), found_item.get('description', '')
    )

    final_score = (
        img_score * 0.50 +
        cat_score * 0.20 +
        loc_score * 0.15 +
        time_score * 0.10 +
        desc_score * 0.05
    )
    return round(final_score * 100, 2)  # as a percentage


# ------------------------------------------------------------------
# Standalone test mode: run "python matching.py" to test directly
# ------------------------------------------------------------------
if __name__ == "__main__":
    import pandas as pd

    df = pd.read_csv("sample_data.csv")

    lost_items = df[df['type'] == 'lost'].to_dict('records')
    found_items = df[df['type'] == 'found'].to_dict('records')

    print("\n--- MATCH SCORES ---\n")
    for lost in lost_items:
        best_match = None
        best_score = -1
        for found in found_items:
            score = calculate_match_score(lost, found)
            if score > best_score:
                best_score = score
                best_match = found
        print(f"Lost: {lost['category']:12s} -> Best match: {best_match['category']:12s} | Score: {best_score}%")
