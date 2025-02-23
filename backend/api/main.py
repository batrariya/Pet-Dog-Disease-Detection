from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import torch
import sys
import os
import pathlib

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
# origins = ["http://localhost", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    """Process the uploaded image and detect dogs"""
    image = read_file_as_image(await file.read())

    # Preprocess image for YOLOv5
    img = np.array(image)
    img_resized, ratio, (dw, dh) = letterbox(img, 640, stride=32, auto=True)  # ✅ Updated

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
        for det in results:
            x1, y1, x2, y2, conf, cls = det.cpu().numpy()
            detections.append({
                "bounding_box": [int(x1), int(y1), int(x2), int(y2)],  
                "confidence": round(float(conf), 2),
                "label": "dog"
            })

    return {"detections": detections}


# if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8000, reload = True)
