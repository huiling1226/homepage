(function () {
    'use strict';

    function pubHtmlConference(pub) {
        return `${pub.authors}, "${pub.title}", in <em>${pub.venue}</em>, ${pub.location}.`;
    }
    function pubHtmlJournal(pub) {
        return `${pub.authors}, "${pub.title}", <em>${pub.venue}</em>, ${pub.location}.`;
    }

    const page = document.body.dataset.page;
    if (page !== 'home' && page !== 'publications') return;

    fetch('publications.json')
        .then(function (response) { return response.json(); })
        .then(function (data) {
            if (page === 'home') {
                const icdeFirstAuthor = data.conferences.filter(function (pub) {
                    return /ICDE/i.test(pub.venue) &&
                        /^\s*<strong>Huiling Li<\/strong>/.test(pub.authors);
                });
                const tmcPapers = data.journals.filter(function (pub) {
                    return /IEEE Transactions on Mobile Computing|TMC/i.test(pub.venue);
                });
                const selectedList = document.getElementById('selected-pub-list');
                if (selectedList) {
                    [].concat(icdeFirstAuthor, tmcPapers).forEach(function (pub) {
                        const li = document.createElement('li');
                        const isConference = data.conferences.indexOf(pub) !== -1;
                        li.innerHTML = isConference ? pubHtmlConference(pub) : pubHtmlJournal(pub);
                        selectedList.appendChild(li);
                    });
                }
            }
            if (page === 'publications') {
                const confList = document.getElementById('conf-list');
                if (confList) {
                    data.conferences.forEach(function (pub) {
                        const li = document.createElement('li');
                        li.innerHTML = pubHtmlConference(pub);
                        confList.appendChild(li);
                    });
                }
                const journalList = document.getElementById('journal-list');
                if (journalList) {
                    data.journals.forEach(function (pub) {
                        const li = document.createElement('li');
                        li.innerHTML = pubHtmlJournal(pub);
                        journalList.appendChild(li);
                    });
                }
            }
        })
        .catch(function (error) {
            console.error('Error loading publications:', error);
            const msg = '<li>Failed to load publications. Please check your publications.json file.</li>';
            if (page === 'home') {
                const sel = document.getElementById('selected-pub-list');
                if (sel) sel.innerHTML = msg;
            }
            if (page === 'publications') {
                const c = document.getElementById('conf-list');
                const j = document.getElementById('journal-list');
                if (c) c.innerHTML = msg;
                if (j) j.innerHTML = msg;
            }
        });
})();
