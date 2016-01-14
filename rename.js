var fs = require('fs-extra')
  , async = require('async');

var srcDir = process.argv[2]
  , imageRe = /svg|png|jpe?g$/
  , parentDir
  , oldName
  , newName;

async.sequence([function(){
 fs.readDir(srcDir, function(err, childDirs){
  console.log(childDirs);
 }) 
}], function(err){

})