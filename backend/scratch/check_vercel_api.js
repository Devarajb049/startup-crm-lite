import axios from 'axios';

async function check() {
  try {
    const res = await axios.get('https://aura-startup-crm-lite.vercel.app/api/health');
    console.log('STATUS:', res.status);
    console.log('DATA:', res.data);
  } catch (err) {
    console.error('ERROR:', err.message);
    if (err.response) {
      console.error('RESP STATUS:', err.response.status);
      console.error('RESP DATA:', err.response.data);
    }
  }
}

check();
