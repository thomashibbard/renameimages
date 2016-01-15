var fs = require('fs-extra')
  , path = require('path')
  , async = require('async');

var srcDir = process.argv[2]
  , suffix = process.argv[3] ? '_' + process.argv[3] : ''
  , imageRe = /svg|png|jpe?g$/
  , fileNameRe = /^(.*?)\.(\w+)$/
  , fileParts = []
  , invisRe = /^\./
  , parentDirs = []
  , files = []
  , filePath = ''
  , oldName = ''
  , newName = ''
  , renameFile = function(oldName, newName, callback){
    fs.rename(oldName, newName, function(err){
      if (err){
        console.log('error renaming file', err);
      }else{
        callback();
      }
    });
  }
  , getFileList = function(dir, callback){
    fs.readdir(dir, function(err, files){
     async.filter(files, function(file, filterCallback){
      //this script only changes the names of image files, filter out the rest
      filterCallback(!invisRe.test(file) && imageRe.test(file));
     }, function(result){
      callback(result);
     });
      
    })
  };

async.series([function(seriesCallback){
 fs.readdir(srcDir, function(err, childDirs){
  async.filter(childDirs, function(dir, filterCallback){
    filterCallback(!invisRe.test(dir));
  }, 
  function(result){
    parentDirs = result;
    seriesCallback();
  })
 }) 
}, 
function(callback){
  
  async.forEachOfLimit(parentDirs, 1, function(sizeDir, index, parentDirsCallback){
    filePath = path.join(srcDir, sizeDir);
    getFileList(filePath, function(files){
      async.each(files, function(file, cb){
        fileParts = file.match(fileNameRe);
        oldName = path.join(filePath, file);
        newName = path.join(filePath, fileParts[1] + '_' + sizeDir + suffix + '.' + fileParts[2]);
        renameFile(oldName, newName, function(){
        cb();  
        });
      }, function(err){
        if (err){
          console.log('error getting files', err)
        }else{
          parentDirsCallback();
        }        
      });
      
    })
  }, function(err){
    if (err){
      console.log(err)
    }
  });

}], function(err){
  if(err){
    console.log('async series error', err);
  }else{
    console.log('files renamed. have a nice day');
  }
});
