var fs = require('fs'),
    xml2js = require('xml2js'),
    child  = require('child_process'); 
var parser = new xml2js.Parser();
var Bluebird = require('bluebird')

var testReport =  '/simplecalc/target/surefire-reports/TEST-com.github.stokito.unitTestExample.calculator.CalculatorTest.xml';

if( process.env.NODE_ENV != "test")
{
    //calculatePriority();
    findFlaky();
}

async function findFlaky()
{
    count = 0;
    for( var i = 0; i < 3; i++ )
    {
        try{
            child.execSync('cd simplecalc && mvn test');
        }catch(e){}
        var contents = fs.readFileSync(__dirname + testReport)
        let xml2json = await Bluebird.fromCallback(cb => parser.parseString(contents, cb));
        var tests = readResults(xml2json);
        var stats = [];
        for (let test of tests)
        {
        if (stats.hasOwnPropert(test.name))
        {
            stats[test.name]= {passed:0, failed:0};}

            if (test.status =="passed")
            stats[test.name].passed++;
            if (test.status =="failed")
            stats[test.name].failed++;
        }
         
        tests.forEach( e => console.log(i, e));
    }
    console.log(stats);
    console.log(count);
}

function readResults(result)
{
    function SortByName(x,y) {
        return ((x.status == y.status) ? 0 : ((x.status > y.status) ? 1 : -1 ));
      }
    var tests = [];
    for( var i = 0; i < result.testsuite['$'].tests; i++ )
    {
        var testcase = result.testsuite.testcase[i];
        
        tests.push({
        name:   testcase['$'].name, 
        time:   testcase['$'].time, 
        status: testcase.hasOwnProperty('failure') ? "failed": "passed"
        });
    }
    
    tests.sort(SortByName);
    return tests;
}

async function calculatePriority()
{
    try{
        child.execSync('cd simplecalc && mvn test');
    }catch(e){}
    var contents = fs.readFileSync(__dirname + testReport)
    let xml2json = await Bluebird.fromCallback(cb => parser.parseString(contents, cb));
    var tests = readResults(xml2json);
    tests.forEach( e => console.log(e));

    return tests;
}

module.exports.findFlaky = findFlaky;
module.exports.calculatePriority = calculatePriority;