import { Configuration, OpenAIApi } from 'openai';
const translate = (value, language, callBack) => {
  const _configuration = new Configuration({
    apiKey: process.env.APIKEY,
    organization: process.env.ORGANIZATION,
  });
  delete _configuration.baseOptions.headers['User-Agent'];

  const openai = new OpenAIApi(_configuration);
  openai
    .createCompletion({
      model: 'text-davinci-003',
      prompt: `Translate this into ${language}:\n\n${value}\n\n`,
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    })
    .then((res) => {
      if (res.status === 200) {
        callBack && callBack(res.data?.choices[0]?.text);
      }
    });
};
export { translate };
