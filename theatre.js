let statement = {
    totalAmount: 0,
    volumeCredits: 0,
    result: "",
    format: new Intl.NumberFormat("ru-RU",
        {
            style: "currency", currency: "RUB",
            minimumFractionDigits: 2
        }).format,

    getPerfomanceAmount(audience, type) {
        let perfAmount = 0;
        switch (type) {
            case "tragedy":
                perfAmount = 40000;
                if (audience > 30) {
                    perfAmount += 1000 * (audience - 30);
                }
                break;
            case "comedy":
                perfAmount = 30000;
                if (audience > 20) {
                    perfAmount += 10000 + 500 * (audience - 20);
                }
                perfAmount += 300 * audience;
                break;
            default:
                throw new Error(`неизвестный тип: ${type}`);
        }
        this.totalAmount += perfAmount;
        return perfAmount;
    },

    getVoulmeCredits(audience, type) {
        let perfCredits = Math.max(audience - 30, 0);
        // Дополнительный бонус за каждые 10 комедий
        if (type === "comedy") perfCredits += Math.floor(audience / 5);
        this.volumeCredits += perfCredits
        return perfCredits;
    },

    getPerfomanceInfo(playId, amount, audience, credits) {
        let result = `${playId}: ${this.format(amount / 100)}`;
        result += `(${audience} мест)\n`;
        result += `Вы заработали ${credits} бонусов\n`;
        return result;
    },

    getBill(invoice) {
        this.result +=  `Счет для ${invoice.customer}\n`;
        for (let perf of invoice.performance) {
            let credits = this.getVoulmeCredits(perf.audience, perf.type);
            let amount = this.getPerfomanceAmount(perf.audience, perf.type);
            this.result += this.getPerfomanceInfo(perf.playId, amount, perf.audience, credits);
        }
        this.result += `Итого с вас ${this.format(this.totalAmount/100)}\n`;
        this.result += `Суммарно вы заработали ${this.volumeCredits} бонусов\n`;
        return this.result;
    }
};
