{
    "files": [{
        "id": "3cb827db-01a9-439b-9618-669105b1338b",
        "name": "getValue",
        "type": "server_js",
        "source": "function getValue(x, y, blad) {\n    var data \u003d blad.getDataRange().getValues();\n\n    if (blad.getDataRange().getNumRows() \u003c x + 1) {\n        return undefined;\n    } else {\n        return data[x][y];\n    }\n}\n"
    }, {
        "id": "8b1502f9-939d-4db5-8388-2aa41a0c23a8",
        "name": "getWebpage",
        "type": "server_js",
        "source": "function getWebpage(pagina) {\n    var HTML \u003d UrlFetchApp.fetch(pagina).getContentText();\n    return HTML;\n}\n"
    }, {
        "id": "c89b4b6f-485f-46b8-a0a3-36f8abc86d6b",
        "name": "setValue",
        "type": "server_js",
        "source": "function setValue(x, y, blad, value) {\n    if (blad.rows \u003c x + 1) {\n        var rij \u003d [];\n        rij.push(value);\n        blad.appendRow(rij);\n    } else {\n        var cell \u003d blad.getRange(\u0027a1\u0027);\n        cell.offset(x, y).setValue(value);\n\n    }\n}\n\nfunction setValueColor(x, y, blad, value, backgroundcolor) {\n    if (blad.rows \u003c x + 1) {\n        var rij \u003d [];\n        rij.push(value);\n        blad.appendRow(rij);\n    } else {\n        var cell \u003d blad.getRange(\u0027a1\u0027);\n        cell.offset(x, y).setValue(value);\n        cell.offset(x, y).setBackground(backgroundcolor);\n    }\n}\n\nfunction setValueFullColor(x, y, blad, value, backgroundcolor, fontcolor) {\n    if (blad.rows \u003c x + 1) {\n        var rij \u003d [];\n        rij.push(value);\n        blad.appendRow(rij);\n    } else {\n        var cell \u003d blad.getRange(\u0027a1\u0027);\n        cell.offset(x, y).setValue(value);\n        cell.offset(x, y).setBackground(backgroundcolor);\n        cell.offset(x, y).setFontColor(fontcolor);\n    }\n}\n"
    }, {
        "id": "2338606a-5ab7-43dc-9d7f-da0d466da059",
        "name": "split",
        "type": "server_js",
        "source": "function split(string, char) {\n\n    var array \u003d [{}];\n    var teller \u003d 0;\n\n    if (string !\u003d undefined) {\n        while (string.indexOf(char) \u003e 0) {\n            array[teller] \u003d string.substring(0, string.indexOf(char));\n            string \u003d string.substring(string.indexOf(char) + 1, string.length);\n            teller++;\n        }\n\n        array[teller] \u003d string;\n    }\n    return array;\n}\n"
    }, {
        "id": "f64c0d7e-907b-4c53-9405-04a12b0296c8",
        "name": "timeDiff",
        "type": "server_js",
        "source": "//returning number\n\nfunction dayDiff(first, second) {\n    return Math.floor((second - first) / (1000 * 60 * 60 * 24));\n}\n\nfunction hourDiff(first, second) {\n    return Math.floor((second - first) / (1000 * 60 * 60));\n}\n\nfunction minuteDiff(first, second) {\n    return Math.floor((second - first) / (1000 * 60));\n}\n\nfunction secondDiff(first, second) {\n    return Math.floor((second - first) / (1000));\n}\n"
    }, {
        "id": "e08f5c1e-6605-4188-8412-bedd9b1fd44b",
        "name": "updateChartLegend",
        "type": "server_js",
        "source": "function updateChartLegend(HISTORY, PERCENT, row, kolom) {\n\n    // history\n    var waarde \u003d getValue(row, kolom, HISTORY);\n    var naam \u003d getValue(2, kolom, HISTORY);\n    setValue(3, kolom, HISTORY, \u0027[\u0027 + kolom + \u0027] \u0027 + naam + \u0027 (\u0027 + waarde + \u0027)\u0027);\n\n    // percentage\n    waarde \u003d getValue(row, kolom, PERCENT);\n    naam \u003d getValue(2, kolom, PERCENT);\n    setValue(3, kolom, PERCENT, \u0027[\u0027 + kolom + \u0027] \u0027 + naam + \u0027 (\u0027 + waarde + \u0027)\u0027);\n}\n"
    }, {
        "id": "14f18bc6-5d56-4cc6-b1dd-c7443fda205a",
        "name": "updateHistory",
        "type": "server_js",
        "source": "function updateHistory(HISTORY, META, row, date, kolom) {\n    var page \u003d getValue(0, kolom, HISTORY);\n    var currentPage \u003d page;\n    var offset \u003d 0;\n    var found \u003d false;\n    var onPage \u003d 0;\n\n    // Date op de juiste rij zetten\n    setValue(row, 0, HISTORY, date);\n\n    // find op welke pagina hij te vinden is;\n    while (!found) {\n        currentPage \u003d page + offset;\n        onPage \u003d findWatchface(currentPage);\n        if (onPage !\u003d 0) {\n            found \u003d true;\n        } else {\n            currentPage \u003d page - offset;\n            onPage \u003d findWatchface(currentPage);\n        }\n\n        if (onPage !\u003d 0) {\n            found \u003d true;\n        } else {\n            offset \u003d offset + 1;\n        }\n    }\n\n    // schrijf bovenaan kolom welke pagina dat was\n    setValue(0, kolom, HISTORY, currentPage);\n\n    // reken uit welke positie dat is\n    var rank \u003d 24 * (currentPage - 1) + onPage;\n\n    // zet positie op juiste row\n    setValue(row, kolom, HISTORY, rank);\n\n    // zet positie in meta\n    setValue(kolom, 1, META, rank);\n\n}\n"
    }, {
        "id": "b3932919-c4ad-447d-aace-d58631c2f6bb",
        "name": "main",
        "type": "server_js",
        "source": "var rankingNamen \u003d [];\nvar rankingScores \u003d [];\n\nfunction main() {\n    var DATA \u003d \u00271l9yVXgBg-etNtzsybBVY3nfsiDIwWGayJXBKdCZ5W4Y\u0027;\n    var data \u003d SpreadsheetApp.openById(DATA);\n\n    var BUFFER \u003d data.getSheets()[0];\n    var FaceRepo_META \u003d data.getSheets()[1];\n    var FaceRepo_HISTORY \u003d data.getSheets()[2];\n    var PERCENT \u003d data.getSheets()[3];\n\n    var HISTORY \u003d FaceRepo_HISTORY;\n    var META \u003d FaceRepo_META;\n\n    var STARTDATUM \u003d new Date(\"November 24, 2015 0:00:00\");\n    var progstart \u003d new Date();\n    var timezone \u003d \u0027GMT\u0027;\n\n    var date \u003d Utilities.formatDate(progstart, timezone, \u0027dd-MM-yyyy\u0027);\n    var row \u003d dayDiff(STARTDATUM, progstart) + 1;\n\n    updateHistory(HISTORY, META, row, date, 1);\n    updateChartLegend(HISTORY, PERCENT, row, 1);\n\n    updateHistory(HISTORY, META, row, date, 2);\n    updateChartLegend(HISTORY, PERCENT, row, 2);\n\n    updateMax(HISTORY, META, row, date, 3);\n    updateChartLegend(HISTORY, PERCENT, row, 3);\n\n    for (var kolom \u003d 4; kolom \u003c 14; kolom++) {\n        updateGrens(HISTORY, META, row, date, kolom);\n        updateChartLegend(HISTORY, PERCENT, row, kolom);\n    }\n\n    setValue(0, 1, META, Utilities.formatDate(new Date(), timezone,\n        \"yyyy-MM-dd\u0027 at \u0027HH:mm:ss\u0027 (\" + timezone + \")\u0027\"));\n\n}\n"
    }, {
        "id": "836c1aac-6222-4ebf-a573-ebb7a7587529",
        "name": "findWatchface",
        "type": "server_js",
        "source": "function findWatchface(page) {\n    HTML \u003d getWebpage(\u0027https://facerepo.com/app/search/results/?sortOrder\u003ddownloaded-most\u0026compatibleIncluded\u003dtrue\u0026page\u003d\u0027 +\n        page);\n    var lijst \u003d [];\n    lijst \u003d split(HTML, \u0027\u003cdiv class\u003d\"secondary-text\"\u003e\u0027);\n    var lijst2 \u003d [];\n\n    for (var i \u003d 1; i \u003c 24 + 1; i++) {\n        lijst2 \u003d split(lijst[i], \"\u003e\");\n        if (lijst2[2].substring(0, lijst2[2].length - 3) \u003d\u003d \"Desnouck\") {\n            return i;\n        }\n    }\n    return 0\n}\n"
    }, {
        "id": "2f7ef4ba-cdf6-4d4a-b86a-049e6302f83c",
        "name": "updateMax",
        "type": "server_js",
        "source": "function updateMax(HISTORY, META, row, date, kolom) {\n    var page \u003d getValue(0, kolom, HISTORY);\n    var currentPage \u003d page;\n    var offset \u003d 0;\n    var found \u003d false;\n    var onPage \u003d 0;\n\n    // find op welke pagina hij te vinden is;\n    while (!found) {\n        currentPage \u003d page + offset;\n        onPage \u003d endOfResults(currentPage);\n        if (onPage !\u003d 0) {\n            found \u003d true;\n        } else {\n            currentPage \u003d page - offset;\n            if (currentPage \u003c 2) {\n                currentPage \u003d 1;\n            }\n            onPage \u003d endOfResults(currentPage);\n        }\n\n        if (onPage !\u003d 0) {\n            found \u003d true;\n        } else {\n            offset \u003d offset + 1;\n        }\n    }\n\n    // schrijf bovenaan kolom welke pagina dat was\n    setValue(0, kolom, HISTORY, currentPage);\n\n    // reken uit welke positie dat is\n    var rank \u003d 24 * (currentPage - 1) + onPage;\n\n    // zet positie op juiste row\n    setValue(row, kolom, HISTORY, rank);\n\n}\n"
    }, {
        "id": "7c6dd789-acd1-4183-ba48-ea52a3163116",
        "name": "endOfResults",
        "type": "server_js",
        "source": "function endOfResults(page) {\n    HTML \u003d getWebpage(\u0027https://facerepo.com/app/search/results/?sortOrder\u003ddownloaded-most\u0026compatibleIncluded\u003dtrue\u0026page\u003d\u0027 +\n        page);\n    var lijst \u003d [];\n    lijst \u003d split(HTML, \u0027\u003cdiv class\u003d\"secondary-text\"\u003e\u0027);\n    var lijst2 \u003d [];\n\n    for (var i \u003d 1; i \u003c 24 + 1; i++) {\n        if (lijst[i] \u003d\u003d undefined) {\n            return i\n        }\n    }\n    return 0\n}\n"
    }, {
        "id": "0bd36576-78d2-4b22-94ff-06f3713a08ec",
        "name": "updateGrens",
        "type": "server_js",
        "source": "function updateGrens(HISTORY, META, row, date, kolom) {\n    var page \u003d getValue(0, kolom, HISTORY);\n    var currentPage \u003d page;\n    var offset \u003d 0;\n    var found \u003d false;\n    var onPage \u003d 0;\n    var grens \u003d getValue(1, kolom, HISTORY);\n\n    // find op welke pagina hij te vinden is;\n    while (!found \u0026\u0026 offset \u003c 10) {\n        currentPage \u003d page + offset;\n        onPage \u003d findGrens(currentPage, grens);\n\n        if (onPage !\u003d 24 \u0026\u0026 onPage !\u003d -1) {\n            found \u003d true;\n        } else {\n            currentPage \u003d page - offset;\n            if (currentPage \u003c 2) {\n                currentPage \u003d 1;\n            }\n            onPage \u003d findGrens(currentPage, grens);\n        }\n\n        if (onPage !\u003d 24 \u0026\u0026 onPage !\u003d -1) {\n            found \u003d true;\n        } else {\n            offset \u003d offset + 1;\n        }\n    }\n\n    if (offset \u003c 10) {\n        // schrijf bovenaan kolom welke pagina dat was\n        setValue(0, kolom, HISTORY, currentPage);\n\n        // reken uit welke positie dat is\n        var rank \u003d 24 * (currentPage - 1) + onPage;\n\n        // zet positie op juiste row\n        setValueColor(row, kolom, HISTORY, rank, \"white\");\n\n        // setValue(row+1,kolom,HISTORY,onPage);\n        // setValue(row+2,kolom,HISTORY,offset);\n\n    } else {\n        // reken uit welke positie dat is\n        var rank \u003d 24 * (page);\n\n        // zet positie op juiste row\n        setValueColor(row, kolom, HISTORY, rank, \"orange\");\n\n    }\n}\n"
    }, {
        "id": "a535df64-e14a-46c4-8d53-437e38352f32",
        "name": "findGrens",
        "type": "server_js",
        "source": "function findGrens(page, grens) {\n    HTML \u003d getWebpage(\u0027https://facerepo.com/app/search/results/?sortOrder\u003ddownloaded-most\u0026compatibleIncluded\u003dtrue\u0026page\u003d\u0027 +\n        page);\n    var lijst \u003d [];\n    lijst \u003d split(HTML, \u0027\u003cdiv class\u003d\"secondary-text\"\u003e\u0027);\n    var lijst2 \u003d [];\n\n    for (var i \u003d 24; i \u003e 0; i--) {\n        lijst2 \u003d split(lijst[i], \"\u003e\");\n        if (lijst2[23].substring(6, lijst2[23].length - 4) \u003d\u003d grens) {\n            return i;\n        }\n    }\n    return \u0027-1\u0027\n}\n"
    }, {
        "id": "d1e889ae-7f2f-4e18-affc-d626e30ed3bc",
        "name": "findGrensTest",
        "type": "server_js",
        "source": "function findGrensTest(page, grens, BUFFER) {\n    HTML \u003d getWebpage(\u0027https://facerepo.com/app/search/results/?sortOrder\u003ddownloaded-most\u0026compatibleIncluded\u003dtrue\u0026page\u003d\u0027 +\n        page);\n    var lijst \u003d [];\n    lijst \u003d split(HTML, \u0027\u003cdiv class\u003d\"secondary-text\"\u003e\u0027);\n    var lijst2 \u003d [];\n\n    for (var i \u003d 24; i \u003e 0; i--) {\n        lijst2 \u003d split(lijst[i], \"\u003e\");\n        // setValue(i,0,BUFFER,lijst2[23].substring(6,lijst2[23].length-4));\n    }\n}\n"
    }]
}
