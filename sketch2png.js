#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const unzip = require('unzip');
const glob = require('glob');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

rimraf.sync('previews');
glob.sync('sketch_files/**/*.sketch').forEach(fname => {
  fs.createReadStream(fname)
    .pipe(unzip.Parse())
    .on('entry', entry => {
      const fileName = entry.path;
      if (fileName === 'previews/preview.png') {
        const pngName = fname.replace(/^sketch_files\//, 'previews/') + '.png';
        mkdirp.sync(path.dirname(pngName));
        entry.pipe(fs.createWriteStream(pngName));
      } else {
        entry.autodrain();
      }
    });
});
