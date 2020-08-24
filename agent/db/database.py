import psycopg2
from config import DB_HOST


class Database:
    def __init__(self):
        self.db = psycopg2.connect(
            host=DB_HOST,
            database="telegram",
            user="postgres",
            password="mysecretpassword")

    def get_user(self, user_id):
        cursor = self.db.cursor()
        sql = f"SELECT * FROM users WHERE chat_id = '{user_id}'"
        cursor.execute(sql)
        result = cursor.fetchone()
        cursor.close()
        return result

    def get_active_redirections_of_source(self, source):
        cursor = self.db.cursor()
        sql = f"SELECT * FROM redirections WHERE source = '{source}' AND active = TRUE"
        cursor.execute(sql)
        result = cursor.fetchall()
        cursor.close()
        return result

    def get_redirection(self, redirection_id):
        """"
        Get redirection of given redirection id
        """
        cursor = self.db.cursor()
        sql = f"SELECT * FROM redirections WHERE id = '{redirection_id}' AND active = 1"
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
        sql = f"SELECT * FROM filters WHERE id = {filter_id}"
        cursor.execute(sql)
        result = cursor.fetchone()
        cursor.close()
        return result

    def get_transformations_of_redirection(self, redirection_id):
        cursor = self.db.cursor()
        sql = f"SELECT * FROM transformations WHERE redirection_id = {redirection_id} ORDER BY rank"
        cursor.execute(sql)
        result = cursor.fetchall()
        cursor.close()
        return result
