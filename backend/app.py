from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

from matching import calculate_match_score


# ==========================================
# Flask Configuration
# ==========================================

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
DATABASE = "lost_found.db"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ==========================================
# Database
# ==========================================

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            category TEXT NOT NULL,
            location TEXT NOT NULL,
            date_time TEXT NOT NULL,
            description TEXT,
            name TEXT,
            phone TEXT,
            image_path TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # --------------------------------------
    # Add new columns to an old database
    # --------------------------------------

    columns = [
        row["name"]
        for row in conn.execute("PRAGMA table_info(items)").fetchall()
    ]

    if "name" not in columns:
        conn.execute("ALTER TABLE items ADD COLUMN name TEXT")

    if "phone" not in columns:
        conn.execute("ALTER TABLE items ADD COLUMN phone TEXT")

    conn.commit()
    conn.close()


# ==========================================
# Health Check
# ==========================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "success": True,
        "message": "Backend is running!"
    })


# ==========================================
# Serve Uploaded Images
# ==========================================

@app.route("/uploads/<filename>", methods=["GET"])
def uploaded_file(filename):

    return send_from_directory(
        UPLOAD_FOLDER,
        filename
    )


# ==========================================
# Helper: Convert DB row to dictionary
# ==========================================

def item_to_dict(row):

    image_url = None

    if row["image_path"]:

        filename = os.path.basename(row["image_path"])

        image_url = (
            f"http://localhost:5000/uploads/{filename}"
        )

    return {
        "id": row["id"],
        "type": row["type"],
        "category": row["category"],
        "location": row["location"],
        "date_time": row["date_time"],
        "description": row["description"] or "",
        "name": row["name"] or "",
        "phone": row["phone"] or "",
        "image_path": row["image_path"],
        "image_url": image_url,
        "created_at": row["created_at"]
    }


# ==========================================
# Calculate Matches
# ==========================================

def find_matches(item_id):

    conn = get_db_connection()

    current_row = conn.execute("""
        SELECT *
        FROM items
        WHERE id = ?
    """, (item_id,)).fetchone()

    if not current_row:
        conn.close()
        return []

    opposite_type = (
        "found"
        if current_row["type"] == "lost"
        else "lost"
    )

    rows = conn.execute("""
        SELECT *
        FROM items
        WHERE type = ?
        AND id != ?
        AND image_path IS NOT NULL
    """, ( 
        opposite_type,
        item_id
    )).fetchall()

    conn.close()

    # --------------------------------------
    # Current item
    # --------------------------------------

    if not current_row["image_path"]:
        return []

    current_item = {
        "image_path": current_row["image_path"],
        "category": current_row["category"],
        "location": current_row["location"],
        "date_time": current_row["date_time"],
        "description": current_row["description"] or ""
    }

    matches = []

    # --------------------------------------
    # Compare with opposite reports
    # --------------------------------------

    for row in rows:

        other_item = {
            "image_path": row["image_path"],
            "category": row["category"],
            "location": row["location"],
            "date_time": row["date_time"],
            "description": row["description"] or ""
        }

        try:

            score = calculate_match_score(
                current_item,
                other_item
            )

            match = item_to_dict(row)

            match["score"] = float(score)

            matches.append(match)

        except Exception as e:

            print(
                f"Matching error for item {row['id']}: {e}"
            )

    matches.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return matches[:10]


# ==========================================
# Report Lost / Found
# ==========================================

@app.route("/api/report", methods=["POST"])
def report_item():

    try:

        # --------------------------------------
        # Get form data
        # --------------------------------------

        item_type = request.form.get("type")
        category = request.form.get("category")
        location = request.form.get("location")
        date = request.form.get("date")
        time = request.form.get("time")

        # Also support old frontend field
        date_time = request.form.get("date_time")

        description = request.form.get(
            "description",
            ""
        )

        additional_details = request.form.get(
            "additional_details",
            ""
        )

        name = request.form.get(
            "name",
            ""
        )

        phone = request.form.get(
            "phone",
            ""
        )

        # --------------------------------------
        # Validation
        # --------------------------------------

        if not item_type:

            return jsonify({
                "success": False,
                "message": "Item type is required"
            }), 400

        if item_type not in ["lost", "found"]:

            return jsonify({
                "success": False,
                "message": "Type must be 'lost' or 'found'"
            }), 400

        if not category:

            return jsonify({
                "success": False,
                "message": "Category is required"
            }), 400

        if not location:

            return jsonify({
                "success": False,
                "message": "Location is required"
            }), 400

        # --------------------------------------
        # Create date_time
        # --------------------------------------

        if not date_time:

            if not date:

                return jsonify({
                    "success": False,
                    "message": "Date is required"
                }), 400

            if time:

                date_time = f"{date} {time}"

            else:

                date_time = date

        # --------------------------------------
        # Combine description
        # --------------------------------------

        if additional_details:

            if description:

                description = (
                    f"{description}\n"
                    f"Additional Details: "
                    f"{additional_details}"
                )

            else:

                description = (
                    f"Additional Details: "
                    f"{additional_details}"
                )

        # --------------------------------------
        # Image
        #
        # Frontend allows up to 5 photos.
        #
        # The current matching.py expects
        # one image, so we use the FIRST image
        # for AI matching.
        # --------------------------------------

        images = request.files.getlist("image")

        image_path = None

        if images:

            image = images[0]

            if image and image.filename:

                timestamp = datetime.now().strftime(
                    "%Y%m%d_%H%M%S_%f"
                )

                original_name = image.filename

                extension = os.path.splitext(
                    original_name
                )[1]

                filename = (
                    f"{item_type}_"
                    f"{timestamp}"
                    f"{extension}"
                )

                image_path = os.path.join(
                    UPLOAD_FOLDER,
                    filename
                )

                image.save(image_path)

        # --------------------------------------
        # Save to SQLite
        # --------------------------------------

        conn = get_db_connection()

        cursor = conn.execute("""
            INSERT INTO items
            (
                type,
                category,
                location,
                date_time,
                description,
                name,
                phone,
                image_path
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            item_type,
            category,
            location,
            date_time,
            description,
            name,
            phone,
            image_path
        ))

        item_id = cursor.lastrowid

        conn.commit()
        conn.close()

        # --------------------------------------
        # Find matches
        # --------------------------------------

        matches = find_matches(item_id)

        # --------------------------------------
        # Response
        # --------------------------------------

        return jsonify({

            "success": True,

            "message":
                f"{item_type.capitalize()} "
                f"item reported successfully!",

            "item_id": item_id,

            "matches": matches

        }), 201

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ==========================================
# Get All Reports
# ==========================================

@app.route("/api/items", methods=["GET"])
def get_items():

    try:

        conn = get_db_connection()

        rows = conn.execute("""
            SELECT *
            FROM items
            ORDER BY id DESC
        """).fetchall()

        conn.close()

        items = [
            item_to_dict(row)
            for row in rows
        ]

        return jsonify({
            "success": True,
            "items": items
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ==========================================
# Get Single Item
# ==========================================

@app.route("/api/items/<int:item_id>", methods=["GET"])
def get_item(item_id):

    conn = get_db_connection()

    row = conn.execute("""
        SELECT *
        FROM items
        WHERE id = ?
    """, (item_id,)).fetchone()

    conn.close()

    if not row:

        return jsonify({
            "success": False,
            "message": "Item not found"
        }), 404

    return jsonify({
        "success": True,
        "item": item_to_dict(row)
    })


# ==========================================
# Get Matches for an Item
# ==========================================

@app.route("/api/items/<int:item_id>/matches", methods=["GET"])
def get_matches(item_id):

    conn = get_db_connection()

    row = conn.execute("""
        SELECT *
        FROM items
        WHERE id = ?
    """, (item_id,)).fetchone()

    conn.close()

    if not row:

        return jsonify({
            "success": False,
            "message": "Item not found"
        }), 404

    matches = find_matches(item_id)

    return jsonify({
        "success": True,
        "item": item_to_dict(row),
        "matches": matches
    })


# ==========================================
# Start Server
# ==========================================

if __name__ == "__main__":

    init_db()

    print("===================================")
    print("       Lost & Found Backend")
    print("===================================")
    print("Database: SQLite")
    print("Server: http://localhost:5000")
    print("===================================")

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )