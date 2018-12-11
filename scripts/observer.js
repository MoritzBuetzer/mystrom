const request = require('request')
const events = require('events')
const config = require('config')

var api_url = 'https://mystrom.ch/mobile/device'
var ifttt_url = 'https://maker.ifttt.com/trigger/mystrom/with/key/'+config.get('ifttt.apiKey')
var eventEmitter = new events.EventEmitter()

var devices = config.get('devices');

eventEmitter.on('newStatus', function(status, device, mapping) {
  console.log(new Date().toString() +' ['+device.name+']: '+status+' @ '+device.energyReport.power+'W');

  request(ifttt_url, { 
    json: true,
    qs: {
      'value1': device.name,
      'value2': status,
      'value3': device.energyReport.power.toFixed(0)
    }
  }, (err, res, body) => {
    if (err) { return console.log(err); }
  });

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
        'authToken': config.get('mystrom.authToken'),
        'id': device.deviceid
      }
    }, (err, res, body) => {
      if (err) { return console.log(err); }
      device.mappings.forEach(function(mapping) {
        if( (Math.abs(body.device.energyReport.power - mapping.value) <= mapping.tolerance) && (lastStatus != mapping.status) ) {
          eventEmitter.emit('newStatus', mapping.status, body.device, device)
          lastStatus = mapping.status
        }
      })
    });
  }, config.get('interval'))
}