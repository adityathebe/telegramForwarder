## Command
```
/add <source> <destination>
```

## Function defintion
```js
/**
 * @param {String} sender Chat id of the owner
 * @param {String} source Username / Link of Source
 * @param {String} destination Username / Link of Destination
 */
addRedirection (sender, source, destination)
```

This function should be called only after making sure that there are 2 parameters passed to the `/add` command.

## Procedure

#### 1. Check Source and Destination Pattern

Bot the source and destination should be provided in one of the two formats:
- Username should start with `'@'`
- Invitaion Links should start with `'https://t.me/joinchat'` or `'t.me/joinchat'`

If the source or destination is not in the above format, `checkSourceEntity` will throw an error.

*Types of Response at this stage*

```js
// Response for username
{
  'username': 'adityathebe',
}

// Response for invitation link
{ 
  'hash': 'xyzjskdl123'
}
```

#### 2. Check Quota

Free users are limited to 10 redirections while premium users have no limitation for redirections.
If in case, the user is not stored in the db at this state and error will be thrown

#### 3. Get both the entities from the API
 
Need to make sure the entities are valid before we send a join request to them because
- Even if the agent is already in the entity, sending join request will result in an error
- Sending join request to invalid entity will result in an error 

```js
ForwardAgent.getEntity(entity)
```

Should return an object in case of success. In any other case, will return an error object

```js
// User Entity
{
  joined: Boolean,
  entity: {
    type: 'user',
    title: String,
    chatId: Number,
    accessHash: String,
    bot: Boolean,
  }
}

// Channel Entity
{
  joined: Boolean,
  entity: {
    type: 'channel',
    chatId: Number,
    title: String,
    accessHash: String,
    megagroup: Boolean,
    adminRights : Boolean,
  }
}

// Group Entity
{
  joined: Boolean,
  entity: {
    type: 'group',
    chatId: String,
    title: String,
    accessHash: String,
  }
}

// Unreachable Invitation link
{
  joinable: Boolean,
  entity: null
}
```

#### 4. Send Join Request

```js
// Private Entity
ForwardAgent.joinPrivateEntity(hash)

// Public Entity
ForwardAgent.joinPublicEntity(entity)
```

#### 5. Check for duplicate and circular redirection

```js
database.getRedirection(owner)
```

#### 6. Store to database

Store redirection

- src_title
- src_chat_id
- src_username
- dest_title
- dest_chat_id
- dest_username
- owner


## Helper Functions

#### 1. checkSourcePattern()

```js
/**
 * Verifies that the source/destination is in one of the two valid formats
 * -- If it's a public entity (username), it should start with "@"
 * -- If it's a private entity (invitation link), it should start with t.me/joinchat/<HASH>
 * @param {string} entity username or invitation link
 * @returns {Object}
 */
checkSourcePattern(entity)
```