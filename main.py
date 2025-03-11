from flask import Flask, render_template, request, redirect, flash, jsonify
import flask_login
import pymysql
from dynaconf import Dynaconf

app = Flask(__name__)

conf = Dynaconf(
    settings_file = ["settings.toml"]
)

app.secret_key = conf.secret_key

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

class User:
    is_authenticated = True
    is_anonymous = False
    is_active = True
    def __init__(self, user_id, username, email, first_name, last_name):
        self.id = user_id
        self.username = username
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
    def get_id(self):
        return str(self.id)

@login_manager.user_loader

def load_user(user_id):
    conn = connectdb()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM `User` WHERE `id` = {user_id};")
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    if result is not None:
        return User(result["id"], result["username"], result["email"], result["first_name"], result["last_name"])
    
def connectdb():
    conn = pymysql.connect(
        host = "db.steamcenter.tech",
        database = "plot_point",
        user = conf.username,
        password = conf.password,
        autocommit = True,
        cursorclass = pymysql.cursors.DictCursor
    )
    return conn

@app.route("/cta")
def index ():
    return render_template("homepage.html.jinja")



@app.route("/signin", methods=["POST","GET"])
def sin ():
    if flask_login.current_user.is_authenticated:
        return redirect ("/")
    else:
        if request.method == "POST":
            username = request.form["username"].strip()
            password = request.form["pass"]
            conn = connectdb()
            cursor = conn.cursor()
            cursor.execute(f"SELECT * FROM `User` WHERE `username` = '{username}' OR `email` = '{username}';")
            result = cursor.fetchone()
            if result is None:
                flash("Your Username/Password is incorrect")
            elif password != result["password"]:
                flash("Your Username/Password is incorrect")
            else:
                user = User(result["id"], result["username"], result["email"], result["first_name"], result["last_name"])
                flask_login.login_user(user)
                cursor.close()
                conn.close()
                return redirect("/")
    return render_template("signin.html.jinja")



@app.route("/signup", methods=["POST", "GET"])
def sup ():
    if flask_login.current_user.is_authenticated:
        return redirect ("/")
    else:
        if request.method == "POST":
            first_name = request.form["fname"]
            last_name = request.form["lname"]
            username = request.form["username"]
            password = request.form["pass"]
            confirmpassword = request.form["confirmpass"]
            email = request.form["email"]
            conn = connectdb()
            cursor = conn.cursor()
            if len(password) < 8:
                flash("Password contains less than 8 characters")
            if confirmpassword != password:
                flash("The passwords don't match")
            else:
                try:
                    cursor.execute(f"""
                    INSERT INTO `User` 
                        (`first_name`, `last_name`, `username`, `password`, `email`)
                    VALUE
                        ('{first_name}', '{last_name}', '{username}', '{password}', '{email}');
                    """)
                except pymysql.err.IntegrityError:
                    flash("Username/Email is already in use")
                else:    
                    return redirect("/signin") 
                finally:
                    cursor.close()
                    conn.close()

        return render_template("signup.html.jinja")



@app.route("/")
def main ():
    return render_template("mainpage.html.jinja")

@app.route("/", methods=["POST", "GET"])
def assignment():
    request.method == "POST"
    Name = request.form["name"]
    Years = request.form["years"]
    Minutes = request.form["minutes"]
    Hours = request.form["hours"]
    Weeks = request.form["weeks"]
    Days = request.form["days"]
    Months = request.form["months"]
    conn = connectdb()
    cursor = conn.cursor() 
    cursor.execute(f"""
                    INSERT INTO `Time` 
                        (`years`, `minutes`, `hours`, `weeks`, `days`, `months`, `name`)
                    VALUE
                        ({Years}, {Minutes}, {Hours}, {Weeks}, {Days}, {Months}, '{Name}');
                    """)
    result = cursor.fetchall()
    conn.close()
    cursor.close()
    return render_template("mainpage.html.jinja", result = result)
