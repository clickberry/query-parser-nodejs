var parser=require('./lib/parser');

function QueryParser(options){

}

QueryParser.prototype.parse=function(req,res,next){
    parser(req.query);
};

module.exports=QueryParser;