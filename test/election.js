var Election = artifacts.require("./Election.sol");
var Passport = artifacts.require("./Passport.sol");

contract("Election", function(accounts) {
  var electionInstance;
  var passportInstance;

it("Add new user voter", function() {
    return Passport.deployed().then(function(instance) {
      passportInstance = instance;
      instance.registration("New", "Voter", 42, {from: accounts[1]});
      return instance.usersCount();
    }).then(function(count) {
      assert.equal(count, 2);
      return passportInstance.users(accounts[1]);
    }).then(function(users) {
      assert.equal(users[0], accounts[1], "contains the correct id");
      assert.equal(users[1], "New", "contains the correct first name");
      assert.equal(users[2], "Voter", "contains the correct last name");
      assert.equal(users[3], 42, "contains the correct age");
    });
  });

  it("Check if its two candidates", function() {
    return Election.deployed().then(function(instance) {
      return instance.candidatesCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it("Add new candidate with owner", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      instance.addCandidate("Candidate 3");
      return instance.candidatesCount();
    }).then(function(count) {
      assert.equal(count, 3);
      return electionInstance.candidates(3);
    }).then(function(candidate) {
      assert.equal(candidate[0], 3, "contains the correct id");
      assert.equal(candidate[1], "Candidate 3", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
    });
  });

  it("Add new candidate without owner", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return instance.addCandidate("Candidate 4", {from: accounts[1]});
    }).then(assert.fail).catch(function(error) {
      assert(error.message, "You are not allowed to do this");
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
    })
  });


  it("Check if candidate's values are correct", function() {
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
  });

	it("Voting for an invalid candidate", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 0, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
    });
  });

  it("A voting", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 1;
      return electionInstance.vote(candidateId, { from: accounts[0] });
    }).then(function(receipt) {
      return electionInstance.voters(accounts[0]);
    }).then(function(voted) {
      assert(voted, "the voter was marked as voted");
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "increments the candidate's vote count");
    })
  });

  it("Double voting", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 2;
      electionInstance.vote(candidateId, { from: accounts[1] });
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "accepts first vote");
      // Try to vote again
      return electionInstance.vote(candidateId, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
			assert(error.message, "Already voted");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
    });
  });

  it("Voting without passport information", function() {
    return Election.deployed().then(function(instance) {
      return electionInstance.vote(candidateId, { from: accounts[2] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      assert(error.message, "Require passport information");
      return electionInstance.candidates(1);
    });
  });

  it("Vote after closing", function() {
    return Passport.deployed().then(function(instance) {
      passportInstance = instance;
      instance.register("New", "Voter", 42, {from: accounts[2]});
      electionInstance.closeVoting({ from: accounts[0] });
      return electionInstance.vote(candidateId, { from: accounts[2] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message, "Sorry, election is closed");
    });
  });
});
