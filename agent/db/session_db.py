"""
After a lot of research trying to figure out how I can share a single session between two process, I have finally given up.

The workaround is to use two sessions.
The api server session knows all the entities but the forwarder session doesn't.
Those entities can be fetched and stored in the forwarder's session.
"""

import mysql.connector
import sys
sys.path.append("..")
from config.main import DB_host, DB_user, DB_passwd, DB_database_session


class SessionDatabase:
  def __init__(self):
    self.db = mysql.connector.connect(
        host=DB_host,
        user=DB_user,
        passwd=DB_passwd,
        database=DB_database_session
    )
    self.db.autocommit = True

  def get_entity(self, entity_id, session_id='synapticSupport'):
    cursor = self.db.cursor()
    sql = "SELECT * FROM entities WHERE id like '%{}' AND session_id = '{}';".format(entity_id, session_id)
    cursor.execute(sql)
    result = cursor.fetchone()
    cursor.close()
    return result

  def save_entity(self, new_session_id, entity):
    try:
      cursor = self.db.cursor()
      sql = "INSERT INTO entities (session_id, id, hash, username, name) VALUES ('{}', {}, {}, '{}', '{}');".format(
          new_session_id, entity[1], entity[2], entity[3],  entity[5])
      cursor.execute(sql)
      cursor.close()
      return True
    except Exception as e:
      print(type(e).__name__)
      return False


if __name__ == "__main__":
  db = SessionDatabase()
  entity = db.get_entity(-1001274806011)
  entity = ('assd', 12131, 321, 'jpt', None, 'Aditya')
  db.save_entity('synapticSupportForwarder', entity)
