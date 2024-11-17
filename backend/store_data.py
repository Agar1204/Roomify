from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
import uuid
import json
import logging
import time
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],  # Add your React Native app's URL
        "methods": ["GET", "POST", "OPTIONS"]
    }
})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = app.logger

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///room_layouts.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'heic'}

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'models'), exist_ok=True)

db = SQLAlchemy(app)

class RoomLayout(db.Model):
    __tablename__ = 'room_layout'  # Explicitly set table name
    
    id = db.Column(db.Integer, primary_key=True)
    capture_slug = db.Column(db.String(100), unique=True, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='active')
    model_path = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    image_paths = db.Column(db.JSON, nullable=True)
    jltf_path = db.Column(db.String(200), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'capture_slug': self.capture_slug,
            'status': self.status,
            'model_path': self.model_path,
            'created_at': self.created_at.isoformat(),
            'image_paths': self.image_paths,
            'jltf_path': self.jltf_path
        }

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_unique_filename(filename):
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    return f"{uuid.uuid4().hex}.{ext}"

@app.route('/api/upload-room', methods=['POST'])
def upload_room():
    logger.info("Received upload room request")
    logger.info(f"Files in request: {request.files.getlist('files[]')}")
    
    if 'files[]' not in request.files:
        logger.error("No files in request")
        return jsonify({
            'status': 'error',
            'message': 'No files uploaded'
        }), 400

    files = request.files.getlist('files[]')
    logger.info(f"Number of files received: {len(files)}")
    
    if len(files) < 3:
        logger.error("Insufficient number of files")
        return jsonify({
            'status': 'error',
            'message': 'At least 3 images required'
        }), 400

    try:
        capture_slug = f"room_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}"
        capture_folder = os.path.join(app.config['UPLOAD_FOLDER'], capture_slug)
        os.makedirs(capture_folder, exist_ok=True)

        image_paths = []
        
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                unique_filename = generate_unique_filename(filename)
                filepath = os.path.join(capture_folder, unique_filename)
                logger.info(f"Saving file to: {filepath}")
                file.save(filepath)
                image_paths.append(filepath)
                logger.info(f"File saved successfully: {filepath}")
            else:
                logger.error(f"Invalid file type: {file.filename}")
                return jsonify({
                    'status': 'error',
                    'message': f'Invalid file type: {file.filename}'
                }), 400

        new_layout = RoomLayout(
            capture_slug=capture_slug,
            status='active',
            image_paths=image_paths
        )
        db.session.add(new_layout)
        db.session.commit()
        
        logger.info(f"Successfully created room layout with slug: {capture_slug}")
        
        return jsonify({
            'status': 'success',
            'message': 'Upload successful',
            'capture_slug': capture_slug
        }), 201

    except Exception as e:
        logger.error(f"Error in upload_room: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }), 500

@app.route('/api/items', methods=['GET', 'POST'])
def handle_items():
    if request.method == 'GET':
        try:
            items = RoomLayout.query.order_by(RoomLayout.created_at.desc()).all()
            return jsonify({
                'status': 'success',
                'data': [item.to_dict() for item in items]
            })
        except Exception as e:
            logger.error(f"Error in get_items: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 500
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            jltf_path = data.get('jltf_path')
            
            if not jltf_path:
                return jsonify({
                    'status': 'error',
                    'message': 'jltf_path is required'
                }), 400

            capture_slug = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}"
            
            new_layout = RoomLayout(
                capture_slug=capture_slug,
                jltf_path=jltf_path,
                status='active'
            )
            db.session.add(new_layout)
            db.session.commit()

            return jsonify({
                'status': 'success',
                'message': 'Item saved successfully',
                'data': new_layout.to_dict()
            }), 201

        except Exception as e:
            logger.error(f"Error saving item: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 500

@app.route('/api/item/<int:item_id>', methods=['GET'])
def get_item(item_id):
    try:
        item = RoomLayout.query.get_or_404(item_id)
        return jsonify({
            'status': 'success',
            'data': item.to_dict()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 404

@app.route('/api/model/<capture_slug>', methods=['GET'])
def get_model(capture_slug):
    try:
        room = RoomLayout.query.filter_by(capture_slug=capture_slug).first_or_404()
        if room.model_path:
            return send_file(room.model_path)
        else:
            return jsonify({
                'status': 'error',
                'message': 'No model available'
            }), 404
    except Exception as e:
        logger.error(f"Error serving model: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/room/<capture_slug>/status', methods=['GET'])
def get_room_status(capture_slug):
    try:
        room = RoomLayout.query.filter_by(capture_slug=capture_slug).first_or_404()
        return jsonify({
            'status': 'success',
            'data': {
                'status': room.status,
                'model_path': room.model_path,
                'jltf_path': room.jltf_path
            }
        })
    except Exception as e:
        logger.error(f"Error getting room status: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 404

if __name__ == '__main__':
    with app.app_context():
        # Drop existing tables and create new ones
        db.drop_all()
        db.create_all()
        logger.info("Database reinitialized with updated schema")
    app.run(host='0.0.0.0', port=5001, debug=True)

