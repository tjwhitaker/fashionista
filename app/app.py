from bottle import route, run, static_file, template

@route('/')
def index():
    return template('templates/index')

@route('/static/<filename>')
def serve(filename):
    return static_file(filename, root='static/')

run(host='localhost', port=8080, reloader=True)
