import socket

# Initialize the client's TCP socket
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Connect to the server
client_socket.connect(('localhost', 5000))

# Receive the welcome message from the server
print(client_socket.recv(1024).decode())

# Initialize the client's UDP socket
client_udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Prompt the user for a message to send
while True:
    message = input('Enter a message to send: ')

    # Send the message to the server via UDP with a sequence number
    seq_num = str.encode(str(len(message)))
    client_udp_socket.sendto(seq_num + b'|' + message.encode(), ('localhost', 5001))
