import os
import sqlite3


class Database:
    def __init__(self):
        path = os.path.dirname(os.path.abspath(__file__))
        db = os.path.join(path, '..', '..', 'database', 'database.db')
        self.db = sqlite3.connect(db)

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
        sql = "SELECT * FROM redirections WHERE id = {} AND active = 1;".format(
            redirection_id)
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
        sql = "SELECT * FROM transformations WHERE redirection_id = {} ORDER BY rank;".format(
            redirection_id)
        cursor.execute(sql)
        result = cursor.fetchall()
        cursor.close()
        return result


if __name__ == "__main__":
    db = Database()
    c = db.db.cursor()
    c.execute("SELECT name FROM sqlite_master WHERE type='table'")
    print(c.fetchall())


    # r = db.get_all_redirections()
    # print(r)
