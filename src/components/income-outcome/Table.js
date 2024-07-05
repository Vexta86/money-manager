import {formatMoney, monthToFormat} from "../../util";
import React, { useState} from "react";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import EditModule from "../../pages/edit";
import Box from "@mui/material/Box";
import {Divider, List, ListItem, ListItemButton, ListItemText, Typography, useTheme} from "@mui/material";

const TableRow  = ({elements, id, auth, type, language, categories, bg, doc, refresh})=> {
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const changeOpen = (value) =>{

        setOpen(value)
    }

    const insideElement = (element, index) =>{
        return(
            <Box key={index} flex={1} >
                <Typography color={bg ? 'primary.light' : null} variant={bg ? 'h6' : 'body1'} >
                    {element}
                </Typography>
            </Box>
        )
    }

    return(
        <>
            <ListItem
                id={id}
                display={"flex"}


                sx={{
                    bgcolor: bg ? theme.palette.primary.main : null,
                }}
            >

                {bg ? elements.map(insideElement) :
                    <>
                        <ListItemButton alignContent={'center'}   onClick={()=> changeOpen(true)} >
                            {elements.map(insideElement)}
                        </ListItemButton>
                        <EditModule open={open} type={type}
                                    language={language}
                                    categories={categories}
                                    auth={auth}
                                    doc={doc}
                                    elementID={id}
                                    changeOpen={changeOpen}
                                    fetchCome={refresh}

                        />
                    </>

                }





            </ListItem>
            <Divider/>
        </>


    )
}



const Table = ({   auth,language,selectedCategory,headers,docs,type,categories,refresh})=>{
    const {t} = useTranslation();
    function TableHeader() {
        return(<TableRow elements={headers} bg={true}/>)
    }

    function TotalRow() {
        let array = ['Total']
        if(type?.includes('frequent')){
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
        return(<TableRow elements={array} bg={true}/>)
    }

    return (
        <Box className="tableContainer">
            <List className="table">
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
                                         doc={item}
                                         refresh={refresh}
                        />
                    } else {
                        return null
                    }

                }) : null}

                <TotalRow/>


            </List>
        </Box>
    )
}

export default Table;