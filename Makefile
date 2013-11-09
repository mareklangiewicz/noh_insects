jsdoc:
	jsdoc -d apidoc *.js

jsdoc_explain: *.js
	jsdoc --explain *.js > jsdoc_explain
