var Passport = artifacts.require("./Passport.sol");

contract("Passport", function(accounts) {

	it("registration one valid user", function() {
    	return Passport.deployed().then(function(instance) {
      		return instance.usersCount();
	    }).then(function(count) {
	    	assert.equal(count, 1);
	    });
	});
/*
	it("it initializes the candidates with the correct values", function() {
	    return Election.deployed().then(function(instance) {
	      electionInstance = instance;
	      return electionInstance.candidates(1);
	    }).then(function(candidate) {
	      assert.equal(candidate[0], 1, "contains the correct id");
	      assert.equal(candidate[1], "Candidate 1", "contains the correct name");
	      assert.equal(candidate[2], 0, "contains the correct votes count");
	      return electionInstance.candidates(2);
	    }).then(function(candidate) {
	      assert.equal(candidate[0], 2, "contains the correct id");
	      assert.equal(candidate[1], "Candidate 2", "contains the correct name");
	      assert.equal(candidate[2], 0, "contains the correct votes count");
	    });
	});*/

});