import sys
import time
import random
import sqlite3

from Adafruit_IO import MQTTClient

ADAFRUIT_IO_KEY = '1dab7555d11545749748116e77fc4bbe'
ADAFRUIT_IO_USERNAME = 'vedangj'
IO_FEED = 'light'

print("connected databse")

def connected(client):
    print ('Connected to Adafruit IO! Listening for feed changes...')
    # subscribe to feed in a dashdoard
    client.subscribe('light')

def disconnected(client):
    print ('Disconnect from Adafruit IO!')
    conn.close()
    sys.exit(1)

def message(client, feed_id, payload):

    print ('Feed {0} recieved new vaule: {1}'.format(feed_id, payload))
    espcodeAdafruit = "esp1"
    conn = sqlite3.connect('data.sqlite3')
    query = "INSERT INTO data(id, espcode, value, time) VALUES(1, {0}, {1}, {2})".format(espcodeAdafruit, payload, datetime.datetime.now())
    conn.execute(query)
    try:
        conn.commit()
    except Exception as e:
        print(e)
        raise
    conn.close()

client = MQTTClient(ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY)

client.on_connect    = connected
client.on_disconnect = disconnected
client.on_message    = message
client.loop_background()
client.connect()

while True:
    print("Updating")
    time.sleep(10)
