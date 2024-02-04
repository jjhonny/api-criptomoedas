import { FormEvent, useEffect, useState } from 'react'
import styles from './home.module.css'
import { BiSearch } from "react-icons/bi"
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../../components/header';

// https://sujeitoprogramador.com/api-cripto/?key=67f9141787211428

interface CoinProps {
    name: string;
    delta_24h: string;
    price: string;
    volume_24h: string;
    market_cap: string;
    formatedPrice: string;
    formartedMarket: string;
    symbol: string;
}

interface DataProps {
    coins: CoinProps[];
}


export function Home() {
    const [coins, setCoins] = useState<CoinProps[]>([])
    const [inputValue, setInputValue] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        function getData() {
          fetch('https://sujeitoprogramador.com/api-cripto/?key=b4cd8f8fb3de94c6&pref=BRL')
          .then(response => response.json()) 
          .then((data: DataProps) => {
            let coinsData = data.coins.slice(0, 15);

            let price = Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
            })

            const formatResult = coinsData.map((item) => {
                const formated = {
                   ...item,
                   formatedPrice: price.format(Number(item.price)),
                   formartedMarket: price.format(Number(item.market_cap))
                }
                
                console.log(coinsData)
                return formated;
            })


            
            setCoins(formatResult);
          }) 
          .catch((error) => {
            console.log(error);
          })
        }
        
        getData()
    }, [])

    function handleSearch(event: FormEvent) {
        event.preventDefault();

        if (inputValue === "") return;

        navigate(`/detail/${inputValue}`)
    }


    return (
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleSearch}>
                <input 
                  type="text"
                  placeholder='Digite o símbolo da moeda: BTC...'
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                />
                <button type='submit'>
                    <BiSearch size={30} color="white" />
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th scope='col'>Moeda</th>
                        <th scope='col'>Valor mercado</th>
                        <th scope='col'>Preço</th>
                        <th scope='col'>Volume</th>
                    </tr>
                </thead>
                <tbody id='tbody'>
                    {coins.map(coin => (
                        <tr key={coin.name} className={styles.tr}>
                            <td className={styles.tdLabel} data-label="Moeda">
                                <Link className={styles.link} to={`/detail/${coin.symbol}`}>
                                    <span>{coin.name}</span> | {coin.symbol} 
                                </Link>
                            </td>
                            <td className={styles.tdLabel} data-label="Mercado">
                                {coin.formartedMarket}
                            </td>
                            <td className={styles.tdLabel} data-label="Preço">
                                {coin.formatedPrice}
                            </td>
                            <td className={parseFloat(coin?.delta_24h.replace(',', '.')) >= 0 ? styles.tdProfit : styles.tdLoss} data-label="Volume">
                                <span>{coin.delta_24h}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    ) 
}