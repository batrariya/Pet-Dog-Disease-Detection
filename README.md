# Pet Dog Disease Detection

This project provides an AI-powered system for detecting and classifying various diseases in pet dogs through image-based diagnosis using Deep Learning models. It includes object detection, disease classification, and segmentation modules integrated into a mobile application.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Results](#results)

## Overview

The Pet Dog Disease Detection system uses:

- **YOLOv5** for dog detection in uploaded images.
- **ResNet50** for skin disease classification (9 diseases + healthy class).
- **U-Net** for eye disease segmentation and classification.

The system is designed for integration with a **React Native mobile app** (using Expo Router) and a **FastAPI** backend. This tool aims to assist pet owners and veterinary professionals in early disease diagnosis for timely care.

## Features

- Upload an image of your dog.
- YOLO-based bounding box detection of the dog in the image.
- Skin disease prediction using ResNet50 (high accuracy).
- Eye disease segmentation and classification using U-Net.
- FastAPI backend with image handling and prediction endpoints.
- Mobile app interface built using React Native.

## Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: FastAPI
- **Models**: 
  - YOLOv5 (PyTorch)
  - ResNet50 (TensorFlow/Keras)
  - U-Net (TensorFlow/Keras)
- **Deployment**: Docker, AWS (future scope)

## Installation

### Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/batrariya/Pet-Dog-Disease-Detection.git
   cd Pet-Dog-Disease-Detection
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: .\venv\Scripts\activate
3. Install dependencies:
   ```bash
   cd backend/api
   pip install -r requirements.txt
4. Run the FastAPI server:
   ```bash
   cd ..
   uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
3. Install dependencies:
   ```bash
   npm install
5. Start the Expo server:
   ```bash
   npx expo start
   
## Usage

1. Open the mobile app on your device.
2. Upload a dog image from the gallery or camera.
3. Wait for detection, prediction, and results.
4. View bounding boxes, disease name, and suggested remedies.

## API Endpoints

| Endpoint         | Method | Description                           |
|------------------|--------|---------------------------------------|
| `/ping`          | GET    | Health check of backend server        |
| `/detect`        | POST   | Detects dogs in the uploaded image using the YOLOv5 model. Returns bounding box coordinates and confidence scores. The output image is annotated with bounding boxes and saved to the                               static/ folder with a UUID-based filename.     |
| `/predict_skin_disease`   | POST   | Predicts skin disease from an uploaded image using a ResNet50 model. The image is preprocessed (resized and normalized), and the endpoint returns the predicted disease class along with the confidence score.     |
| `/segment_and_predict`        | POST   | Segments and predicts eye disease using a UNet model. The uploaded eye image is processed to generate a segmentation mask, which is analyzed to identify symptoms. Returns the predicted disease and the segmentation mask image.      |
   
## Results

- **Skin Disease Prediction Accuracy**: 96%
- **Eye Disease Segmentation Dice Score**: 94%
- **YOLOv5 Dog Detection mAP**: 97.8%

