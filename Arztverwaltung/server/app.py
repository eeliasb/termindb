from datetime import date

from flask import Flask, jsonify
import mysql.connector
from flask import request
import json
from flask_cors import CORS



mysql = mysql.connector.connect(
    host="localhost", user="root", password="", database="termindb"
)

app = Flask(__name__)
# MySQL configurations
CORS(app)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'termindb'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'


@app.route('/patient/')
def get():
    cur = mysql.cursor()
    cur.execute('select * from patienten')
    result = cur.fetchall()
    cur.close()
    return jsonify(result)

@app.route('/patient/', methods = ['Post'])
def insert_patient():
    # request.data enthält die vom Client übergebenen Daten im JSON Format
    # json.loads wandelt das JSON in ein Python Objekt um
    content = json.loads(request.data)
    print("Vorname: ", content["vorname"])
    print("Nachname: ", content["nachname"])
    print("Titel: ", content["titel"])
    print("SVNR: ", content["svnr"])
    print("Geburtsdatum: ", content["geburtsdatum"])
    print("Geschlecht: ", content["geschlecht"])
    # TODO: Als JSON übergebene Patientendaten in MySQL Datenbank einfügen
    cur = mysql.cursor()

    # -
    insert_statement = ( "Insert Into patienten (`titel`, `vorname`, `nachname`, `svnr`, `geburtsdatum`, `geschlecht`)"
                         "VALUES (%s, %s, %s, %s, %s, %s)"
    )
    data = (content["titel"], content["vorname"], content["nachname"], content["svnr"], content["geburtsdatum"], content["geschlecht"] )
    cur.execute(insert_statement, data)
    mysql.commit()
    cur.close()
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@app.route('/patient/<int:id>', methods = ['Delete'])
def delete_patient(id):
    cur = mysql.cursor()
    sql = "DELETE FROM patienten WHERE id = " + str(id)
    cur.execute(sql)
    mysql.commit()
    cur.close()
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@app.route('/patient/<int:id>', methods = ['Get'])
def get_one_patient(id):
    cur = mysql.cursor()
    cur.execute('select * from patienten where id=' + str(id))
    result = cur.fetchall()
    cur.close()
    return jsonify(result)

@app.route('/patient/<int:id>', methods = ['Put'])
def edit_patient(id):
    # request.data enthält die vom Client übergebenen Daten im JSON Format
    # json.loads wandelt das JSON in ein Python Objekt um
    content = json.loads(request.data)
    cur = mysql.cursor()

    cur.execute('select id from patienten where id=' + str(id))
    result = cur.fetchall()
    print(result)
    # -

    if result == []:
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    else:
        update_statement = (
            "UPDATE patienten "
            "SET id=%s, titel=%s, vorname=%s, nachname=%s, svnr=%s, geburtsdatum=%s, geschlecht=%s "
            "WHERE id=%s"
        )
        data = (content["id"], content["titel"], content["vorname"], content["nachname"], content["svnr"],
                content["geburtsdatum"], content["geschlecht"], content["id"])
        cur.execute(update_statement, data)

    mysql.commit()
    cur.close()
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@app.route('/arzt/')
def get_arzt():
    cur = mysql.cursor()
    cur.execute('select * from a_arzt')
    result = cur.fetchall()
    cur.close()
    return jsonify(result)

@app.route('/arzt/', methods = ['Post'])
def insert_arzt():
    # request.data enthält die vom Client übergebenen Daten im JSON Format
    # json.loads wandelt das JSON in ein Python Objekt um
    content = json.loads(request.data)
    print("Vorname: ", content["vorname"])
    print("Nachname: ", content["nachname"])
    print("Titel: ", content["titel"])
    print("fachrichtung: ", content["fachrichtung"])
    print("telefon: ", content["telefon"])
    print("email: ", content["email"])
    print("strasse: ", content["strasse"])
    print("plz: ", content["plz"])
    print("ort: ", content["ort"])
    cur = mysql.cursor()

    # -
    insert_statement = ( "INSERT INTO `termindb`.`a_arzt` (`titel`, `vorname`, `nachname`, `fachrichtung`, `telefon`, `email`, `strasse`, `plz`, `ort`) "
                         "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    )
    data = (content["titel"], content["vorname"], content["nachname"], content["fachrichtung"], content["telefon"], content["email"], content["strasse"], content["plz"], content["ort"])
    cur.execute(insert_statement, data)
    mysql.commit()
    cur.close()
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@app.route('/arzt/<int:id>', methods = ['Delete'])
def delete_arzt(id):
    cur = mysql.cursor()
    sql = "DELETE FROM a_arzt WHERE id = " + str(id)
    cur.execute(sql)
    mysql.commit()
    cur.close()
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@app.route('/arzt/<id>', methods = ['Get'])
def get_one_arzt(id):
    cur = mysql.cursor()
    cur.execute('select * from a_arzt where id=' + str(id))
    result = cur.fetchall()
    cur.close()
    return jsonify(result)

@app.route('/arzt/<int:id>', methods = ['Put'])
def edit_arzt(id):
    # request.data enthält die vom Client übergebenen Daten im JSON Format
    # json.loads wandelt das JSON in ein Python Objekt um
    content = json.loads(request.data)
    cur = mysql.cursor()

    cur.execute('select id from a_arzt where id=' + str(id))
    result = cur.fetchall()
    print(result)
    # -

    if result == []:
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    else:
        update_statement = (
            "UPDATE a_arzt "
            "SET id=%s, titel=%s, vorname=%s, nachname=%s, fachrichtung=%s, telefon=%s, email=%s, strasse=%s, plz=%s, ort=%s "
            "WHERE id=%s"
        )
        data = (content["id"], content["titel"], content["vorname"], content["nachname"], content["fachrichtung"],
                content["telefon"], content["email"], content["strasse"],
                content["plz"], content["ort"], content["id"])
        cur.execute(update_statement, data)

    mysql.commit()
    cur.close()
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@app.route('/termin/<int:id>', methods = ['Get'])
def get_one_termin(id):
    cur = mysql.cursor()
    cur.execute('select * from t_termin where id=' + str(id))
    result = cur.fetchall()
    cur.close()
    return jsonify(result)

@app.route('/termin/patient/<int:id>/', methods = ['Get'])
def get_termin_patient(id):
    fromdate = request.args.get('from')
    todate = request.args.get('to')

    cur = mysql.cursor()
    cur.execute('select * from t_termin where patienten_id = ' + str(id) + ' and (beginn between "' + fromdate + '" and "' + todate + '") order by beginn')
    result = cur.fetchall()
    cur.close()
    return jsonify(result)

#localhost:5000/termin/arzt/2/?fromdate=2010-10-10&todate=2011-10-10
@app.route('/termin/arzt/<int:id>/', methods = ['Get'])
def get_termin_arzt(id):
    fromdate = request.args.get('from')
    todate = request.args.get('to')
    print(fromdate)
    cur = mysql.cursor()
    sqlStatement = 'select * from t_termin where a_arzt_id = ' + str(id) + ' and (beginn between "' + fromdate + '" and "' + todate + '") order by beginn'
    print(sqlStatement)
    cur.execute(sqlStatement)
    result = cur.fetchall()
    cur.close()
    return jsonify(result)

@app.route('/termin/arzt/<int:id>', methods = ['Post'])
def insert_termin(id):
    content = json.loads(request.data)
    cur = mysql.cursor()
    insert_statement = ( "INSERT INTO `termindb`.`t_termin`(`a_arzt_id`, `beginn`, `dauer`) "
                         "VALUES (%s, %s, %s)"
    )
    print(insert_statement)
    data = (id, content["beginn"], content["dauer"])
    cur.execute(insert_statement, data)
    mysql.commit()
    cur.close()
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@app.route('/termin/<int:i_id>/<int:p_id>', methods = ['Put'])
def edit_termin(i_id, p_id):
    # request.data enthält die vom Client übergebenen Daten im JSON Format
    # json.loads wandelt das JSON in ein Python Objekt um
    
    cur = mysql.cursor()

    cur.execute('select id from t_termin where id=' + str(i_id))
    result = cur.fetchall()
    print(result)
    # -

    if result == []:
        return json.dumps({'success': False}), 400, {'ContentType': 'application/json'}
    else:
        update_statement = (
            "UPDATE t_termin "
            "SET patienten_id = %s "
            "WHERE id=%s"
        )
        data = (p_id, i_id)
        cur.execute(update_statement, data)

    mysql.commit()
    cur.close()
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@app.route('/termin/')
def get_termin():
    cur = mysql.cursor()
    cur.execute('select * from t_termin')
    result = cur.fetchall()
    cur.close()
    return jsonify(result)

@app.route('/termin/<int:id>', methods = ['Delete'])
def delete_termin(id):
    cur = mysql.cursor()
    sql = "DELETE FROM t_termin WHERE id = " + str(id)
    cur.execute(sql)
    mysql.commit()
    cur.close()
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

if __name__ == '__main__':
    app.run()