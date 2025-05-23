from flask import Flask, render_template, request, redirect, flash, abort, jsonify
import flask_login
import pymysql
from dynaconf import Dynaconf
from datetime import date, datetime
from ics import Calendar


app = Flask(__name__)
access = 0

conf = Dynaconf(
    settings_file=["settings.toml"]
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
        host="db.steamcenter.tech",
        database="plot_point",
        user=conf.username,
        password=conf.password,
        autocommit=True,
        cursorclass=pymysql.cursors.DictCursor
    )
    return conn


@app.route("/cta")
def index():
    return render_template("homepage.html.jinja")


@app.route("/signin", methods=["POST", "GET"])
def sin():
    if flask_login.current_user.is_authenticated:
        return redirect("/")
    else:
        if request.method == "POST":
            username = request.form["username"].strip()
            password = request.form["pass"]
            conn = connectdb()
            cursor = conn.cursor()
            cursor.execute(
                f"SELECT * FROM `User` WHERE `username` = '{username}' OR `email` = '{username}';")
            result = cursor.fetchone()
            if result is None:
                flash("Your Username/Password is incorrect")
            elif password != result["password"]:
                flash("Your Username/Password is incorrect")
            else:
                user = User(result["id"], result["username"], result["email"],
                            result["first_name"], result["last_name"])
                flask_login.login_user(user)
                cursor.close()
                conn.close()
                return redirect("/")
    return render_template("signin.html.jinja")


@app.route("/signup", methods=["POST", "GET"])
def sup():
    if flask_login.current_user.is_authenticated:
        return redirect("/")
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
                        (`first_name`, `last_name`, `username`, `password`, `email`,`access`)
                    VALUE
                        ('{first_name}', '{last_name}', '{username}', '{password}', '{email}',{access});
                    """)
                except pymysql.err.IntegrityError:
                    flash("Username/Email is already in use")
                else:
                    return redirect("/signin")
                finally:
                    cursor.close()
                    conn.close()

        return render_template("signup.html.jinja")


@app.route("/logout")
def logout():
    flask_login.logout_user()
    return redirect("/signin")


@app.route("/")
def main():
    date.today().year
    year = range(date.today().year, date.today().year + 3)
    return render_template("mainpage.html.jinja", year=year)


@app.route("/acc")
def accounts():
    if flask_login.current_user.is_authenticated:
        user_id = flask_login.current_user.id
        conn = connectdb()
        cursor = conn.cursor()
        cursor.execute(f"""SELECT `username`,`email`,`first_name`,`last_name`
        FROM `User` WHERE `id` = {user_id};""")
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template("account.html.jinja", account=result)
    else:
        return redirect("/cta")
    

# @app.route("/<assignment_id>/upd", methods = ["POST"])
@app.route("/tester", methods = ["POST"])
def assignupd():
    user_id = flask_login.current_user.id
    conn = connectdb()
    cursor = conn.cursor()
    # Retrieve the assignment ID and the "vehicle1" checkbox value from the form
    assignment_id = request.form["assignment_id"]
    checked = request.form["vehicle1"]
    if checked == "checked":
        print("checked")
        cursor.execute("UPDATE Assignment SET completed = 1 WHERE id = %s;", (assignment_id,))
    else:
        print("not checked")
        cursor.execute("UPDATE Assignment SET completed = 0 WHERE id = %s;", (assignment_id,))
    cursor.close()
    conn.close()
    return redirect("/")
    



@app.route("/acc/upduser", methods=["POST"])
@flask_login.login_required
def updusername():
    user_id = flask_login.current_user.id
    conn = connectdb()
    cursor = conn.cursor()
    username = request.form["username"]
    cursor.execute("UPDATE User SET username = %s, access = 0 WHERE id = %s;",(username, user_id))
    first_name = request.form["first_name"]
    cursor.execute("UPDATE User SET first_name = %s, access = 0 WHERE id = %s;", (first_name, user_id))
    last_name = request.form["last_name"]
    cursor.execute("UPDATE User SET last_name = %s, access = 0 WHERE id = %s;", (last_name, user_id))
    email = request.form["email"]
    cursor.execute("UPDATE User SET email = %s, access = 0 WHERE id = %s;", (email, user_id))
    password = request.form["password"]
    confirm_password = request.form["confirm_password"]
    if password == confirm_password:
        cursor.execute("UPDATE User SET password = %s, access = 0 WHERE id = %s;",(password, user_id))
        cursor.close()
        conn.close()
        return redirect("/logout")
    else:
        flash("The passwords don't match")
        cursor.close()
        conn.close()
        return redirect ("/acc")

@app.route('/dateSub/<info>')
def info(info):
    User_id = flask_login.current_user.id
    conn = connectdb()
    cursor = conn.cursor()
    print(f'fetch ran! + {info}')
    cursor.execute(f"""SELECT * FROM Assignments WHERE user_id = {User_id} and date like '%{info}%';""")
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    print(result)
    return jsonify(result)

    
        
    
@app.route('/formSub', methods=['POST'])
@flask_login.login_required
def formSub():
     if request.method == "POST":
        conn = connectdb()
        cursor = conn.cursor()
        User_id = flask_login.current_user.id
        Name = request.form["name"]
        Years = request.form["years"]
        Minutes = request.form["minutes"]
        Hours = request.form["hours"]
        Days = request.form["days"]
        Month_int = request.form["months"]
        Months = int(Month_int) + 1
        Months = str(Months)
        Date = datetime(int(Years), int(Months), int(Days), int(Hours), int(Minutes))
        Description = request.form["description"]
        cursor.execute(f"""
                        INSERT INTO `Assignments` 
                            (`date`, `name`, `user_id`, `description`)
                        VALUE
                            ('{Date.isoformat()}', '{Name}', {User_id}, '{Description}');
                        """)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return redirect("/signin")
     else:
        flash("The passwords don't match")
        return redirect ("/acc")


@app.route("/settings")
def settings():
    return render_template("settings.html.jinja")

@app.route("/acc/delete_account", methods=["POST"])
@flask_login.login_required
def delete_account():
    conn = connectdb()
    cursor = conn.cursor()

    user_id = flask_login.current_user.id

    cursor.execute(f"DELETE FROM `Users` WHERE `id` = {user_id}; ")

    cursor.close()
    conn.close()

    return redirect("/")

@app.route("/fileupload", methods=['POST'])
@flask_login.login_required
def upload_file():
    User_id = flask_login.current_user.id
    file = request.files['filename']
    string = file.stream.read().decode()
    c = Calendar(string)
    for e in c.events:
        name = e.name
        Date = e.end.datetime.isoformat().split('+')[0]
        importid = e.uid
        if "event" not in e.url and len(name) > 0:
            conn = connectdb()
            cursor = conn.cursor()
            cursor.execute(f"""
                INSERT INTO `Assignments`
                    (`name`, `date`, `user_id`, `importid`)
                VALUE
                    ('{name}', '{Date}', {User_id}, '{importid}')
                ON DUPLICATE KEY UPDATE
                    `name` = '{name}',
                    `date` = '{Date}';
                """)
            conn.close()
            cursor.close()

    return redirect ("/")



@app.route("/acc/delete_assignment/<itemId>", methods=["POST"])
@flask_login.login_required
def delete_assignment(itemId):
    conn = connectdb()
    cursor = conn.cursor()

    # assignment_id = request.form["assignment_id"]
    assignment_id = itemId

    cursor.execute(f"DELETE FROM `Assignments` WHERE `id` = {assignment_id}; ")

    cursor.close()
    conn.close()

    return redirect("/")










