#!/bin/bash

rm -R dist
mkdir dist
cp -R images dist/images
cp -R fonts dist/fonts
cp favicon.ico thumbnail.png title_and_description.txt dist
uglifyjs-folder js -o dist/js/all.min.js
#css-minify -d css
mkdir dist/css
# mv css-dist/main.min.css dist/css/main.min.css
cp css/main.css dist/css/main.min.css
rm -R css-dist
html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype content.html -o dist/content.html
filename=${PWD##*/}
if [ -z "$VER" ]
then
      d=`date +"%s"`
else
      d=$VER
fi
cd dist && zip -r -X ${filename}-${d}.zip *