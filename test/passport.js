var Passport = artifacts.require("./Passport.sol");

contract("Passport", function(accounts) {
  var passportInstance;

  it("Start with 1 voter", function() {
    return Passport.deployed().then(function(instance) {
      return instance.usersCount();
    }).then(function(count) {
      assert.equal(count, 1);
    });
  });

  it("Check if voter with correct values", function() {
    return Passport.deployed().then(function(instance) {
      passportInstance = instance;
      return passportInstance.users(accounts[0]);
    }).then(function(users) {
      assert.equal(users[0], accounts[0], "contains the correct id");
      assert.equal(users[1], "Ivan", "contains the correct first name");
      assert.equal(users[2], "Ivanov", "contains the correct last name");
      assert.equal(users[3], 18, "contains the correct age");
    });
  });

  it("Add new correct voter", function() {
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

   it("Add new non valid voter ( < 18 )", function() {
    return Passport.deployed().then(function(instance) {
      passportInstance = instance;
      return instance.registration("New", "Voter", 17, {from: accounts[1]});
  }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      assert(error.message, "< 18 years old");
    })
  });

	it("Add new non valid voter ( empty names )", function() {
	 return Passport.deployed().then(function(instance) {
		 passportInstance = instance;
		 return instance.registration("", "", 25, {from: accounts[1]});
 }).then(assert.fail).catch(function(error) {
		 assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
	 })
 });

  it("Add the same voter twice", function() {
    return Passport.deployed().then(function(instance) {
      passportInstance = instance;
      return instance.registration("New", "Voter", 42, {from: accounts[0]});
 }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
    })
  });
});
