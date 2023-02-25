import socket
from datetime import datetime

# Set up UDP socket for receiving messages
recv_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
recv_sock.bind(('localhost', 10003))

# Set up UDP socket for sending messages
send_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

name = input('Name: ')
print('\n\n\n')


# Function to receive and print incoming messages
def receive_messages():
    while True:
        message, address = recv_sock.recvfrom(1024)
        if message.decode() == '__mes':
            print('✔')
            print('---------------------------------------------------------------------')
        if message.decode() != '__mes':
            send_sock.sendto('__mes'.encode(), ('localhost', 10002))
            print(message.decode() + '\n' + '---------------------------------------------------------------------')


# Start the receive_messages function in a separate thread
import threading

threading.Thread(target=receive_messages).start()

# Send messages to the other user
while True:
    message = input()
    a = datetime.now().time()
    print(a)
    message = name + ': ' + message + ' | ' + str(a)
    send_sock.sendto(message.encode(), ('localhost', 10002))

