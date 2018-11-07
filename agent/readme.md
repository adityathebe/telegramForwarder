# Getting Entity

Entity can be a username or an invitation link. Possible scenarios

#### 1. Invite Link :
  - [Error] The invite hash is invalid
  - [Error] Cannot get entity from a channel (or group) that you are not part of. Join the group and retry
  - [OK] Entity Detail Dictionary
#### 2. Username :
  - [Error] No user has <entityPayload> as username
  - [OK] Entity Detail Dictionary

# Joining a source / destination

### Posible Source / destination

- Bot
- Private
- Channel
  - [x] Public (username)
  - [x] Private (Invitation Link)
- Group
  - [x] Public (username)
  - [x] Private (Invitation Link)

### Required functions

- **ImportChatInviteRequest** : Join group / channel with invitation link
- **JoinChannelRequest** : Join group / channel with username


### Procedure

Example command
```
/add <source> <destination>
```

#### 1. Check the entity format. 
  - Usernames must start with '@"
  - Invitation links must start with 'https://t.me/joinchat' or 't.me/joinchat'
  - Should return a dictionary

*Example Response*

  ```python
  # Response for username
  {
    'username': 'adityathebe',
  }

  # Response for invitation link
  { 
    'hash': 'xyzjskdl123'
  }

  # If neither
  {
    'error': 'Invalid hash'
  }

  ```

#### 2. Get both the entities from the API
 
```python
client.get_entity(entity)
```

Need to make sure the entities are valid before we send a join request to them.

> **NOTE:** This check is important because a request to join an entity where the agent is already a participant of will result in an error < *telethon.errors.rpcerrorlist.UserAlreadyParticipantError* >.

#### 3. Send Join Request

```python
# Private Entity
client(ImportChatInviteRequest(hash))

# Public Entity
client(JoinChannelRequest(entity))
```

