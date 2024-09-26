from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class Appointment(db.Model):  
    id = db.Column(db.Integer, primary_key=True)
    doctor = db.Column(db.String(100), nullable=False)
    specialty = db.Column(db.String(100), nullable=False)  
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)  
    address = db.Column(db.String(100), nullable=False)  
    country = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)  
    lg = db.Column(db.String(100), nullable=False)  
    phone_number = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    existing_patient = db.Column(db.Boolean, nullable=False) 
    appointment_date = db.Column(db.Date, nullable=False)  
    reason = db.Column(db.Text, nullable=False)
    
    def __repr__(self):
        return f'<Appointment {self.id}: {self.first_name} {self.last_name}>'
