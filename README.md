```javascript
var pug = new Pug(),
    Charity = pug.resource('charity', {
      attributes: {
        name: 'string',
        createdAt: 'date',
        active: 'boolean',
        campaigns: 'hasMany'
      },
      validations: {
        name: {
          presence: true,
          length: {max: 30}
        }
      },


      attributes: {
        name: {
          type: 'string',
          presence: true,
          length: {max: 30}
        }
      }
    });

Charity.find(1).then(function(charity) {
  charity.get('name');
  charity.save().then(function() {

  });
});

Charity.save({name: 'foo'}).then()
```
