from flask import Flask, request, jsonify
from transformers import pipeline
import io
from PIL import Image
import os
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.corpus import wordnet
from nltk.tag import pos_tag
from collections import Counter
import string
import re
import torch

# Download all required NLTK data
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')
nltk.download('punkt_tab')
nltk.download('omw-1.4')  # Open Multilingual Wordnet
nltk.download('wordnet')

app = Flask(__name__)

# Check if GPU is available
device = 0 if torch.cuda.is_available() else -1
print(f"Using device: {'GPU' if device == 0 else 'CPU'}")

# Load the BLIP image captioning model with GPU support
pipe = pipeline("image-to-text", 
                model="Salesforce/blip-image-captioning-large",
                device=device)

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def get_synonyms(word):
    synonyms = set()
    for syn in wordnet.synsets(word):
        for lemma in syn.lemmas():
            # Add the synonym
            synonym = lemma.name().lower().replace('_', ' ')
            synonyms.add(synonym)
    return synonyms

# Initialize product patterns with synonyms
def initialize_product_patterns():
    base_product_types = {
        # Mobile and Accessories
        'phone', 'smartphone', 'mobile', 'charger', 'adapter', 'cable', 'powerbank',
        # Audio Devices
        'headphone', 'speaker', 'microphone', 'earphone',
        # Computing Devices
        'laptop', 'tablet', 'computer',
        # Computer Peripherals
        'monitor', 'keyboard', 'mouse', 'printer', 'scanner', 'webcam', 'camera',
        # Storage Devices
        'harddisk', 'pendrive',
        # Wearables
        'watch', 'smartwatch',
        # Home Appliances
        'refrigerator', 'fridge', 'washing machine', 'television', 'microwave', 'oven',
        # Gaming
        'console', 'controller',
        # Components
        'processor', 'motherboard', 'graphics card', 'memory'
    }
    
    # Get all synonyms for base product types
    expanded_product_types = set()
    for product in base_product_types:
        expanded_product_types.add(product)
        synonyms = get_synonyms(product)
        expanded_product_types.update(synonyms)
    
    return {
        'brands': {
            'apple', 'samsung', 'sony', 'nike', 'adidas', 'dell', 'hp', 'lenovo', 'asus', 'lg', 
            'xiaomi', 'oneplus', 'oppo', 'vivo', 'realme', 'poco', 'motorola', 'google', 'microsoft', 
            'amazon', 'huawei', 'honor', 'nokia', 'jbl', 'boat', 'skullcandy', 'corsair', 'razer', 
            'logitech', 'philips', 'whirlpool', 'haier', 'voltas', 'godrej', 'croma', 'boat', 
            'fireboltt', 'noise', 'fastrack', 'titan', 'casio', 'fossil', 'garmin', 'fitbit', 'mi'
        },
        'product_types': expanded_product_types,
        'specifications': {
            'iphone','ipad','macbook','mac','gb', 'tb', 'mb', 'ram', 'rom', 'ssd', 'hdd', 
            'processor', 'cpu', 'gpu', 'graphics', 'card', 'motherboard', 'cooler', 'fan', 
            'ups', 'inverter', 'washing', 'machine', 'game', 'console', 'projector', 'speaker', 
            'soundbar', 'microphone', 'webcam', 'scanner', 'pen', 'drive', 'memory', 'card', 'adapter'
        }
    }

# Initialize product patterns with synonyms
PRODUCT_PATTERNS = initialize_product_patterns()
print("Initialized product patterns with synonyms")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_product_keywords(text):
    try:
        # Convert to lowercase
        text = text.lower()
        
        # Split into words and remove empty strings
        words = [word.strip() for word in text.split() if word.strip()]
        
        # Remove common words and short words
        stop_words = set(stopwords.words('english'))
        filtered_words = [word for word in words if word not in stop_words]
        
        product_keywords = []
        
        # Check for product types in individual words
        for word in filtered_words:
            if word in PRODUCT_PATTERNS['product_types']:
                product_keywords.append(word)
            if word in PRODUCT_PATTERNS['brands']:
                product_keywords.append(word)
            if word in PRODUCT_PATTERNS['specifications']:
                product_keywords.append(word)
        
        # Common transliteration mappings
        transliteration_map = {
            'chahiye': 'need',
            'chahiya': 'need',
            'fone': 'phone',
            'phon': 'phone',
            'fon': 'phone',
            'leptop': 'laptop',
            'fridz': 'fridge',
            'frij': 'fridge',
            'tv': 'tv',
            'tivi': 'tv',
            'mobail': 'mobile',
            'mobile': 'phone'
        }
        
        # Check for transliterated words
        for word in filtered_words:
            if word in transliteration_map:
                translated_word = transliteration_map[word]
                if translated_word in PRODUCT_PATTERNS['product_types']:
                    product_keywords.append(translated_word)

        # Check for numbers followed by specifications
        for i, word in enumerate(filtered_words):
            # Check if current word is a specification
            if word in PRODUCT_PATTERNS['specifications']:
                # Check if previous word is a number
                if i > 0 and re.match(r'^\d+$', filtered_words[i-1]):
                    # Combine number and specification
                    spec = f"{filtered_words[i-1]}{word}"
                    product_keywords.append(spec)

        # Look for specifications with numbers in the original text
        numbers = re.findall(r'\d+', text)
        for num in numbers:
            for spec in PRODUCT_PATTERNS['specifications']:
                if f"{num}{spec}" in text.lower():
                    product_keywords.append(f"{num}{spec}")
                    break
        
        # If no keywords found, try looking for partial matches
        if not product_keywords:
            for product_type in PRODUCT_PATTERNS['product_types']:
                if product_type in text:
                    product_keywords.append(product_type)
            for brand in PRODUCT_PATTERNS['brands']:
                if brand in text:
                    product_keywords.append(brand)
        
        # Remove duplicates while preserving order
        product_keywords = list(dict.fromkeys(product_keywords))
        
        return product_keywords[:5]  # Return at most 5 keywords
        
    except Exception as e:
        print(f"Error in keyword extraction: {str(e)}")
        return []

@app.route('/', methods=['POST'])
def generate_caption():
    try:
        # Check if image file is present in the request
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Check if file extension is allowed
        if not allowed_file(file.filename):
            return jsonify({
                'error': f'File type not allowed. Allowed types are: {", ".join(ALLOWED_EXTENSIONS)}'
            }), 400

        # Read and validate image
        try:
            image = Image.open(file)
            # Convert image to RGB if it's not
            if image.mode != 'RGB':
                image = image.convert('RGB')
        except Exception as e:
            return jsonify({'error': 'Invalid image file'}), 400

        # Generate caption using BLIP
        result = pipe(image)
        
        # Extract the generated caption
        caption = result[0]['generated_text']
        
        # Extract product keywords from the caption
        keywords = extract_product_keywords(caption)

        return jsonify({
            'description': caption,
            'keywords': keywords
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/text', methods=['POST'])
def process_text():
    try:
        # Try to get text from JSON data
        if request.is_json:
            text = request.json.get('text')
        # Try to get text from form data
        else:
            text = request.form.get('text')
        
        # Check if text was provided
        if not text:
            return jsonify({'error': 'No text provided. Send either JSON with "text" field or form data with "text" field'}), 400
        
        # Extract product keywords from the text
        keywords = extract_product_keywords(text)

        return jsonify({
            'description': text,
            'keywords': keywords
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
