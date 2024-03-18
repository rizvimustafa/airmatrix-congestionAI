from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from PIL import Image
import io
import json  # Import json for parsing the container_size
app = Flask(__name__)
CORS(app)
@app.route('/process', methods=['POST'])
def process_frame():
    file = request.files['frame'].read()  # Read the file sent by the front-end
    image = Image.open(io.BytesIO(file))  # Open the image
    width, height = image.size
    # New: Parse the container_size from the form data
    container_size = json.loads(request.form['container_size'])
    container_width = container_size['width']
    container_height = container_size['height']
    # Assuming you want to calculate the center based on the container size
    center = (container_width // 2, container_height // 2)
    print(f"Image Center: {width // 2, height // 2}")  # Center of the actual image
    print(f"Container Center: {center}")  # Center based on the container size
    return jsonify({'image_center': (width // 2, height // 2), 'container_center': center})
if __name__ == '__main__':
    app.run(debug=True)