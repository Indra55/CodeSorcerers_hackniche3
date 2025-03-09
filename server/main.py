from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from scipy.sparse import hstack
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app, resources={r"/recommend": {"origins": ["http://localhost:5173", "http://localhost:5174"]}})
 # Enable CORS for all routes

# Load the dataset
df = pd.read_csv('productdata.csv')

# Extract base model name
df['base_model'] = df['name'].apply(lambda x: x.split('(')[0].strip())

# Combine text features into a single column
df['combined_text'] = df['name'] + ' ' + df['brand'] + ' ' + df['description'] + ' ' + df['category']

# Normalize numerical features
scaler = MinMaxScaler()
df[['price_normalized', 'rating_normalized']] = scaler.fit_transform(df[['price', 'rating']])

# TF-IDF for text features
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['combined_text'])

# Combine TF-IDF and numerical features
numerical_features = df[['price_normalized', 'rating_normalized']].values
feature_matrix = hstack([tfidf_matrix, numerical_features])

# Compute cosine similarity matrix
cosine_sim = cosine_similarity(feature_matrix, feature_matrix)

def get_recommendations(product_name, top_n=5):
    """
    Get top N recommendations for a product, ensuring recommendations are for different products.
    """
    if product_name not in df['name'].values:
        return []
    
    product_index = df[df['name'] == product_name].index[0]
    base_model = df.loc[product_index, 'base_model']
    sim_scores = list(enumerate(cosine_sim[product_index]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    unique_recommendations = []
    seen_models = {base_model}
    
    for i, score in sim_scores:
        current_base_model = df.loc[i, 'base_model']
        if current_base_model not in seen_models:
            unique_recommendations.append(i)
            seen_models.add(current_base_model)
            if len(unique_recommendations) >= top_n:
                break
    
    return df.iloc[unique_recommendations][['name', 'price', 'image_url']].to_dict('records')

@app.route('/recommend', methods=['GET'])
def recommend():
    product_name = request.args.get('product_name')
    if not product_name:
        return jsonify({"error": "Product name is required"}), 400
    
    recommendations = get_recommendations(product_name)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)