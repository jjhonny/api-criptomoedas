import { useEffect, useState } from 'react';
import styles from './detail.module.css'
import { useParams, useNavigate } from 'react-router-dom'

interface CoinProp {
    symbol: string;
    name: string;
    price: string;
    market_cap: string;
    low_24h: string;
    high_24h: string;
    total_volume_24h: string;
    delta_24h: string;
    formatedPrice: string;
    formatedMarket: string;
    formatedLowprice: string;
    formatedHighprice: string;
    error?: string;
}

export function Detail() {
    const { cripto } = useParams();
    const [detail, setDetail] = useState<CoinProp>({
        symbol: '',
        name: '',
        price: '',
        market_cap: '',
        low_24h: '',
        high_24h: '',
        total_volume_24h: '',
        delta_24h: '',
        formatedPrice: '',
        formatedMarket: '',
        formatedLowprice: '',
        formatedHighprice: '',
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        function getData() {
            fetch(`https://sujeitoprogramador.com/api-cripto/coin/?key=b4cd8f8fb3de94c6&pref=BRL&symbol=${cripto}`)
            .then(response => response.json())
            .then((data: CoinProp) => {

                if(data.error) {
                    navigate("/")
                }

                let price = Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })

                const resultData = {
                    ...data,
                    formatedPrice: price.format(Number(data.price)),
                    formatedMarket: price.format(Number(data.market_cap)),
                    formatedLowprice: price.format(Number(data.low_24h)),
                    formatedHighprice: price.format(Number(data.high_24h))
                }

                setDetail(resultData);
                setLoading(false);
                console.log(resultData)

            })
        }

        getData()
    }, [cripto])

    if (loading) {
        return (
            <div className={styles.container}>
                <h4 className={styles.center}>Carregando informações...</h4>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.center}>{detail?.name}</h1>
            <p className={styles.center}>{detail?.symbol}</p>

            <section className={styles.content}>
                <p>
                    <strong>Preço: </strong> {detail?.formatedPrice}
                </p>
                <p>
                    <strong>Maior preço 24h: </strong> {detail?.formatedHighprice}
                </p>
                <p>
                    <strong>Menor preço 24h: </strong> {detail?.formatedLowprice}
                </p>
                <p>
                    <strong>Delta 24h: </strong>
                    <span className={parseFloat(detail?.delta_24h.replace(',', '.')) >= 0 ? styles.profit : styles.loss}>{detail?.delta_24h}</span>
                </p>
                <p>
                    <strong>Valor mercado: </strong> {detail?.formatedMarket}
                </p>
            </section>
        </div>
    )
}