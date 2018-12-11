const request = require('request');
const events = require('events');

var api_url = 'https://mystrom.ch/mobile/device';
var auth_token = 'INSERT_HERE';
var interval = 1000;
var lastStatus = '';
var eventEmitter = new events.EventEmitter();

var device = {
  "title": "Switch",
  "deviceid": "XXXXXXXXXXXX",
  "mappings": [
    {
      "value": 0,
      "status": "standby",
      "tolerance": 0
    },
    {
      "value": 84,
      "status": "pump",
      "tolerance": 5
    },
    {
      "value": 2260,
      "status": "heating",
      "tolerance": 100
    },
    {
      "value": 20,
      "status": "finishing",
      "tolerance": 3
    }
  ]
}

eventEmitter.on('newStatus', function(status, device) {
  console.log(new Date().toString() +' ['+device.title+']: '+status);
});

const intervalObj = setInterval(() => {
  request(api_url, { 
    json: true,
    qs: {
      'authToken': auth_token,
      'id': device.deviceid
    }
  }, (err, res, body) => {
    if (err) { return console.log(err); }
    device.mappings.forEach(function(mapping) {
      if( (Math.abs(body.device.energyReport.power - mapping.value) <= mapping.tolerance) && (lastStatus != mapping.status) ) {
        eventEmitter.emit('newStatus', mapping.status, device);
        lastStatus = mapping.status;
      }
    })
  });
}, interval);