console.time();
const fs = require('fs');
const qs = require('qs');
const axios = require('axios').default;
const uuid = require('uuid').v5;
const ns = '0e155592-4a00-4649-9d9d-7430cffa5b26';

fs.mkdirSync('docs', { recursive: true });

let url =
  'https://script.google.com/macros/s/AKfycby8whGlU37C1SbU8kYzMETXwJ8xTf3eMBZG2ZP4iKm30D4ZORkEeSt25A/exec';

let q = {
  apiKey: '0c11f41678804d04b3054baadecf473d',
  after: '2017-01-01T00:00:00.000Z',
  limit: 1000,
};

axios.post(url, qs.stringify(q)).then(({ data }) => {
  console.log(data.data.length);
  if (data.err) {
    console.error(data.msg);
  } else {
    let keys = data.data[0];
    data.data.forEach((qArr, i) => {
      if (i) {
        let qJson = {};
        qArr.forEach((a, j) => (qJson[keys[j]] = a));
        qJson.id = uuid(qJson.id, ns);
        fs.writeFileSync(
          'docs/' + qJson.id + '.json',
          JSON.stringify(qJson, null, 2)
        );
      }
    });
  }
  console.timeEnd();
});
