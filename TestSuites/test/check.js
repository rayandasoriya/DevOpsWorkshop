var expect    = require("chai").expect;
var main = require("../main");

describe("Sanity check", function() {
    it("can run maven test and get results", async function() {
        this.timeout(80000);
        let tests = await main.calculatePriority();
        expect(tests).to.be.length(6);
    });
});