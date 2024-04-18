# Use an official Python runtime as a parent image
FROM python:3.12.2-slim

# Set the working directory to /code
WORKDIR /code

# Install OpenGL libraries needed by OpenCV (cv2)
# Install necessary system dependencies
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1-mesa-glx && \
    rm -rf /var/lib/apt/lists/*

# Copy the current directory contents into the container at /code
COPY ./docker-requirements.txt /code/requirements.txt
COPY ./ground-traffic-model.onnx /code/ground-traffic-model.onnx
COPY ./ground-traffic-model.pt /code/ground-traffic-model.pt

# Install PyTorch separately with the required extra index URL
RUN pip install --no-cache-dir --upgrade --extra-index-url https://download.pytorch.org/whl/cpu torch torchvision

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the rest of your application
COPY ./app.py /code/

# Make port 80 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV NAME World

# Run uvicorn when the container launches
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
