from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image, ImageDraw
import torch
import sys
import os
import pathlib
import uuid  # Import for unique filenames
from tensorflow.keras.models import load_model
import shutil
from fastapi.responses import JSONResponse
import cv2
import tensorflow as tf 
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# Force pathlib to use PosixPath instead of WindowsPath
if os.name != "nt":  
    pathlib.WindowsPath = pathlib.PosixPath  

temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

# ✅ Ensure Python finds your local YOLOv5 repo
YOLO_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../yolov5"))
sys.path.append(YOLO_PATH)

# IMAGE_SIZE = 320
# ✅ Load UNet model
# UNET_MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../model/gray_segmentation_mask_resaved.keras"))
# unet_model = load_model(UNET_MODEL_PATH)

# 🔹 Import YOLOv5 modules AFTER adding to sys.path
from models.experimental import attempt_load  # Import YOLOv5 model loader
from utils.general import non_max_suppression, xywh2xyxy
from utils.augmentations import letterbox  # ✅ Import from utils.augmentations

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory to serve images
app.mount("/static", StaticFiles(directory="static"), name="static")

# ✅ Load YOLOv5 Model from Local Repository
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../model/best.pt"))  # ✅ Fixed model path
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")  # Use GPU if available

RESNET_MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../model/skinDisease.h5"))
resnet_model = load_model(RESNET_MODEL_PATH)

# 🔹 Load model with correct map location
model = attempt_load(MODEL_PATH).to(device)
model.eval()

# Define class labels for skin disease
class_labels = [
    "Dermatitis",
    "Ear Mites",
    "Fungal Infections",
    "Healthy", 
    "Hypersensitivity",
    "Ringworm",    
    "Demodicosis",
]

# def clean_mask(mask):
#     kernel = np.ones((3, 3), np.uint8)
#     return cv2.morphologyEx(mask.astype(np.uint8), cv2.MORPH_CLOSE, kernel)

# def apply_clahe(image):
#     lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
#     lab_planes = list(cv2.split(lab))
#     clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
#     lab_planes[0] = clahe.apply(lab_planes[0])
#     lab = cv2.merge(lab_planes)
#     return cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)

# def predict_with_model(image_path, unet_model):
#     img = cv2.imread(image_path)
#     img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#     img = cv2.resize(img, (IMAGE_SIZE, IMAGE_SIZE))
#     img_clahe = apply_clahe(img)
#     img_clahe = img_clahe / 255.0
#     pred = unet_model.predict(np.expand_dims(img_clahe, axis=0))[0]
#     pred = tf.nn.softmax(pred, axis=-1).numpy()
#     return pred

# def predict_symptoms_from_image(image_path, unet_model, threshold=0.05):
#     symptoms = ["background", "corneal edema", "episcleral congestion", "epiphora", "Cherry Eye disease"]
#     pred = predict_with_model(image_path, unet_model)
#     mask = np.argmax(pred, axis=-1)
#     mask = clean_mask(mask)
#     non_background_pixels = np.sum(mask != 0)
#     detected_symptoms = {}
#     for class_idx in range(1, len(symptoms)):
#         pixel_count = np.sum(mask == class_idx)
#         percentage = pixel_count / non_background_pixels
#         if percentage > threshold:
#             detected_symptoms[symptoms[class_idx]] = float(percentage)
            
#     if detected_symptoms:
#         predicted_disease = max(detected_symptoms, key=detected_symptoms.get)
#     else:
#         predicted_disease = None  # If no symptoms are detected

#     return {
#         # "detected_symptoms": detected_symptoms,
#         "predicted_disease": predicted_disease,
#         "mask": mask.tolist(),
#     }

# def preprocess_image(img):
#     """Preprocess the image for ResNet50 model."""
#     img = img.resize((224, 224))  # ResNet50 input size
#     img_array = image.img_to_array(img)
#     img_array = np.expand_dims(img_array, axis=0)
#     img_array /= 255.0  # Normalize to [0,1]
#     return img_array

IMG_SIZE = (224, 224)  # Ensure this matches your training image size

def preprocess_image(contents):
    """Preprocess the image for ResNet50 model using OpenCV, ensuring consistency with Colab"""
    np_arr = np.frombuffer(contents, np.uint8)  
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)  
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  
    img = cv2.resize(img, (224, 224))  

    # ✅ Use the same preprocessing as in Colab
    img = tf.keras.preprocessing.image.img_to_array(img)  
    img = np.expand_dims(img, axis=0)  
    img = tf.keras.applications.mobilenet_v2.preprocess_input(img)  

    return img


@app.get("/ping")
async def ping():
    return {"message": "Hello, I am alive"}

def read_file_as_image(data) -> Image.Image:
    """Convert uploaded file to a PIL Image"""
    return Image.open(BytesIO(data)).convert("RGB")

@app.post("/detect")
async def detect_dog(file: UploadFile = File(...)):
    """Process the uploaded image, detect dogs, and return the annotated image"""
    image = read_file_as_image(await file.read())

    # Convert PIL image to numpy array
    img = np.array(image)
    img_resized, ratio, (dw, dh) = letterbox(img, 640, stride=32, auto=True)

    img_resized = np.transpose(img_resized, (2, 0, 1))  # HWC to CHW format
    img_resized = np.ascontiguousarray(img_resized)

    # Convert to Tensor
    img_tensor = torch.from_numpy(img_resized).float().to(device) / 255.0  # Normalize to [0,1]
    img_tensor = img_tensor.unsqueeze(0)  # Add batch dimension

    # Run YOLOv5 Inference
    with torch.no_grad():
        results = model(img_tensor)[0]

    # Post-process results
    detections = []
    results = non_max_suppression(results, 0.4, 0.5)[0]  # Confidence threshold = 0.4, NMS = 0.5

    if results is not None and len(results) > 0:
        draw = ImageDraw.Draw(image)  # Initialize drawer for PIL image

        for det in results:
            x1, y1, x2, y2, conf, cls = det.cpu().numpy()
            x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])
            detections.append({
                "bounding_box": [x1, y1, x2, y2],
                "confidence": round(float(conf), 2),
                "label": "dog"
            })

            # ✅ Draw bounding box
            draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
            draw.text((x1, y1 - 10), f"Dog {conf:.2f}", fill="red")

    # ✅ Save the annotated image
    os.makedirs("static", exist_ok=True)  # Ensure 'static' directory exists
    unique_filename = f"annotated_{uuid.uuid4().hex}.jpg"
    output_path = f"static/{unique_filename}"
    image.save(output_path)

    return {
        "detections": detections,
        "image_url": f"http://172.20.7.169:8000/static/{unique_filename}"
    }
    
# @app.post("/predict_skin_disease")
# async def predict_skin_disease(file: UploadFile = File(...)):
#     """Predict skin disease from uploaded image."""
#     try:
#         contents = await file.read()
#         img = Image.open(BytesIO(contents)).convert("RGB")
#         img_array = preprocess_image(img)

#         # Predict using ResNet50 model
#         prediction = resnet_model.predict(img_array)
#         predicted_class = class_labels[np.argmax(prediction)]

#         return JSONResponse(content={"prediction": predicted_class})

#     except Exception as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/predict_skin_disease")
async def predict_skin_disease(file: UploadFile = File(...)):
    """Predict skin disease from uploaded image."""
    try:
        contents = await file.read()
        img_array = preprocess_image(contents)  # Use OpenCV-based preprocessing

        # Predict using ResNet50 model
        prediction = resnet_model.predict(img_array)
        predicted_class_idx = np.argmax(prediction)
        predicted_class = class_labels[predicted_class_idx]
        confidence = float(np.max(prediction))  # Get confidence score

        return JSONResponse(content={
            "prediction": predicted_class,
            "confidence": confidence
        })

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

    
# @app.post("/segment_and_predict")
# async def segment_and_predict(file: UploadFile = File(...)):
#     """
#     Perform segmentation using the UNet model and predict the disease.
#     """
#     # Read and preprocess the image
#     image = read_file_as_image(await file.read())

#     # Preprocess the image for UNet (resize and normalize)
#     input_data = np.array(image.resize((320, 320))) / 255.0  # Example size: 256x256
#     input_data = np.expand_dims(input_data, axis=0)  # Add batch dimension

#     # Perform segmentation
#     segmentation_result = unet_model.predict(input_data)

#     # Convert segmentation output to an image-like format for visualization (optional)
#     segmentation_output = (segmentation_result[0, :, :, 0] * 255).astype(np.uint8)
#     segmentation_image = Image.fromarray(segmentation_output)

#     # Save segmentation output (optional)
#     os.makedirs("static", exist_ok=True)
#     unique_segmentation_filename = f"segmentation_{uuid.uuid4().hex}.jpg"
#     segmentation_path = f"static/{unique_segmentation_filename}"
#     segmentation_image.save(segmentation_path)

#     # Dummy disease prediction logic (replace this with your actual code)
#     disease_prediction = "Healthy" if np.mean(segmentation_result) < 0.5 else "Diseased"

#     return {
#         "segmentation_image_url": f"http://172.20.7.169:8000/static/{unique_segmentation_filename}",
#         "disease_prediction": disease_prediction
#     }
    
# @app.post("/predict_symptoms")
# async def predict_symptoms(file: UploadFile = File(...)):
#     """
#     Endpoint to predict symptoms using an uploaded eye image.
#     """
#     # Save the uploaded file locally
#     os.makedirs("uploads", exist_ok=True)
#     unique_filename = f"eye_image_{uuid.uuid4().hex}.jpg"
#     file_path = os.path.join("uploads", unique_filename)

#     with open(file_path, "wb") as f:
#         f.write(await file.read())

#     # Predict symptoms
#     result = predict_symptoms_from_image(file_path, unet_model)

#     return result

# @app.post("/predict/")
# async def predict(file: UploadFile = File(...)):
#     # Save uploaded image
#     image_path = f"temp_{file.filename}"
#     with open(image_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     # Run prediction
#     try:
#         result = predict_symptoms_from_image(image_path, unet_model)
#         os.remove(image_path)  # Clean up temp file
#         return JSONResponse(content={"status": "success", "data": result})
#     except Exception as e:
#         os.remove(image_path)
#         return JSONResponse(content={"status": "error", "message": str(e)})


    


# Run FastAPI
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)