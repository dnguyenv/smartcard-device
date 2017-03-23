var watson = require('watson-developer-cloud');
var config = require("../config.js")
var devicConfig = require("./device.json");
var exec = require('child_process').exec;
var fs = require('fs');
var text_to_speak = "This is a test";
var iotf = require("ibmiotf");

var text_to_speech = watson.text_to_speech({
    username: config.TTSUsername,
    password: config.TTSPassword,
    version: 'v1'
});

var params = {
    text: text_to_speak,
    voice: config.voice,
    accept: 'audio/wav'
};

var deviceClient = new iotf.IotfDevice(devicConfig);

//setting the log level to trace. By default its 'warn'
deviceClient.log.setLevel('debug');

deviceClient.connect();

deviceClient.on('connect', function(){
    console.log("connected");
});

deviceClient.on('reconnect', function(){

	console.log("Reconnected!!!");
});

deviceClient.on('disconnect', function(){
  console.log('Disconnected from IoTF');
});

deviceClient.on('error', function (argument) {
	console.log(argument);
});

tempStream = text_to_speech.synthesize(params).pipe(fs.createWriteStream('output.wav')).on('close', function() {
    var create_audio = exec('aplay output.wav', function(error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
});
