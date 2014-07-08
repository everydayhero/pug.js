```javascript
var pug = new Pug(),
    Charity = pug.schema('charity');

Charity.find(1).then(function(charity) {
  charity.get('name'); // Foobar
  charity.set('name', 'Crikey');
  charity.id(); // 1
  charity.save().then(function(charity) {

  });
});

Charity.findAll().then(function(charities) {
  var objects = charities.map(function(charity) {
    return charity.getAll(); // {id: 1, name: 'Crikey'}
  });
});
```
