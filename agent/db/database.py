import mysql.connector
import sys
sys.path.append("..")
from config.main import DB_host, DB_user, DB_passwd, DB_database

class Database:
  def __init__(self):
    self.db = mysql.connector.connect(
        host = DB_host,
        user = DB_user,
        passwd = DB_passwd,
        database = DB_database
    )

  def get_user(self, user_id):
    cursor = self.db.cursor()
    sql = "SELECT * FROM users WHERE chat_id = {};".format(user_id)
    cursor.execute(sql)
    result = cursor.fetchone()
    cursor.close()
    return result

  def get_redirections_of_source(self, source):
    cursor = self.db.cursor()
    sql = "SELECT * FROM redirections WHERE source = {} AND active = 1;".format(
        source)
    cursor.execute(sql)
    result = cursor.fetchall()
    cursor.close()
    return result

  def get_all_redirections(self):
    cursor = self.db.cursor()
    sql = "SELECT * FROM redirections;"
    cursor.execute(sql)
    result = cursor.fetchall()
    cursor.close()
    return result


if __name__ == "__main__":
  db = Database()
  r = db.get_redirections_of_source('1203470519')
  print(r)
