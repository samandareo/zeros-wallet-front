import { useEffect, useState } from 'react';
import axios from 'axios';

function BNBPrice() {
  const [price, setPrice] = useState(null);
  const [oneUSD, setOneUSD] = useState(null);

  useEffect(() => {
    async function fetchBNBPrice() {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
        );
        setPrice(response.data.binancecoin.usd);
        setOneUSD((1 / response.data.binancecoin.usd).toFixed(4));

      } catch (error) {
        console.error('Error fetching BNB price:', error);
      }
    }

    fetchBNBPrice();

    const interval = setInterval(fetchBNBPrice, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <span>
      {price !== null ? <p style={{marginBottom: 0}}>{oneUSD}</p> : <p style={{marginBottom: 0}}>Loading...</p>}
    </span>
  );
}

export default BNBPrice;
