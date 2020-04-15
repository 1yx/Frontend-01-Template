const util = require('util');
const axios = require('axios');
const cheerio = require('cheerio');
const to = require('await-to-js').default;
const ObjectsToCsv = require('objects-to-csv');
const moment = require('moment');
const issueLink = 'https://github.com/GeekUniversity/Frontend-01-Template/issues/1';
const weekNumber = '01';
const HEADER = [
    'GitHub帐号',
    '提交issue时间',
    '学号',
    '姓名',
    '班级',
    '小组',
    '作业&总结链接',
    '总结的行数',
    '作业的行数'
];
const AUTHOR = HEADER[0];
const LINK = HEADER[6];

const sleep = () => {
    return new Promise((resolve) => {
        setTimeout(resolve, Math.floor(Math.random() * (2000 - 500)) + 500);
    });
}

const makeData = (node) => {
    data = {};
    data[HEADER[0]] = node.find('.timeline-comment-header-text>.css-truncate>.author').text();
    data[HEADER[1]] = moment(node.find('relative-time').attr('datetime')).format('YYYY-MM-DD HH:mm:ss');
    const content = node.find('.comment-body').children('p').text();
    
    for (let i = 2; i <= 6; i ++) {
        reg = new RegExp('#' + HEADER[i] + '[:|：](.*)');
        try { data[HEADER[i]] = reg.exec(content)[1].trim(); }
        catch (_) {data[HEADER[i]] = ''}
    }
    const link = `https://github.com/${data[AUTHOR]}/Frontend-01-Template`;
    data[LINK] = (data[LINK].startsWith(link)) ? link + `/blob/master/week${weekNumber}/` : '';
    return data;
}

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
    let response, err, _;
    [_, _] = await to(sleep());
    console.log(link);
    [err, response] = await to(axios.get(link));
    if (err) throw err;
    const $ = cheerio.load(response.data, {decodeEntities: false});
    const content = $('.Box-header>.text-mono').text();
    let nol;
    try { nol = /(\d*) lines/.exec(content.trim())[1]; }
    catch (err) { nol = '0'; }
    return nol;
}

/*
 *  link examples:
 *  431 /_render_node/MDU6SXNzdWU1ODY3ODI0MDg=/timeline/more_items?variables%5Bafter%5D=Y3Vyc29yOnYyOpPPAAABcXcCfQAAqTYxMzIyMzUwNg%3D%3D&variables%5Bbefore%5D=Y3Vyc29yOnYyOpPPAAABcX6JCFAAqTYxNDEyMTUxMA%3D%3D&variables%5Bfirst%5D=60&variables%5BhasFocusedReviewComment%5D=false&variables%5BhasFocusedReviewThread%5D=false
 *  371 /_render_node/MDU6SXNzdWU1ODY3ODI0MDg=/timeline/more_items?variables%5Bafter%5D=Y3Vyc29yOnYyOpPPAAABcXlBImAAqTYxMzUwMjM1Mw%3D%3D&variables%5Bbefore%5D=Y3Vyc29yOnYyOpPPAAABcX6JCFAAqTYxNDEyMTUxMA%3D%3D&variables%5Bfirst%5D=60&variables%5BhasFocusedReviewComment%5D=false&variables%5BhasFocusedReviewThread%5D=false
 */
const fetchLoadMore = async (link, i) => {
    let response, err, data = [], _;
    [_, _] = await to(sleep(1500));
        console.log('load more:' + i);
    [err, response] = await to(axios.get(link));
    let $ = cheerio.load(response.data);
    const comments = $('.js-timeline-item');
    comments.each((i, node) => {
        data[i] = makeData($(node));
    });
    const nextLink = $('.ajax-pagination-form').attr('action');
    if (nextLink !== undefined && i < 10) {
        [err, nextData] = await to(fetchLoadMore('http://github.com' + nextLink, i + 1));
        return [...data, ...nextData];
    }
    return data;
}

const fetchIssue = async (link) => {
    const data = [];
    let response, err, more = [];
    [err, response] = await to(axios.get(link));
    let $ = cheerio.load(response.data, {decodeEntities: false});
    const comments = $('.js-timeline-item');
    comments.each((_, node) => {
        data.push(makeData($(node)));
    });
    const loadMoreLink = $('.ajax-pagination-form').attr('action');
    if (loadMoreLink === undefined)
        return data;
    [err, more] = await to(fetchLoadMore('https://github.com' + loadMoreLink, 1));
    const first30 = data.splice(0, 30);
    return [...first30, ...more, ...data];
}


(async () => {
    let err, data, res;
    [err, data] = await to(fetchIssue(issueLink));
    if (err) throw err;
    console.log('total', data.length);
    for (let d of data) {
        if (d[LINK] !== '') {
            [err, res] = await to(fetchNumberOfLines(d[LINK] + 'NOTE.md'));
            d[HEADER[7]] = (err) ? '0' : res;
        }
    }
    const csv = new ObjectsToCsv(data);
    [err, res] = await to(csv.toDisk('./homework.csv'));
    if (err) throw err;
})();
