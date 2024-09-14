# Medlorix


Medlorix is a system that assists users book appointments with doctors, search for nearby clinics in cases of emergency, and diagnose illnesses with AI.

## Team Members
- **Team Lead & Backend Developer:** [Ope Fawaz Ademola](https://github.com/Hamfit) (same as [Physayo](https://github.com/Physayo))
- **UI/UX Designer:** [Mogaji Bolaji Abdullah](https://github.com/Mogaji-Bolaji-Abdullah)
- **Frontend Developer:** [Ukpong Zion](https://github.com/tegacodess)
- **Frontend Developer:** [Ezema Mabel](https://github.com/Maiybel)
- **Frontend Developer:** [Abioye Olajide](https://github.com/Olajcodes)
- **Backend Developer:** [Sule Abdulhakeem](https://github.com/Hakimziyech18)
- **Backend Developer:** [Ali Anuoluwapo](https://github.com/Anuoluwapo25)

# API Keys Documentation

This document provides an overview of the API keys used in the Flask application.

## API Keys

1. **GOOGLE_API_KEY**
   - Purpose: Used for Google Maps and Places API services
   - Environment Variable: `GOOGLE_API_KEY`
   - Used in:
     - `/clinicSearch` route
     - `/nearby-search` route
     - `/place-details` route

2. **OPENCAGE_API_KEY**
   - Purpose: Used for geocoding services
   - Environment Variable: `OPENCAGE_API_KEY`
   - Used in:
     - `/geocode` route

3. **CSCAPI_KEY**
   - Purpose: Used for Country State City API services
   - Environment Variable: `CSCAPI_KEY`
   - Used in:
     - `/api/countries` route
     - `/api/states/<country_code>` route
     - `/api/cities/<country_code>/<state_code>` route

## Security Considerations

1. All API keys are loaded from environment variables using `dotenv`.
2. Keys are not hardcoded in the source code, enhancing security.

## Obtaining API Keys

- Google API Key: Obtain from the [Google Cloud Console](https://console.cloud.google.com/)
- OpenCage API Key: Sign up at [OpenCage Geocoding API](https://opencagedata.com/)
- CSCAPI Key: Register at [Country State City API](https://countrystatecity.in/)

## Key Management

- Store these keys in a `.env` file in the project root.
- Format of `.env` file:
  ```
  GOOGLE_API_KEY=your_google_api_key_here
  OPENCAGE_API_KEY=your_opencage_api_key_here
  CSCAPI_KEY=your_cscapi_key_here
  ```

# Flask Environment Setup Documentation

This guide will walk you through the process of setting up the Flask environment for this project.

* Prerequisites

- Python 3.7 or higher
- pip (Python package installer)
- virtualenv (recommended for creating isolated Python environments)

* Step-by-step Setup

1. **Clone the Repository**
   ```
   git clone <https://github.com/tegacodess/Medlorix.git>
   cd Medlorix
   ```

2. **Create and Activate a Virtual Environment**
   ```
   python -m venv venv
   On mac use:  source venv/bin/activate  
   On Windows use:  `venv\Scripts\activate`
   ```

3. **Install Dependencies**
    Run the install command below
   ```
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables**
   Create a `.env` file in the project root with the following content:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   OPENCAGE_API_KEY=your_opencage_api_key_here
   CSCAPI_KEY=your_cscapi_key_here
   ```
   Replace the placeholder values with your actual API keys.

5. **Run the Flask Application**
   ```
   flask run  Or  python app.py
   ```

   The application should now be running on `http://127.0.0.1:5000/`

## Project Structure

```
.
├── app.py
├── .env
├── requirements.txt
├── static/
│   └── (static files like CSS, JS)
└── templates/
    └── (HTML templates)
```

## Troubleshooting

- If you encounter a `ModuleNotFoundError`, ensure you've activated the virtual environment and installed all dependencies.
- If the application can't find environment variables, make sure the `.env` file is in the correct location and formatted properly.

## Development Workflow

1. Activate the virtual environment before starting work.
2. Run `flask run` to start the development server. It will automatically reload when you make changes to the code.
3. Use `pip freeze > requirements.txt` to update the requirements file if you add new dependencies.

## Deployment Considerations

- Ensure `debug=True` is removed from `app.run()` in production.
- Set up proper logging for production environments.
- Consider using a production WSGI server like Gunicorn instead of the Flask development server.

Remember to never commit sensitive information like API keys to version control. Always use environment variables for such sensitive data.



