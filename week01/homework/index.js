const util = require('util');
const axios = require('axios');
const cheerio = require('cheerio');
const to = require('await-to-js').default;
const ObjectsToCsv = require('objects-to-csv');
const issueLink = 'https://github.com/GeekUniversity/Frontend-01-Template/issues/1';
// const issueLink = 'http://localhost:8000/issue.html';
const weekNumber = '01';
const CONTENT_TABLE = [
    ['user_number',   '学号'],
    ['real_name',     '姓名'],
    ['classroom',     '班级'],
    ['group_name',    '小组'],
    ['homework_link', '链接']
];

const fetchDirectory = async (link) => {
    let response, err;
    [err, response] = await to(axios.get(link));
    const $ = cheerio.load(response.data, {decodeEntities: false});
    const files = $('.files').find('.js-navigation-item').not('.up-tree');
    return files.map((i, node) => {
        const type = $(node).children('.icon').children('svg').attr('aria-label');
        const link = 'https://github.com' + $(node).find('.js-navigation-open').attr('href');
        if (type == 'directory') 
            return fetchDirectory(link);
        if (type == 'file')
            return fetchNumberOfLines(link);
    });
}

const fetchNumberOfLines = async (link) => {
    let response, err;
    [err, response] = await to(axios.get(link));
    const $ = cheerio.load(response.data, {decodeEntities: false});
    const content = $('.Box-header>.text-mono').text().trim();
    let nol;
    try { nol = /(\d*) lines/.exec(content)[1]; }
    catch (err) { nol = '0'; }
    return nol;
}

const fetchIssue = async (link) => {
    const data = [];
    let response, err;
    [err, response] = await to(axios.get(link));
    let $ = cheerio.load(response.data, {decodeEntities: false});
    const comments = $('.js-issue-timeline-container').find('.js-timeline-item');
    comments.each((i, node) => {
        data[i] = {};
        data[i].github_username = $(node).find('.author').text();
        data[i].commited_time = $(node).find('relative-time').attr('datetime');
        const content = $(node).find('.comment-body').children('p').text();
        for (t of CONTENT_TABLE) {
            reg = new RegExp(t[1] + '[:|：](.*)');
            try { data[i][t[0]] = reg.exec(content)[1].trim(); }
            catch (_) {data[i][t[0]] = ''}
        }
        // const link = `https://github.com/${data[i].github_username}/Frontend-01-Template`;
        // data[i].homework_link = (data[i].homework_link.startsWith(link)) ? link + `/blob/master/week${weekNumber}/` : '';
    });
    return data;
}

fetchIssue(issueLink).then((data) => {
    const csv = new ObjectsToCsv(data);
    return csv.toDisk('./homework.csv');
}).then((res) => {
    console.log(util.inspect(res, false, null, true));
}).catch((err) => {
    console.trace(err);
});
