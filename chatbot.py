import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import matplotlib.pyplot as plt
import random
import google.generativeai as genai
from flask_cors import CORS

# Load environment variables
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")


genai.configure(api_key=api_key)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Function to get the response from the generative AI model
def get_gemini_response(input_symptoms, input_prompt):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content([input_symptoms, input_prompt])
    return response.text

# Function to plot and save the confidence score
# def plot_confidence_score(confidence_score):
#     fig, ax = plt.subplots()
#     ax.barh(['Confidence'], [confidence_score], color='blue')
#     ax.set_xlim(0, 100)
#     ax.set_xlabel('Confidence Score (%)')
#     plt.title('Diagnosis Confidence Score')
#     image_path = 'static/confidence_score.png'
#     plt.savefig(image_path)
#     plt.close()
#     return image_path

@app.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.json
    input_symptoms = data.get("symptoms")
    input_prompt = "You are an expert doctor. Diagnose the illness based on the described symptoms."

    if input_symptoms:
        # Get the response from the generative model
        diagnosis = get_gemini_response(input_symptoms, input_prompt)
        # Generate a random confidence score for demonstration purposes
        # confidence_score = random.uniform(70, 100)
        # Plot and save the confidence score image
        # confidence_score_image = plot_confidence_score(confidence_score)
        # Return the diagnosis and the confidence score image path
        formatted_diagnosis = diagnosis.replace("\n\n", "<br><br>").replace("\n", "<br>").replace("**", "<b>").replace("**", "</b>")
        # Return the diagnosis and the confidence score image path
        # return jsonify({"diagnosis": formatted_diagnosis, "confidence_score_image": confidence_score_image})
    else:
        return jsonify({"error": "Please enter the symptoms"}), 400

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
