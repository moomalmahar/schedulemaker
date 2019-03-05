let pages = []; //convert JSON from PDF contains array of element called pages that represent JSON version of FH Kiel class time table
let timetable = []; //stores refined timetable ready to be inserted in DB


function convertPDF2JSON(objdata) {

    pages = objdata.formImage.Pages;
    for (let p = 0; p < pages.length; p++) { // iterates each page

        let lines = removeDuplicates(pages[p].VLines); //pdf2Json does not represent PDF line as it is, so remove duplicate lines
        let daysInWeek = getNumberOfWeekDays(lines);    //finds number of days by detecting vertical lines with estimated length
        let dayCounter = 0; //store that how many days of week a single calendar page holds
        let lineHeight; //height of line in a single day in calendar page
        let lineDistance; // distance between vertical lines
        let exactLineDistance; //
        let xStartPosition = lines[0].x; // first occurance of a verticle line in the page

        //loop to detect vertical line height and distance in single day of a page
        for (let i = 50; i < 100; i++) {
            if (lines[i].l > 4) { // normally a line height should be greater than 4 to be considered a day
                lineHeight = lines[i].l;
                lineDistance = ((lines[i + 1].x + 0.1 - lines[i].x).toFixed(2)); // distance between two adjecent vertical line and adds 0.1 to be compared with other lines
                exactLineDistance = (lines[i + 1].x - lines[i].x);
                break;
            }

        }

        //detect where vertical lines has gap greater than lineDistance variable, the gap will represent a class

        for (let w = 0; w < lines.length - 1; w++) {

            if ((lines[w].x - lines[w + 1].x) > 40)
                dayCounter++;


            if (!(lines[w].x == xStartPosition)) { //the first vertical line belongs to days name such as Mo, Di, and Mi
                let classLineIntervels = lines[w + 1].x - lines[w].x;
                if (classLineIntervels <= lineDistance) {
                } else { //find distance of current line against next line in loop and compare with standard distance
                    let durationInMinutes = ( classLineIntervels / exactLineDistance * 15);
                    let startTime = 0, endTime = 0;
                    if ((lines[w].x - lines[1].x) > 0.3) {
                        startTime = ( ( ((lines[w].x - lines[1].x) / exactLineDistance) * 15 ) + (8.25 * 60));

                    }
                    else {
                        startTime = (8.25 * 60);
                    }
                    //console.log("start: " + Number(startTime/60) + " : endTime: " + Number( (durationInMinutes + startTime)) + ":" + ((startTime + endTime) % 60) );
                    let tempDate = new Date(null); tempDate.setMinutes(Math.round(startTime));
                    startTime = tempDate.toISOString().substr(11,8);

                    tempDate.setMinutes(Math.round(durationInMinutes));
                    endTime = tempDate.toISOString().substr(11,8);


                    for (let s = 0, t = getCalWeeks(pages[p].Texts); s < t.length; s++) {
                        let date = getDateOfISOWeek(Number(t[s]), getYear(pages[p].Texts));
                        let classDetail = getClassDetails(pages[p].Texts, lines[w].x, Number(lines[w].x + classLineIntervels), lines[w].y, Number(lines[w].y + lineHeight));




                        date.setDate(date.getDate() + dayCounter);
                        date = date.toJSON().slice(0, 10);
                        //console.log(date+"."+startTime +"-" + endTime);
                        //console.log(getCalWeeks(pages[p].Texts)[n]);
                        timetable.push({
                            "start": date+"T"+startTime,
                            "end": date+"T"+endTime,
                            "title": classDetail[0].trim(),
                            "detail": classDetail[1].trim()
                        });
                    }


                }
            }
        }

    }
    //fs.writeFile("../Schedules/" +objdata.formImage.Agency + "json", JSON.stringify(timetable, null, 2), 'utf-8');
    return timetable;
}

function compare(a, b) {
    if (a.y < b.y)
        return -1;
    if (a.y > b.y)
        return 1;
    if (a.x < b.x)
        return -1;
    if (a.x > b.x)
        return 1;
    return 0;
}

// "pdf2json" Github project parses somelines twice or three times, there for removeDuplicates method is used to delete duplicate lines
function removeDuplicates(vLines) { //receives Vlines
    let arrResult = [];
    let nonDuplicatedArray = [];
    for ( i = 0, n = vLines.length; i < n; i++) {
        let item = vLines[i];
        arrResult[item.x + " - " + item.y] = item; // create associative array
    }

    let j = 0;
    for (let item in arrResult) {

        nonDuplicatedArray[j++] = arrResult[item]; // copy the objects that are now unique
    }
    for(let i = nonDuplicatedArray.length -1;i>=0;i--){
        if(nonDuplicatedArray[i].l < 2){
            nonDuplicatedArray.splice(i,1);
        }
    }

    return nonDuplicatedArray.sort(compare);
}


//console.log(unescape(objdata.formImage.Pages[0].Texts));
// in every page of calendar there is a week number written, the getCalWeeks methods finds that number and convert than in date
function getCalWeeks(txt){
    let weeks = [];
    let extTxt;
    let rawWeeksTxt;

    for(let i=0, n= txt.length; i< n-1;i++){
        if((txt[i].y > 1) && (txt[i].y < 2)){
            if(txt[i].R[0].T != null)
                extTxt += txt[i].R[0].T;
        }
    }
    extTxt = unescape(extTxt);
    rawWeeksTxt = extTxt.substr(extTxt.indexOf("Kalenderwoche:")+14,extTxt.indexOf("Datum:") -
        (extTxt.indexOf("Kalenderwoche:")+14));


    for( let i = 0,  temp = rawWeeksTxt.split(",");i < temp.length; i++){ // if there are multiple weeks in single page
        if(temp[i].indexOf("-") != -1) {
            let temp2 = temp[i].split("-");
            let from = temp2[0].trim();
            let to = temp2[1].trim();



            for (let j = 0; j <=(to - from); j++) {
                weeks.push(Number(from) + j);
            }

        }
        else
        {
            weeks.push(temp[i].trim());
        }
    }

    return weeks;
}

// once a class is found on calendar page the getClassDetails method utilizes x,y positions and reads the text
function getClassDetails(txt, x1, x2, y1, y2){
    let extTxt;

    let classDetail = ["",""];

    for(let i=0, n= txt.length; i< n;i++){
        if(( Number(txt[i].y + 0.2) >= y1) && (Number(txt[i].y +0.128) <= y2) && (txt[i].x >= x1) && ( txt[i].x <= x2)){

            if( Number(txt[i].R[0].T) != 0) {
                if(txt[i].R[0].TS[2] == 1){
                    classDetail[0] += txt[i].R[0].T + " ";

                }
                else{ classDetail[1] += txt[i].R[0].T + " ";}
            }

            classDetail[0] =  unescape(classDetail[0].replace(/%C3%9C/g, 'Ü'));
            classDetail[1] = unescape(classDetail[1].replace(/%C3%B6/g,'ö'));
        }

    }


    return classDetail;

}

// the calendar pages contains either 5,6, or 7 days of week, thus getNumberOfWeeksDays finds number of days in a week
function getNumberOfWeekDays(lines) {


    let days = 1;

    for (let k = 0; k < lines.length - 2; k++) {
        if (lines[k].y > 3.3) {//checks if lines relates to day row and does goes to null in vlines
            if (lines[k].y < lines[k + 1].y) {
                days++;
            }
        }
    }
    return days;
}

//receives w as weeks number and y as year and returns starting date of the week
function getDateOfISOWeek(w, y) {

    let simple = new Date(y, 0, 1 + (w - 1) * 7);
    let dow = simple.getDay();
    let ISOWeekStart = simple;
    if (dow <= 4)
        ISOWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOWeekStart.setDate(simple.getDate() + 8 - simple.getDay());
    ISOWeekStart.setHours(-(ISOWeekStart.getTimezoneOffset() / 60));

    return ISOWeekStart;
} // thanks to Jordan Trudgatt

//this method looks into calendar page and finds which year the calendar page belongs to
function getYear(txt){
    let extTxt;
    let result=0;
    for(let i=0, n= txt.length; i< n-1;i++){
        if((txt[i].y > 1) && (txt[i].y < 2)){
            if(txt[i].R[0].T != null)
                extTxt += txt[i].R[0].T;
        }
    }
    extTxt = unescape(extTxt).trim();
    let rawWeeksTxt = extTxt.substr(extTxt.indexOf("bis:")-1,2);

    result = "20" + rawWeeksTxt.trim();
    return result;
}

/* GET home page. */


module.exports = convertPDF2JSON;