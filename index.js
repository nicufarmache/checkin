import express from 'express';
import translation from './translation.js';
const app = express()
const port = 3000

// const HOST = 'http://192.168.2.222'
const HOST = 'https://events.soulfeederweb.com/'

app.use(express.static('frontend'))
app.use(express.urlencoded())

app.post('/proxy', async (req, res) => {
  // console.log('DEBUG: POST:', req.body)
  const action = req.body.action;
  const apiKey = req.body?.data?.api_key || req.body?.api_key

  if (action === 'checkinera_check_credentials') {
    const response = await fetch(`${HOST}/tc-api/${apiKey}/check_credentials`)
    const resData = await response.json()
    console.log('DEBUG: resData:', resData)
    if (resData.pass) {
      res.send({ is_valid: true });
    } else {
      res.send({ wrong_url_or_key: true })
    }
    return;
  }

  if (action === 'checkinera_translation') {
    res.send(translation)
    return;
  }

  if (action === 'checkinera_event_essentials') {
    const response = await fetch(`${HOST}/tc-api/${apiKey}/event_essentials`)
    const resData = await response.json()
    console.log('DEBUG: resData:', resData)
    if (resData.pass) {
      res.send( resData );
    } else {
      res.send({ wrong_url_or_key: true })
    }
    return;
  }
  

  if (action === 'checkinera_tickets_info') {
    const count = req.body.tickets_per_page
    const page = req.body.page_num
    const response = await fetch(`${HOST}/tc-api/${apiKey}/tickets_info/${count}/${page}`)
    const resData = await response.json()
    // console.log('DEBUG: resData:', resData)
    res.send( resData );
    return;
  }

  if (action === 'checkinera_ticket_checkins') {
    const ticketcode = req.body?.data?.checksum
    const response = await fetch(`${HOST}/tc-api/${apiKey}/ticket_checkins/${ticketcode}`)
    const resData = await response.json()
    // console.log('DEBUG: resData:', resData)
    res.send( resData );
    return;
  }

  if (action === 'checkinera_check_in') {
    const ticketcode = req.body?.data?.checksum
    const response = await fetch(`${HOST}/tc-api/${apiKey}/check_in/${ticketcode}`)
    const resData = await response.text()
    // console.log('DEBUG: resData:', resData)
    res.send( resData );
    return;
  }

  res.send({ error: 'Not Implemented'})
})

app.get('*', function(req, res) {
  // console.log('DEBUG: catch: ', req)
});

app.post('*', function(req, res) {
  // console.log('DEBUG: catch: ', req)
});

app.listen(port, () => {
  // console.log(`API listening on port ${port}`)
})