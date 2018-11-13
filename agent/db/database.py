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
    self.db.autocommit = True

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

  def get_redirection(self, redirection_id):
    """"
    Get redirection of given redirection id
    """
    cursor = self.db.cursor()
    sql = "SELECT * FROM redirections WHERE id = {} AND active = 1;".format(redirection_id)
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

  def get_filter(self, filter_id):
    cursor = self.db.cursor()
    sql = "SELECT * FROM filters WHERE id = {};".format(filter_id)
    cursor.execute(sql)
    result = cursor.fetchone()
    cursor.close()
    return result

  def get_transformations_of_redirection(self, redirection_id):
    cursor = self.db.cursor()
    sql = "SELECT * FROM transformations WHERE redirection_id = {} ORDER BY rank;".format(redirection_id)
    cursor.execute(sql)
    result = cursor.fetchall()
    cursor.close()
    return result

if __name__ == "__main__":
  db = Database()
  r = db.get_transformations_of_redirection('41')
  print(r)
