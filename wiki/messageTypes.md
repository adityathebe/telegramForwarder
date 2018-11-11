# Types of Messages

[Telethon Documentation](https://lonamiwebs.github.io/Telethon/constructors/index.html)

- UpdateShortMessage
- UpdateNewMessage ( stickers, photos, audio, videos, location, contacts )
- UpdateNewChannelMessage
- 


### How to know if a message contains a given entity ?

1. Stickers
- event.media.document.attributes : [<telethon.tl.types.DocumentAttributeSticker>,<telethon.tl.types.DocumentAttributeFilename>,<telethon.tl.types.DocumentAttributeImageSize>]

2. Images
- event.media.photo

3. Audio
- event.media.document.attributes = [<telethon.tl.types.DocumentAttributeAudio>]

4. Video
- event.media.document.attributes = [<telethon.tl.types.DocumentAttributeVideo>,<telethon.tl.types.DocumentAttributeFilename>]

5. Document
- event.media.document.attributes = [<telethon.tl.types.DocumentAttributeFilename>]

6. Location
- event.media.geo

7. Contact
- event.media.vcard