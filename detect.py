""" Runs detectron2 model for object detection:"""

from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
import detectron2.model_zoo
import cv2
import os
from glob import glob

# Setup model
cfg = get_cfg()
cfg.merge_from_file(detectron2.model_zoo.get_config_file("COCO-Detection/mask_rcnn_R_50_FPN_3x.yaml"))
cfg.MODEL.WEIGHTS = detectron2.model_zoo.get_checkpoint_url("COCO-Detection/mask_rcnn_R_50_FPN_3x.yaml")
cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.7
predictor = DefaultPredictor(cfg)

# Process all images in folder
image_folder = "/Roomify/Data/"  # Replace with your folder path
image_paths = glob(os.path.join(image_folder, "*.jpg"))  # For jpg images
# Add more formats if needed:
image_paths.extend(glob(os.path.join(image_folder, "*.png")))  # For png images

for image_path in image_paths:
    # Read image
    image = cv2.imread(image_path)
    # Run detection
    outputs = predictor(image)
    # Print results for each image
    print(f"Detections for {image_path}:")
    instances = outputs["instances"].to("cpu")
    for i in range(len(instances)):
        score = instances.scores[i].item()
        class_id = instances.pred_classes[i].item()
        bbox = instances.pred_boxes[i].tensor.numpy()[0]
        print(f"- Object {i}: Class {class_id}, Score: {score:.2f}, Box: {bbox}")