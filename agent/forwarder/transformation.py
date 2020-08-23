from db.database import Database
import sys
sys.path.append("..")

# Connect to database
database = Database()


class MessageTransformation:

    @staticmethod
    def get_transformed_msg(message_event, redirection_id):
        transformations = database.get_transformations_of_redirection(
            redirection_id)

        # Apply Transformation
        msg_entities = message_event.message.entities
        msg_txt = message_event.message.message

        for transformation in transformations:
            old_phrase = transformation[2]
            new_phrase = transformation[3]
            msg_txt = msg_txt.replace(old_phrase, new_phrase)

        return msg_txt


if __name__ == "__main__":
    msg = 'hi there. I love violin'
    resp = MessageTransformation.get_transformed_msg(msg, 41)
    print(resp)
