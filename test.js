import test from 'ava';
import atomiseCSS from './index';

import {readFileSync} from 'fs';
import postcss from "postcss";
import perfectionist from "perfectionist";

const fixturePath = check => `./test/fixtures/${check}`;

const atomise = check => atomiseCSS(readFileSync(`${fixturePath(check)}/src.css`, 'utf8'));
const expectedCSS = check => postcss([perfectionist({format: 'compact'})])
    .process(readFileSync(`${fixturePath(check)}/expected.css`, 'utf8'))
    .css;
const expectedMap = check => require(`${fixturePath(check)}/expected.json`);

[
    'chained',
    'dedupe',
    'mq',
    'supports',
    'pseudo',
    'complex' // mix of everything
].forEach(check => {
    test(t => atomise(check).then(({atomicCSS, atomicMap}) => {
        t.is(atomicCSS, expectedCSS(check));
        t.deepEqual(atomicMap, expectedMap(check));
    }));
});

test(t => t.throws(atomise('keyframes')));
test(t => t.throws(atomise('font-face')));
