(function () {
    'use strict';

    function pubTitleHtml(pub) {
        return pub.url ? `<a href="${pub.url}" target="_blank" rel="noopener noreferrer">${pub.title}</a>` : pub.title;
    }

    function pubHtmlConference(pub) {
        return `${pub.authors}, "${pubTitleHtml(pub)}", in <em>${pub.venue}</em>, ${pub.location}.`;
    }
    function pubHtmlJournal(pub) {
        return `${pub.authors}, "${pubTitleHtml(pub)}", <em>${pub.venue}</em>, ${pub.location}.`;
    }

    const page = document.body.dataset.page;
    if (page !== 'home' && page !== 'publications') return;

    fetch('publications.json', { cache: 'no-cache' })
        .then(function (response) { return response.json(); })
        .then(function (data) {
            if (page === 'home') {
                const selectedConferences = data.conferences.filter(function (pub) {
                    return pub.selected === true || (/ICDE/i.test(pub.venue) &&
                        /^\s*<strong>Huiling Li<\/strong>/.test(pub.authors));
                });
                const selectedJournals = data.journals.filter(function (pub) {
                    return pub.selected === true || /IEEE Transactions on Mobile Computing|TMC/i.test(pub.venue);
                });
                const selectedList = document.getElementById('selected-pub-list');
                if (selectedList) {
                    [].concat(selectedConferences, selectedJournals).forEach(function (pub) {
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
