from flask import Flask, render_template, request, jsonify
import requests
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
from datetime import datetime
from models import Appointment
import os

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Appointments.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
db.init_app(app)


from models import Appointment


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
    radius = data.get('radius', 3000)
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

@app.route('/bookAppointment', methods=['GET', 'POST'])
def book_appointment():
    return render_template('bookAppointment.html')

@app.route('/book-appointment', methods=['GET', 'POST'])
def booking_api():
    if request.method == 'POST':
        new_booking = Appointment(
            doctor=request.form['doctor'],
            specialty=request.form['specialty'],
            first_name=request.form['firstName'],
            last_name=request.form['lastName'],
            address=request.form['address'],
            country=request.form['country'],
            state=request.form['state'],
            lg=request.form['local-government'],
            phone_number=request.form['phone-number'],
            email=request.form['email'],
            existing_patient=request.form['existing_patient'] == 'yes',
            appointment_date=datetime.strptime(request.form['appointment_date'], '%Y-%m-%d').date(),
            reason=request.form['reason']
        )
        try:
            db.session.add(new_booking)
            db.session.commit()
            return jsonify({"message": "Appointment booked successfully!"}), 200
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Error booking appointment: {e}")
            return jsonify({"error": "An error occurred while booking the appointment."}), 500
    
    return render_template('booking.html')

@app.route('/appointment-confirmation')
def appointment_confirmation():
    return render_template('appointment_confirmation.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/careers')
def careers():
    return render_template('careers.html')

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

@app.route('/terms')
def terms():
    return render_template('terms.html')


@app.route('/api/countries')
def get_countries():
    url = "https://api.countrystatecity.in/v1/countries"
    headers = {"X-CSCAPI-KEY": os.getenv('CSCAPI_KEY')}
    response = requests.get(url, headers=headers)
    return jsonify(response.json())

@app.route('/api/states/<country_code>')
def get_states(country_code):
    url = f"https://api.countrystatecity.in/v1/countries/{country_code}/states"
    headers = {"X-CSCAPI-KEY": os.getenv('CSCAPI_KEY')}
    response = requests.get(url, headers=headers)
    return jsonify(response.json())

@app.route('/api/cities/<country_code>/<state_code>')
def get_cities(country_code, state_code):
    url = f"https://api.countrystatecity.in/v1/countries/{country_code}/states/{state_code}/cities"
    headers = {"X-CSCAPI-KEY": os.getenv('CSCAPI_KEY')}
    response = requests.get(url, headers=headers)
    return jsonify(response.json())

def init_db():
    db_path = 'appointments.db'
    if os.path.exists(db_path):
        os.remove(db_path)
    with app.app_context():
        db.create_all()
        print("Database initialized.")
        


if __name__ == '__main__':
    init_db()
    app.run(debug=True)