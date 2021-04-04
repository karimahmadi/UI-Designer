/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('/log').then(
      res => {
        setData(res.data);
      },
      err => {
        console.log('err:', err);
      },
    );
  }, []);

  return (
    <div style={{ margin: '10px 10px' }}>
      {Object.keys(data).map(url => (
        <ul key={url}>
          <div>{url}</div>
          {data[url].map((msg, index) => (
            <li key={`${msg}-${index}`}>{msg}</li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export default App;
