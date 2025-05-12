import {useState, useEffect} from 'react';

export default function Cards(){
    const [emojis, setEmojis] = useState([]);
    const [clickedEmojis, setClickedEmojis] = useState([]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0)
    const [loading, setLoading] = useState(true);
    const [flipped, setFlipped] = useState(false);
    const [sound, setSound] = useState(true)

    const apiEmoji = 'https://emojihub.yurace.pro/api/all/category/animals-and-nature';

    useEffect(()=> {
        async function API(){
            try {
                const api = await fetch(apiEmoji)
                const data = await api.json();
                const sliced = data.slice(0, 144)
                
                newEmojis(sliced);
               FI
            } catch(error) {
                console.error("ERRO :", error);
            } finally {
                setLoading(false);
            }
        }
        API();
        console.log(emojis)
    },[])

    function playSound(){
        if(sound){
            const clickSound = new Audio('../audio/flippedCard.mp3');
			clickSound.volume = 0.5;
			clickSound.play();
        }
    }

    function newEmojis(emoji){
        const pool = [...emoji].sort(() => 0.5 - Math.random())
        setEmojis(pool.slice(0,6))
    }

    function handleClick(id){
        setFlipped(true)

        setTimeout(() => {
            playSound()
            setFlipped(false);
        }, 400);

        if(clickedEmojis.includes(id)){
            // loses
            setClickedEmojis([])
            setScore(0)
            setBestScore(prev => Math.max(prev, score))
            alert("Game Over!, same card clicked")
        } else {
            // Wins 
            setClickedEmojis(prev => [...prev, id])
            setScore(prev => prev + 1)
            newEmojis(emojis)
        }
    }

    return(
        <>
            <div className="infos">
                <span>
                    Score: <span className="score">{score}</span>
                </span>
                <span>
                    Best:<span className="bestScore">{bestScore}</span>
                </span>
            </div>
            {sound == true ? (
                <i className="bi bi-volume-up" onClick={() => setSound(false)}></i>
            ) : (
                <i className="bi bi-volume-mute"onClick={() => setSound(true)}></i>
            )}
            <div className="cards-memory">
                {loading && <div>Loading...</div>}

                {emojis.map((emoji)=>(
                    <div 
                    onClick={()=> handleClick(emoji.htmlCode[0])} className={`cards-emojis ${flipped ? "flipped" : ""}`}
                    alt={emoji.name}
                    key={emoji.htmlCode[0]}>
                        <div className="card-inner">
                            <div className="card-front">
                                <div className="card-pattern"></div>
                            </div>
                            <div className="card-back">
                                {String.fromCodePoint(parseInt(emoji.htmlCode[0].replace(/[&#;]/g, ''), 10))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}