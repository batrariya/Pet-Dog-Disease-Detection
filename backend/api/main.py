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

# Force pathlib to use PosixPath instead of WindowsPath
if os.name != "nt":  
    pathlib.WindowsPath = pathlib.PosixPath  

temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

# ✅ Ensure Python finds your local YOLOv5 repo
YOLO_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../yolov5"))
sys.path.append(YOLO_PATH)

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

# 🔹 Load model with correct map location
model = attempt_load(MODEL_PATH).to(device)
model.eval()

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
        "image_url": f"http://172.20.72.174:8000/static/{unique_filename}"
    }

# Run FastAPI
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
