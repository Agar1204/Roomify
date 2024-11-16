# Roomify
Core Functionality
Room Scanning:
Use computer vision to identify objects in the room (e.g., furniture, appliances).
Estimate room dimensions using images and perspective geometry.
Space Analysis:
Analyze layout for underutilized areas, bottlenecks, and clutter.
Suggest rearrangements to improve functionality or fit new items.
Recommendation System:
Suggest optimized layouts or confirm if a new item can fit within the existing room.

Task Breakdown and Timeline
1. Object Detection (5-6 hours)
Goal: Identify key furniture and objects in the room using computer vision.
Steps:
Set up a pre-trained object detection model (e.g., YOLOv5 or YOLOv8).
Test detection on sample room images.
Filter results to focus on furniture and large objects.
Tools:
YOLOv5 (PyTorch or TensorFlow). 
https://docs.ultralytics.com/yolov5/quickstart_tutorial/ 
Pre-trained weights for generic objects (e.g., "sofa," "table," "chair").
Deliverable: A list of detected objects and their bounding boxes in room images.

2. Room Dimension Estimation (4-5 hours)
Goal: Estimate room dimensions (e.g., wall length, distance between objects) using perspective geometry.
Steps:
Use OpenCV for edge detection to identify walls or corners.
Allow the user to input a reference measurement (e.g., the width of a known object).
Scale all dimensions relative to the reference.
Tools:
OpenCV (edge detection, perspective scaling).
Deliverable: Accurate room dimensions and relative positions of objects.

3. Space Analysis (3-4 hours)
Goal: Analyze the layout for inefficiencies and potential improvements.
Steps:
Identify bottlenecks or underutilized spaces using object positions and room dimensions.
Use simple heuristics to define rules:
Example: “Clear pathways should be at least X cm wide.”
Example: “Desks should ideally be near natural light sources.”
Flag areas for improvement based on these rules.
Tools:
Custom rule-based system or clustering for space categorization.
Deliverable: Suggestions for decluttering, rearrangement, or improvement.

4. Recommendation System (3 hours)
Goal: Suggest optimized layouts or check if a new item can fit in the room.
Steps:
Allow users to input dimensions of a new item.
Simulate placement using current layout and room dimensions.
Provide a “fit check” or alternative placement suggestions.
Tools:
Simple geometric placement algorithm.
Deliverable: A functional recommendation system for new or rearranged items.

5. User Interface (3 hours)
Goal: Build a basic web or mobile interface for:
Uploading room images.
Viewing detected objects and recommendations.
Steps:
Create upload functionality for room images.
Display detected objects and suggestions in a list format or basic visualization.
Tools:
Frontend: React (web) or Flutter (mobile).
Backend: Flask or Django for processing.
Deliverable: A simple and intuitive interface.

6. Testing and Debugging (2-3 hours)
Goal: Ensure the system works end-to-end with minimal errors.
Steps:
Test object detection accuracy on various room images.
Verify dimension scaling and layout recommendations.
Debug edge cases (e.g., overlapping objects, small rooms).
Tools:
Manual testing and adjustments.
Deliverable: A polished prototype ready for presentation.

Time Allocation Summary
Task
Estimated Time
Object Detection
5-6 hours
Room Dimension Estimation
4-5 hours
Space Analysis
3-4 hours
Recommendation System
3 hours
User Interface
3 hours
Testing and Debugging
2-3 hours
Total
20 hours


Simplifications for Hackathon
Focus on Common Furniture:
Detect basic objects like “table,” “sofa,” and “chair” using pre-trained YOLO models.
Approximate Dimensions:
Rely on a single reference measurement instead of a fully automated dimensioning system.
Static Recommendations:
Hard-code a few common layout rules for demonstration.



