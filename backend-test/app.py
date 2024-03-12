from flask import Flask, request, jsonify
from PIL import Image
import io

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process_frame():
    file = request.files['frame'].read()  # Read the file sent by the front-end
    image = Image.open(io.BytesIO(file))  # Open the image
    width, height = image.size
    
    # Calculate the center of the image
    center = (width // 2, height // 2)
    print(center)
    
    return jsonify({'center': center})

if __name__ == '__main__':
    app.run(debug=True)
