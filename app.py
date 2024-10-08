from flask import Flask, render_template, request, jsonify, redirect, url_for
import requests
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from models import db, Appointment, DoctorApplication
from dotenv import load_dotenv
from datetime import datetime
import os, random

load_dotenv()

app = Flask(__name__, static_folder='static')
# app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///Appointments.db')
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'Appointments.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)


from models import db, Appointment


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

@app.route('/bookAppointment', methods=['GET'])
def book_appointment_page():
    return render_template('bookAppointment.html')

# @app.route('/proxy', methods=['POST'])
# def proxy():
#     try:
#         response = requests.post('https://calendly.com/amablebless/becky', json=request.json)
#         return (response.content, response.status_code, dict(response.headers))
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

@app.route('/book-appointment', methods=['POST'])
def submit_appointment():
    if request.is_json:
        # Handle JSON data from Step 2
        data = request.json
        try:
            new_booking = Appointment(
                doctor=data.get('doctor'),
                specialty=data.get('specialty'),
                first_name=data.get('first_name'),
                last_name=data.get('last_name'),
                address=data.get('address'),
                country=data.get('country'),
                state=data.get('state'),
                lg=data.get('local-government'),
                phone_number=data.get('phone-number'),
                email=data.get('email'),
                existing_patient=data.get('existing_patient') == 'yes',
                appointment_date=datetime.strptime(data.get('appointment_date'), '%Y-%m-%d').date(),
                reason=data.get('reason')
            )
            db.session.add(new_booking)
            db.session.commit()
            return jsonify({"success": True, "message": "Appointment booked successfully"}), 200
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Error booking appointment: {e}")
            return jsonify({"success": False, "error": str(e)}), 400
    else:
        # Handle form data submission (if needed)
        app.logger.error("Non-JSON request received")
        return jsonify({"success": False, "error": "Invalid request format"}), 400
    

@app.route('/patient_details')
def patient_details():
    # Fetch all appointments from the database
    appointments = Appointment.query.all()
    
    appointment_data = []
    
    for appointment in appointments:
        # Generate a random display ID for the appointment
        display_id = f"{random.randint(100000, 999999)}"
        
        # Construct the appointment details dictionary
        appointment_data.append({
            'id': appointment.id,
            'display_id': display_id,
            'first_name': appointment.first_name,
            'last_name': appointment.last_name,
            'email': appointment.email,
            'phone_number': appointment.phone_number,
            'doctor': appointment.doctor,
            'specialty': appointment.specialty,
            'country': appointment.country,
            'state': appointment.state,
            'lg': appointment.lg,  # Local government field
            'existing_patient': appointment.existing_patient,
            'appointment_date': appointment.appointment_date.isoformat() if appointment.appointment_date else None,
            'reason': appointment.reason,
            'created_at': appointment.created_at.isoformat() if hasattr(appointment, 'created_at') else datetime.now().isoformat()
        })
    
    # Return the appointment details as a JSON response
    return jsonify(appointment_data), 200


@app.route('/doctor-login1', methods=['POST'])
def doctor_application():
    if request.method == 'POST':
        firstname=request.form['firstname']
        lastname=request.form['lastname']
        email=request.form['email']
        phonenumber=request.form['phonenumber']
        gender=request.form['gender']
        country=request.form['country']
        cv=request.files['cv'] if 'cv' in request.files else None
        cover_letter=request.files['coverLetter'] if 'coverLetter' in request.files else None
        privacy_policy=True if 'privacyPolicy' in request.form else False

    
        cv_filename=cv.filename if cv else None
        cover_letter_filename=cover_letter.filename if cover_letter else None
        
        # Save to database
        new_application = DoctorApplication(
            firstname=firstname,
            lastname=lastname,
            email=email,
            phonenumber=phonenumber,
            gender=gender,
            country=country,
            cv=cv_filename,
            cover_letter=cover_letter_filename,
            privacy_policy=privacy_policy
        )
        
        try:
            db.session.add(new_application)
            db.session.commit()
            return jsonify({"success": True, "redirect": url_for('doctor_confirmation')})
        except Exception as e:
            db.session.rollback()
            return jsonify({"success": False, "error": str(e)}), 500

    return jsonify({"success": False, "error": "Method not allowed"}), 405


@app.route('/bookAppointment2')
def book_appointment2():
    return render_template('bookAppointment2.html')

@app.route('/appointment-confirmation')
def appointment_confirmation():
    return render_template('bookAppointmentConfirmation.html')

@app.route('/doctor-confirmation')
def doctor_confirmation():
    return render_template('DoctorConfirmation.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/doctor-login')
def doctor_login():
    return render_template('doctorApplication.html')

@app.route('/admin-sign-in')
def admin_signin():
    return render_template('adminSignIn.html')

@app.route('/admin-appointment')
def adminAppointment():
    return render_template('adminAppointment.html')

@app.route('/admin-doctors')
def adminDoctors():
    return render_template('adminDoctors.html')

@app.route('/admin-Requests')
def adminRequests():
    return render_template('adminRequests.html')

@app.route('/admin-Requests-page')
def admin_requests():
    # Fetch all doctor applications from the database
    applications = DoctorApplication.query.all()
    
    applications_data = []
    for app in applications:
        display_id = f"{random.randint(100000, 999999)}"

        cv_url = url_for('static', filename=f'uploads/{app.cv}') if app.cv else None
        applications_data.append({
            'id': app.id,
            'display_id': display_id,
            'firstname': app.firstname,
            'lastname': app.lastname,
            'email': app.email,
            'phonenumber': app.phonenumber,
            'gender': app.gender,
            'country': app.country,
            'cv': cv_url,
            'cover_letter': bool(app.cover_letter),
            'privacy_policy': app.privacy_policy,
            'created_at': app.created_at.isoformat() if hasattr(app, 'created_at') else datetime.now().isoformat()
        })
    
    return jsonify(applications_data)

@app.route('/get-approved-doctors', methods=['GET'])
def get_approved_doctors():
    approved_doctors = DoctorApplication.query.filter_by(status='approved').all()
    
    doctors_list = []
    for doctor in approved_doctors:
        doctor_data = {
            "id": doctor.id,
            "firstname": doctor.firstname,
            "lastname": doctor.lastname,
            "speciality": doctor.speciality,
        }
        doctors_list.append(doctor_data)
    
    return jsonify(doctors_list)

@app.route('/update_status', methods=['POST'])
def update_status():
    data = request.json
    doctor_id = data.get('id')
    new_status = data.get('status')
    

    doctor = DoctorApplication.query.get(doctor_id)
    if doctor:
        doctor.status = new_status 
        db.session.commit()

        if new_status == 'approved':
            print(f"Doctor {doctor.firstname} {doctor.lastname} is approved.")
    else:
        return jsonify({"success": False, "message": "Doctor not found"}), 404
    
    return jsonify({"success": True, "message": f"Status updated to {new_status}"})


# @app.route('/update_status', methods=['POST'])
# def update_status():
#     data = request.json
#     doctor_id = data.get('id')
#     new_status = data.get('status')
#     doctor = data.get('doctorName')
    
#     # Here, you would update the status in your database
#     # For example:
#     # doctor = Doctor.query.get(doctor_id)
#     # doctor.status = new_status
#     # db.session.commit()
    
#     if new_status == 'approved':
#         print(new_status)
#         print("status loaded ")
#         print(doctor_id)
#         print(doctor)
#         # Perform any necessary actions for approved doctors
#         # For example, you might want to add them to a different table
#         pass
    
#     return jsonify({"success": True, "message": f"Status updated to {new_status}"})

@app.route('/bookAppointment', methods=['GET'])
def book_appointment():
    # Fetch only approved doctors from the database
    approved_doctors = DoctorApplication.query.filter_by(status='approved').all()
    
    # Return the approved doctors' details as JSON
    doctors_data = [{"id": doctor.id, "name": doctor.name, "specialty": doctor.specialty} for doctor in approved_doctors]
    return jsonify(doctors_data), 200





@app.route('/admin-patients')
def adminPatients():
    return render_template('adminPatients.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/career')
def careers():
    return render_template('career.html')

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
    db_path = 'Appointments.db'
    if os.path.exists(db_path):
        os.remove(db_path)
    db.create_all()
    print("Database initialized.")
        


if __name__ == '__main__':
    init_db()
    try:
        with app.app_context():
            db.create_all()
    except Exception as e:
        print(f"Error initializing database: {e}")
        
    app.run(debug=True)