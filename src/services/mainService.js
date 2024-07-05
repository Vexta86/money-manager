

const current_date = new Date();

export const fetchCome = async (fetchData, auth, month, year, setIsLoading) => {
    setIsLoading(true);
    try {
        const data = await fetchData(auth,  month, year );
        const orderedDocs = data.docs.sort((a, b) => b.date.localeCompare(a.date));

        const uniqueCategories = new Set(data.docs.map(i => i.category));
        const uniqueCategoryArray = Array.from(uniqueCategories);

        const totalPrice = data.docs.reduce((acc, item) => {
            return acc + item.price;
        }, 0)

        return ({
            month: month,
            year: year,
            docs: orderedDocs,
            categories: uniqueCategoryArray,
            total: totalPrice,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setIsLoading(false);
    }
}

export const fetchSeveral = async (auth, fetchData, initialDate, previousMonths) => {
    const promises = []





    if (previousMonths > 1){
        for( let i = 0; i <= previousMonths; i ++) {
            const date = new Date(initialDate)
            date.setMonth(date.getMonth() - i)

            const data = await fetchData(auth,   date.getMonth() + 1, date.getFullYear() );
            const totalPrice = data.docs.reduce((acc, item) => {
                return acc + item.price;
            }, 0)



            promises.push({
                month:`${date.getMonth() + 1} - ${date.getFullYear()}`,
                price: totalPrice
            })
        }
    }


    return promises
}