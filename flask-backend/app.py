from flask import Flask, request, jsonify, Response
from flask_cors import *
from flask_sqlalchemy import SQLAlchemy
import json
import datetime
import hashlib
from Adafruit_IO import Client, Data
import pandas as pd
import altair as alt

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.sqlite3'
app.config['SECRET_KEY'] = "THIS IS SECRET"
app.config.from_object(__name__)
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    espcode = db.Column(db.String(100), nullable=False)


class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    espcode = db.Column(db.String(100))
    value = db.Column(db.String(100))
    time = db.Column(db.DateTime)


class Mode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    espcode = db.Column(db.String(100), unique=True)
    mode = db.Column(db.String(10))
    highV = db.Column(db.Integer)
    lowV = db.Column(db.Integer)
    interval = db.Column(db.Integer)
    duration = db.Column(db.Integer)


@app.route('/home', methods=['GET'])
def main():
    espcode = request.args.get('code', type=str)

    mo = Mode.query.filter_by(espcode=espcode).first()

    info = {"espcode": espcode,
            "mode": mo.mode}

    if info['mode'] == 'AUTO':
        info['highV'] = mo.highV
        info['lowV'] = mo.lowV
    elif info['mode'] == 'PROF':
        info['interval'] = mo.interval
        info['duration'] = mo.duration

    return jsonify(info)


@app.route('/auto', methods=['POST'])
def automatic():
    if request.method == 'POST':
        espcode = request.json.get('espcode')
        highV = int(request.json.get('highV'))
        lowV = int(request.json.get('lowV'))

        Mode.query.filter_by(espcode=espcode).delete()

        mo = Mode(espcode=espcode, mode='AUTO', highV=highV, lowV=lowV)
        db.session.add(mo)
        db.session.commit()

        return Response(status=201)


@app.route('/manual', methods=['GET', 'POST'])
def manual():
    if request.method == 'POST':
        espcode = request.json.get('espcode')
        state = request.json.get('data')
        Mode.query.filter_by(espcode=espcode).delete()

        mo = Mode(espcode=espcode, mode='MANU')
        db.session.add(mo)
        db.session.commit()

        ADAFRUIT_IO_KEY = 'aio_JFBr62C1tzaaB9lAn0uGWNDup5RB'
        ADAFRUIT_IO_USERNAME = 'anuragpal'
        aio = Client(ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY)
        espcodeAdafruit1 = "motor"

        if state == 'ON':
            aio.send_data(aio.feeds(espcodeAdafruit1).key, 'ON')
        else:
            aio.send_data(aio.feeds(espcodeAdafruit1).key, 'OFF')

        return Response(status=200)


@app.route('/graph', methods=['GET'])
def graph():
    espcode = request.args.get('code', type=str)
    data = Data.query.all()
    l = []
    for i in data:
        l.append([i.time, i.value])

    ddf = pd.DataFrame(l, columns=['time', 'value'])
    area = alt.Chart(ddf).mark_line().encode(
        x='time:T',
        y='value:Q',
    ).configure_projection(
        scale=10
    ).interactive()

    return area.to_dict()


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.json.get('username')
        password = request.json.get('password')

        makeLogin = User.query.filter_by(username=username).first()
        encpass = hashlib.sha256(password.encode())
        if encpass.hexdigest() == makeLogin.password:
            return jsonify({"message": makeLogin.espcode})
        else:
            return jsonify({"message": "Invalid Credentials"})


@app.route('/signup', methods=['POST'])
def singup():
    if request.method == 'POST':
        username = request.json.get('username')
        password = request.json.get('password')

        return True


if __name__ == '__main__':
    # db.create_all()
    app.run(debug=True)
