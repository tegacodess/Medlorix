from flask import Flask, render_template, request, jsonify
import requests
from dotenv import load_dotenv
import os

load_dotenv()


app = Flask(__name__, static_folder='static')


GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
OPENCAGE_API_KEY = os.getenv('OPENCAGE_API_KEY')


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/clinicSearch')
def clinicSearch():
    return render_template('clinicSearch.html', google_maps_api_key=GOOGLE_API_KEY)

@app.route('/geocode', methods=['POST'])
def geocode():
    data = request.json
    city = data.get('city')
    landmark = data.get('landmark')
    query = f"{city} {landmark}"
    
    url = f"https://api.opencagedata.com/geocode/v1/json?q={query}&key={OPENCAGE_API_KEY}"
    
    response = requests.get(url)
    if response.status_code == 200:
        results = response.json().get('results', [])
        if results:
            location = results[0]['geometry']
            return jsonify(location)
    
    return jsonify({'error': 'Geocoding failed'}), 400

@app.route('/nearby-search', methods=['POST'])
def nearby_search():
    data = request.json
    location = data.get('location')
    radius = data.get('radius', 1500)
    type = data.get('type')

    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&radius={radius}&type={type}&key={GOOGLE_API_KEY}"

    response = requests.get(url)
    if response.status_code == 200:
        results = response.json().get('results', [])
        for result in results:
            result['geometry']['location'] = {
                'lat': result['geometry']['location']['lat'],
                'lng': result['geometry']['location']['lng']
            }
        return jsonify({'results': results})

    return jsonify({'error': 'Nearby search failed'}), 400

@app.route('/place-details', methods=['POST'])
def place_details():
    data = request.json
    place_id = data.get('place_id')
    
    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=name,formatted_phone_number,formatted_address,opening_hours,geometry&key={GOOGLE_API_KEY}"
    
    response = requests.get(url)
    if response.status_code == 200:
        return jsonify(response.json())
    
    return jsonify({'error': 'Place details fetch failed'}), 400

@app.route('/book-appointment', methods=['GET', 'POST'])
def book_appointment():
    pass

@app.route('/appointment-confirmation')
def appointment_confirmation():
    return render_template('appointment_confirmation.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/login')
def login():
    return render_template('login.html')
@app.route('/sign-up')
def sign_up():
    return render_template('sign-up.html')

@app.route('/sign-up2')
def sign_up2():
    return render_template('sign-up2.html')

@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')

@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True)