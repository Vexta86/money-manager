import {formatMoney, monthToFormat} from "../util";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";

const TableRow  = ({elements, id, auth, type, language, categories})=> {

    const navigate = useNavigate()
    const editFunction = ()=>{
        if (auth){
            navigate('/money-manager/edit', { state: {
                    categories: categories,
                    auth: auth,
                    language: language,
                    id: id,
                    type: type }});
        }
    }

    let rowClass = 'tableRow';

    if (!id){
        rowClass='tableHeader'
    } else if(id.includes('space')){
        rowClass='space'
    }

    return(
        <div id={id} className={rowClass} onClick={editFunction}>



            {elements.map((element, index) => (
                <div key={index} className="cell">
                    <p className="pTable">{element}</p>
                </div>
            ))}



        </div>)
}



const Table = ({   auth: auth,
                   language:language,
                   selectedCategory: selectedCategory,
                   headers: headers,
                   docs: docs,
                   type:type,
                   categories: categories,
               })=>{
    const {t} = useTranslation();
    function TableHeader() {
        return(<TableRow elements={headers}/>)
    }

    function TotalRow() {
        let array = ['Total']
        if(type.includes('frequent')){
            array.push('')
            let total = docs ? formatMoney(docs.reduce((acc, item) => {
                    if (selectedCategory !== '' && selectedCategory === item.category) {
                        return acc + item.price / item.frequency;
                    } else if (selectedCategory === '') {
                        return acc + item.price / item.frequency;
                    } else {
                        return acc; //
                    }
                }
                , 0)) : null
            array.push(total);

        } else{

            let total = docs ? formatMoney(docs.reduce((acc, item) => {
                    if (selectedCategory !== '' && selectedCategory === item.category) {
                        return acc + item.price;
                    } else if (selectedCategory === '') {
                        return acc + item.price;
                    } else {
                        return acc; //
                    }
                }
                , 0)) : null
            array.push(total);

        }
        return(<TableRow elements={array}/>)
    }

    return (
        <div className="tableContainer">
            <div className="table">
                <TableHeader/>

                {docs ? docs.map((item) => {
                    let array = [];
                    if(item.date){
                        array.push(dayjs(item.date).date())
                    }

                    if(item.name){
                        array.push(item.name)
                    }
                    if(item.frequency){
                        let freq = monthToFormat(item.frequency)
                        let freqPrice = formatMoney(item.price);

                        if(freq[0] === 1 && freq[1].includes('Month')){
                            array.push('')
                            array.push(`${formatMoney(item.price/item.frequency)}`)
                        }else   {
                            array.push(`${freqPrice} ${t('every')} ${freq[0] > 1 ? freq[0] : ''} ${t(freq[1])}`)
                            array.push(`${formatMoney(item.price/item.frequency)}`)
                        }



                    } else  {
                        if (item.price){
                            array.push(formatMoney(item.price))
                        }
                        if (item.category){
                            array.push(item.category)
                        }
                    }


                    if (selectedCategory === '' || item.category === selectedCategory) {

                        return <TableRow elements={array}
                                         id={item._id}
                                         key={item._id}
                                         auth={auth}
                                         type={type}
                                         language={language}
                                         categories={categories}
                        />
                    } else {
                        return null
                    }

                }) : null}

                <TotalRow/>


            </div>
        </div>
    )
}

export default Table;