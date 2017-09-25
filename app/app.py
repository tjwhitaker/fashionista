from bottle import post, request, route, run, static_file, template
from sklearn.externals import joblib

@route('/')
def index():
    return template('templates/index')

@route('/static/<filename>')
def serve(filename):
    return static_file(filename, root='static/')

@post('/predict')
def predict():
    json = request.json
    data = json['data']
    model = joblib.load('models/rfc_model.pkl')
    prediction = model.predict([data])

    return {'label': prediction.tolist()} 


run(host='localhost', port=8080, reloader=True)
