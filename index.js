console.time();
const fs = require('fs');
const qs = require('qs');
const axios = require('axios').default;

let url = process.env.API_URL;

let status = require('./status.json');

console.log(status);

if(status.init){
  delete status.init;
  fs.rmdirSync("docs",{recursive:true});
}
fs.mkdirSync('docs', { recursive: true });

status.apiKey = process.env.API_KEY;

axios.post(url, qs.stringify(status)).then(({ data }) => {
  console.log(data.data.length);
  if (data.err) {
    console.error(data.msg);
  } else {
    let keys = data.data[0];
    data.data.forEach((qArr, i) => {
      if (i) {
        let qJson = {};
        qArr.forEach((a, j) => (qJson[keys[j]] = a));
        delete qJson.source;
        fs.writeFileSync(
          'docs/' + qJson.id + '.json',
          JSON.stringify(qJson, null, 2)
        );
        status.startDate = qJson.updated_at;
        status.startId = qJson.id;
      }
    });
    fs.writeFileSync('status.json',JSON.stringify(status,null,4));
  }
  console.timeEnd();
});
