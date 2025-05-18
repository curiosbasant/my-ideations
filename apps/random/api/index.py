from flask import Flask, request
import easyocr
import base64
import requests

app = Flask(__name__)

@app.route("/api/solve-captcha", methods=['POST'])
def hello_world():
    body_text = request.data.decode('utf-8')
  #  return "content_type =>" + request.content_type
    #print(body_text, body_text.split(',', 1)[1])
    reader = easyocr.Reader(['en'])
    image_bytes = base64.b64decode(body_text.split(',', 1)[1])
    result = reader.readtext(image_bytes)

    label = result[0][1]  # 'STSfB6'
    score = float(result[0][2])

    return "<p>Hello, World!!</p>" + label

@app.after_request
def handle_options(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-Requested-With"

    return response
