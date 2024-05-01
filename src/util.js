


const localhost = 'https://money-manager-api-c0fg.onrender.com';


function monthToFormat(givenMonth, language){





    let output = [];



    if(givenMonth - Math.floor(givenMonth)){
        const days = Math.round((givenMonth*29.6))

        if (days % 7 === 0){
            const weeks = days / 7;
            output.push(weeks);
            weeks > 1 ? output.push('weeks') : output.push('week');

        } else {
            output.push(days);
            days > 1 ? output.push('days') : output.push('day');
        }


    } else {

        if(givenMonth % 12 === 0){
            const years = givenMonth/12;
            output.push(years);
            years > 1 ? output.push('years') : output.push('year');
        } else{
            output.push(givenMonth);
            givenMonth > 1 ? output.push('months') : output.push('month');
        }

    }




    return output
}

function daysToMonths(days){
    return Math.round((days/29.6) * 100) / 100;
}

function weeksToMonths(week){
    return daysToMonths(week*7);
}

function yearsToMonths(years){
    return years*12;
}


function parseToDate(dateString, language){


       const array = dateString.split('-');
        const lang = language + '-US'

       if (array.length === 2){
           // receives month-year 04-2024
           // Split the string into month and year parts
           // Convert month string to month number (assuming format 'MM')
           const monthNum = parseInt(array[0], 10);

           // Create a Date object with the parsed month number and year
           const date = new Date(array[1], monthNum - 1); // Subtract 1 from month number because months are zero-based in JavaScript
           // Format the date to display the month name and year
           const formattedDate = date.toLocaleString(lang, { month: 'long', year: 'numeric' });

           return formattedDate;
       } else {
           // receive day-month-year 11-04-2024
           // Convert month string to month number (assuming format 'MM')

           const dayNum = parseInt(array[0], 10)

           const monthNum = parseInt(array[1], 10);

           // Create a Date object with the parsed month number and year
           const date = new Date(array[2], monthNum - 1, dayNum); // Subtract 1 from month number because months are zero-based in JavaScript

           // Format the date to display the month name and year
           const formattedDate = date.toLocaleString(lang, {day: 'numeric', month: 'long', year: 'numeric' });

           return formattedDate;

       }
    

}

function formatMoney(stringNumber) {
    // Convert the string to a number
    const number = parseFloat(stringNumber);

    // Check if the number is valid
    if (isNaN(number)) {
        return 'Invalid number';
    }

    // Convert the number to money format
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}

// Recibe [category, date, name, price]


export {formatMoney, parseToDate, localhost, daysToMonths, weeksToMonths, yearsToMonths, monthToFormat};