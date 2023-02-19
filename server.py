import socket

# Initialize the server socket
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Bind the socket to a specific IP address and port
server_socket.bind(('localhost', 5000))

# Start listening for incoming connections
server_socket.listen()

# Wait for a client to connect via TCP
client_socket, client_address = server_socket.accept()

# Send a welcome message to the client
client_socket.send(b'Welcome to the chat server!\n')

# Initialize the client's UDP socket
client_udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
client_udp_socket.bind(('localhost', 5001))

# Wait for the client to send a message via UDP
while True:
    message, address = client_udp_socket.recvfrom(1024)
    print(f'Received message from {address}: {message.decode()}')
