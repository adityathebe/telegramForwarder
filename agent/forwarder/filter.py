import sys
sys.path.append("..")

# Connect to database
from db.database import Database
database = Database()


class Filter:

  @staticmethod
  def get_filter(filter_id):
    filter = database.get_filter(filter_id)
    if filter is None:
      return False

    filter_dict = {
        'id': filter[0],
        'audio': filter[1],
        'video': filter[2],
        'photo': filter[3],
        'sticker': filter[4],
        'document': filter[5],
        'geo': filter[6],
        'contact': filter[7],
        'contain': filter[8],
        'notcontain': filter[9]
    }
    return filter_dict

  @staticmethod
  def get_active_filters(filter_dict):
    """
    Takes in a filter dictionary
    Returns a list of active filter names
    Example: ('photo', 'audio')
    """
    if not isinstance(filter_dict, dict):
      raise ValueError('Provide a dictionary')

    active_filter_list = []
    for key, value in filter_dict.items():
      if value != 0 and value is not None:
        if key is not 'id':
          active_filter_list.append(key)

    return active_filter_list

  @staticmethod
  def get_message_type(event):
    if event.media == None:
      return 'text'
    if hasattr(event.media, 'photo'):
      return 'photo'
    if hasattr(event.media, 'geo'):
      return 'geo'
    if hasattr(event.media, 'vcard'):
      return 'contact'

    # Documents (audio, video, sticker, files)
    mime_type = event.media.document.mime_type
    if 'audio' in mime_type:
      return 'audio'
    if 'video' in mime_type:
      return 'video'
    if 'image/webp' in mime_type:
      return 'sticker'

    # Anything else is a file
    return 'document'

  @staticmethod
  def filter_msg(filter_id, message_event):
    """
    Function that decides if a message should be forwarded or not
    Returns Boolean
    """

    # Get Filter dictionary from database
    filter_dict = Filter.get_filter(filter_id)
    if filter_dict == False:
      return False

    # Get Active Filter list
    filter_list = Filter.get_active_filters(filter_dict)
    
    # Get Message Types
    msg_type = Filter.get_message_type(message_event)
    msg_text = message_event.message.text.lower()

    if msg_type in filter_list:
      return True

    should_filter = True
    if 'contain' in filter_list:
      # Look for text messages only
      if message_event.media is not None:
        return False
      keywords = filter_dict['contain'].split('<stop_word>')
      for keyword in keywords:
        if keyword in msg_text:
          should_filter = False
          break

    if 'notcontain' in filter_list:
      # Look for text messages only
      if message_event.media is not None:
        return False
      keywords = filter_dict['notcontain'].split('<stop_word>')
      for keyword in keywords:
        if keyword in msg_text:
          should_filter = True
          break
        else:
          should_filter = False

    return should_filter


if __name__ == "__main__":
  resp = Filter.get_filter('50')
  print(resp)
  filter_list = Filter.get_active_filters(resp)
  print(filter_list)
