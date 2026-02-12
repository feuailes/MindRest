from flask import Blueprint, jsonify
import sqlite3
import os

dashboard_bp = Blueprint('dashboard', __name__)

DB_PATH = os.path.join('database', 'mindrest.db')

@dashboard_bp.route('/data', methods=['GET'])
def get_dashboard_data():
    if not os.path.exists(DB_PATH):
        # No data yet
        return jsonify({
            'weekly_trend': [],
            'message': 'No data yet'
        })

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Example: fetch mood & stress over past 7 days
    cursor.execute("SELECT date, mood, stress FROM mood_log ORDER BY date DESC LIMIT 7")
    rows = cursor.fetchall()
    conn.close()

    weekly_trend = [{'date': r[0], 'mood': r[1], 'stress': r[2]} for r in rows]
    return jsonify({'weekly_trend': weekly_trend})
