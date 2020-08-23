import sqlite3
import datetime
import time
from Adafruit_IO import Client, Data

ADAFRUIT_IO_KEY = 'aio_JFBr62C1tzaaB9lAn0uGWNDup5RB'
ADAFRUIT_IO_USERNAME = 'anuragpal'
aio = Client(ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY)
conn = sqlite3.connect('data.sqlite3')
espcodeAdafruit = "esp1"
espcodeAdafruit1 = "motor"


def receiveData():
    data = aio.receive('moisture')
    query = "INSERT INTO data(espcode, value, time) VALUES('{0}', '{1}', '{2}')".format(
        espcodeAdafruit, data.value, datetime.datetime.now())
    conn.execute(query)
    conn.commit()


def send_data(a):
    aio.send_data(aio.feeds(espcodeAdafruit1).key, a)


while True:
    cursor = conn.execute(
        "SELECT * FROM mode where espcode=='{0}'".format(espcodeAdafruit))
    x = cursor
    for row in cursor:
        print(row)
        x = row
        break
    mode = x[2]
    cursor.close()

    if mode == "AUTO":
        highV = x[3]
        lowV = x[4]

        curr = conn.execute(
            "SELECT * FROM data WHERE espcode=='{0}' ORDER BY time DESC LIMIT 1".format(espcodeAdafruit), )
        row = curr.fetchall()
        value = int(row[0][2])
        if value <= lowV:
            send_data('ON')
        else:
            send_data('OFF')

    time.sleep(10)
    receiveData()
conn.close()
