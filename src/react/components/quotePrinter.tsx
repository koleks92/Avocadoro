import "../../index.css";

import { useEffect, useState, useContext } from "react";
import { AvocadoroContext } from "../store/AvocadoroContext";
import { MdOutlineQuestionAnswer } from "react-icons/md";

type Quote = {
    quote: string;
    author: string;
};

function QuotePrinter() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [currentQuote, setCurrentQuote] = useState<Quote>();

    const { supabase } = useContext(AvocadoroContext);

    useEffect(() => {
        async function loadQuotes() {
            const { data, error } = await supabase.from("quotes").select(`
                    quote,
                    author
                    `);

            if (data) {
                setQuotes(data);
                selectRandomQuote(data);
            }
            if (error) {
                console.log(error);
            }
        }

        loadQuotes();
    }, []);

    useEffect(() => {
        if (quotes.length === 0) return;

        const FIVE_MINUTES_MS = 5 * 60 * 1000;

        const intervalId = setInterval(() => {
            selectRandomQuote(quotes);
        }, FIVE_MINUTES_MS);

        return () => clearInterval(intervalId);
    }, [quotes]);

    function selectRandomQuote(quotes: Quote[]) {
        if (quotes.length === 0) return;

        const randomIndex = Math.floor(Math.random() * quotes.length);

        console.log(quotes[randomIndex]);

        setCurrentQuote(quotes[randomIndex]);
    }

    if (currentQuote) {
        return (
            <div className="quote_printer_root">
                <span className="quote_printer_quote">{currentQuote.quote}</span>
                <span className="quote_printer_author">{currentQuote.author}</span>
            </div>
        );
    } else {
        return (
            <div className="quote_printer_root"></div>
        )
    }
}

export default QuotePrinter;
