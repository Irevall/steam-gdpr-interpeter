// Go to: https://steamcommunity.com/my/gcpd/570/?category=Account&tab=MatchPlayerReportIncoming
// And copy code below into console (Ctrl + Shift + J)

let interval = setInterval(clickButton, 100);

function clickButton() {
    let button = document.querySelector('.load_more_history_area').querySelector('a');
    if (document.querySelector('#inventory_history_loading').style.display !== 'none') {
        return false;
    }

    if (button.querySelector('div').style.display === 'none') {
        clearInterval(interval);
        countReceived();
        return false;
    }
    button.click();
}

function countReceived() {
    const matchHistory = [];

    const table = document.querySelector('.generic_kv_table');
    const records = table.querySelectorAll('tr');

    let reportCount = 0;
    let commendCount = 0;

    records.forEach((element, index) => {
        if (index !== 0) {
            const data = element.querySelectorAll('td');
            const ID = data[0].innerHTML;
            const reported = (data[2].innerHTML === 'Yes' || data[3].innerHTML === 'Yes' || data[4].innerHTML === 'Yes');
            const commended = (data[5].innerHTML === 'Yes' || data[6].innerHTML === 'Yes' || data[7].innerHTML === 'Yes' || data[8].innerHTML === 'Yes');

            reportCount += reported;
            commendCount += commended;

            if (matchHistory.length > 0) {
                if (matchHistory[matchHistory.length - 1].gameID === data[0].innerHTML) {
                    matchHistory[matchHistory.length - 1].reportsReceived += reported;
                    matchHistory[matchHistory.length - 1].commendsReceived += commended;
                    return false;
                }
            }
            matchHistory.push({gameID: ID, reportsReceived: reported, commendsReceived: commended});
        }
    });

    const sortedByReports = matchHistory.filter(element => element.reportsReceived > 0).sort(function(a, b) {return b.reportsReceived - a.reportsReceived});
    const sortedByCommends = matchHistory.filter(element => element.commendsReceived > 0).sort(function(a, b) {return b.commendsReceived - a.commendsReceived});
    console.log('You\'ve been reported in ' + sortedByReports.reduce((acc, value) => {return acc + value.reportsReceived}, 0) + ' (' + sortedByReports.length + ' unique) games and commended in ' + sortedByCommends.reduce((acc, value) => {return acc + value.commendsReceived}, 0) + ' (' + sortedByCommends.length + ' unique) games');

    if (sortedByReports.length > 0) {
        const gamesMostReports = sortedByReports.filter(element => element.reportsReceived === sortedByReports[0].reportsReceived);
        console.log('The most reports you\'ve got was ' + sortedByReports[0].reportsReceived + ' (happened in ' + gamesMostReports.length + ' game' + (gamesMostReports.length > 1 ? 's)' : ')'));
        if (confirm('Do you want to list those games?')) {
            gamesMostReports.forEach((element) => {
                console.log('https://www.opendota.com/matches/' + element.gameID);
            })
        }
    }

    if (sortedByReports.length > 0) {
        const gamesMostCommends = sortedByCommends.filter(element => element.commendsReceived === sortedByCommends[0].commendsReceived);
        console.log('The most commends you\'ve got was ' + sortedByCommends[0].commendsReceived + ' (happened in ' + gamesMostCommends.length + ' game' + (gamesMostCommends.length > 1 ? 's)' : ')'));
        if (confirm('Do you want to list those games?')) {
            gamesMostCommends.forEach((element) => {
                console.log('https://www.opendota.com/matches/' + element.gameID);
            })
        }
    }
}