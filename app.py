from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

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

@app.route('/clinicSearch')
def clinicSearch():
    return render_template('clinicSearch.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True)