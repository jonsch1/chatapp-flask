import os
import datetime


from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


#create list for all chats
chat_data={}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/create_new_chat", methods=["GET", "POST"])
def new_chat():
    new_chat=request.form.get("chat_name")
    chat_data[new_chat]=[]

    return render_template("chats.html", chat_data=chat_data)

#make route to template for individual chat
@app.route("/chat/<string:chat_name>")
def display_chat(chat_name):
    return render_template("chat.html", chat=chat_data[chat_name], chat_name=chat_name)


@socketio.on("new_message")
def new_message(data):
    message = data["message"]
    print(data["user"])
    user = data["user"]
    currenttime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    chat_name= data["chat_name"]
    chat_data[chat_name].append(f"{user}: {message} [{currenttime}]")
    currentlength = len(chat_data[chat_name])-1
    emit("next_message", chat_data[chat_name][currentlength], broadcast=True)



