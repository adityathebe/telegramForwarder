const request = require('request');

class TelegramBot {
  constructor(api_key, username = undefined) {
    if (!api_key)
      throw new Error('Need API KEY !!');

    this.api_key = api_key
    this.username = username
  }

  send_video(receiver, video_id, caption) {
    return new Promise((success, failure) => {
      let jsondata = {
        video: video_id,
        chat_id: receiver,
        caption,
      }

      this.callSendAPI(jsondata, 'sendVideo')
        .then((data) => {
          console.log('\tMessage Sent');
          success('Message Sent')
        })
        .catch((err) => {
          console.log('\tFailed to send message:', err.description)
          failure(err.description)
        });
    })
  }

  send_photo(receiver, photo_id, caption) {
    return new Promise((success, failure) => {
      let jsondata = {
        photo: photo_id,
        chat_id: receiver,
        caption,
      };

      this.callSendAPI(jsondata, 'sendPhoto')
        .then((data) => {
          console.log('\tPhoto Sent');
          success('Photo Sent')
        })
        .catch((err) => {
          console.log('\tFailed to send Photo:', err.description)
          failure(err.description)
        });
    })
  }

  send_audio(receiver, audio_id) {
    return new Promise((success, failure) => {
      let jsondata = {
        audio: audio_id,
        chat_id: receiver,
        caption
      }

      this.callSendAPI(jsondata, 'sendMessage')
        .then((data) => {
          console.log('Audio Sent');
          success('Audio Sent')
        })
        .catch((err) => {
          console.log('\tFailed to send Audio:', err.description)
          failure(err.description)
        });
    })
  }

  send_message(receiver, message, parse_mode = 'html') {
    return new Promise((success, failure) => {
      let jsondata = {
        text: message,
        chat_id: receiver,
        disable_web_page_preview: false,
        parse_mode,
      }

      this.callSendAPI(jsondata, 'sendMessage')
        .then((data) => {
          console.log('\tMessage Sent');
          success('Message Sent')
        })
        .catch((err) => {
          console.log('\tFailed to send message:', err.description)
          failure(err.description)
        });
    })
  }

  send_media_group(receiver, inputMediaPhoto, parse_mode = 'html') {
    return new Promise((success, fail) => {
      let jsondata = {
        media: inputMediaPhoto,
        chat_id: receiver,
        disable_web_page_preview: false,
        parse_mode,
      }

      this.callSendAPI(jsondata, 'sendMediaGroup')
        .then((data) => {
          console.log('\tMessage Sent');
          success('Message Sent')
        })
        .catch((err) => {
          console.log('\tFailed to send message:', err.description)
          failure(err.description)
        });
    })
  }

  send_document(receiver, file_id) {
    return new Promise((success, failure) => {
      let jsondata = {
        document: file_id,
        chat_id: receiver,
      }

      this.callSendAPI(jsondata, 'sendDocument')
        .then((data) => {
          console.log('\tMessage Sent');
          success('Message Sent')
        })
        .catch((err) => {
          console.log('\tFailed to send message:', err.description)
          failure(err.description)
        });
    })
  }

  send_buttons(receiver, json_obj, message) {

    let jsondata = {
      text: message,
      chat_id: receiver,
      reply_markup: json_obj,
      parse_mode: 'html'
    }

    this.callSendAPI(jsondata, 'sendMessage')
      .then((data) => console.log('\tButtons Sent'))
      .catch(err => console.log('\tFailed to send buttons:', err.description))
  }

  delete_msg(chat_id, message_id) {
    /* Deletes message of a chat */
    this.callSendAPI({ chat_id, message_id }, 'deleteMessage')
      .then((data) => console.log('Message deleted'))
      .catch(err => console.log('Failed to delete msg', err));
  }

  edit_message(chat_id, message_id, edited_msg, json_obj, markup = 'html') {

    let jsondata = {
      text: edited_msg,
      chat_id: chat_id,
      message_id: message_id,
      reply_markup: json_obj,
      parse_mode: markup
    }

    this.callSendAPI(jsondata, 'editMessageText')
      .then((data) => console.log('\tEdited Message Sent'))
      .catch(err => console.log('\tFailed to send edited message:', err.description))
  }

  getAdminList(chat_id) {
    let jsondata = {
      chat_id,
    }

    return this.callSendAPI(jsondata, 'getChatAdministrators')
  }

  setWebhook(webhook_url) {
    console.log('Setting up Webhook');
    const url = `https://api.telegram.org/${this.api_key}/setWebhook?url=${webhook_url}`;
    request({ url, json: true }, (err, resp, data) => {
      if (err)
        return void console.log('Error', err);
      console.log(JSON.stringify(data, null, 4))
    });
  }

  getWebhookInfo() {
    const uri = `https://api.telegram.org/${this.api_key}/getWebhookInfo`;
    request({ uri, json: true }, (err, resp, data) => {
      if (err)
        return void console.log('Error', err);
      console.log(JSON.stringify(data, null, 4))
    });
  }

  callSendAPI(jsondata, method_type) {
    return new Promise((resolve, reject) => {

      let url = `https://api.telegram.org/${this.api_key}/${method_type}`;
      let msg_options = {
        uri: url,
        method: 'POST',
        json: true,
        body: jsondata
      }

      request(msg_options, (err, resp, data) => {
        if (err) reject(err)
        if (data.ok == false) reject(data)
        else resolve(data);
      })
    });
  }
}

module.exports = TelegramBot;
