const request = require('request')
const events = require('events')
const config = require('config')

var api_url = 'https://mystrom.ch/mobile/device'
var eventEmitter = new events.EventEmitter()

var devices = config.get('devices');

eventEmitter.on('newStatus', function(status, device) {
  console.log(new Date().toString() +' ['+device.title+']: '+status);
});

devices.forEach(function(device){
  createInterval(device)
})

function createInterval(device)
{
  let lastStatus = ''
  setInterval(() => {
    request(api_url, { 
      json: true,
      qs: {
        'authToken': config.get('api.authToken'),
        'id': device.deviceid
      }
    }, (err, res, body) => {
      if (err) { return console.log(err); }
      device.mappings.forEach(function(mapping) {
        if( (Math.abs(body.device.energyReport.power - mapping.value) <= mapping.tolerance) && (lastStatus != mapping.status) ) {
          eventEmitter.emit('newStatus', mapping.status, device)
          lastStatus = mapping.status
        }
      })
    });
  }, config.get('interval'))
}