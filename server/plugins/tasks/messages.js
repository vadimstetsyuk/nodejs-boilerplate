import winston from 'winston';

const ftp = require('ftp-get');
const csv = require('csvtojson');
const unzip = require('unzip');
const fs = require('fs');

export default {
  'db.messages.insert': afterMessageSent
};

function afterMessageSent(service, { name, options }, cb) {
  downloadFileOverFtp('ftp://ftp_10670_3:JJJJHGf564GRSXTF3454545@c_data.biz24.online/XXX.zip');
  cb();
}

/**
 * url - url to remote fpt server for download file
*/
function downloadFileOverFtp(url) {
  ftp.get(url, 'files/XXX.zip', (err, linkToFile) => {
    // unpack zip
    fs.createReadStream(linkToFile).pipe(unzip.extract({ path: 'files' }));

    // parse csv file to json (prepare to save to db)
    csvToJson('files/data.csv');
  });
}

/**
 * link - url to downloaded file at filesystem
*/
function csvToJson(link) {
  const arr = [];
  csv()
    .fromFile(link)
    .on('json', (jsonRow) => {
      arr.push(jsonRow);
    })
    .on('done', (err) => {
      winston.log('end' || err);
    });
  return arr;
}
