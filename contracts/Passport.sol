pragma solidity ^0.4.24;

contract Passport {

	// user's model
	struct	User {
		address	uid;
		string	firstName;
		string	lastName;
		uint	age;
	}

	// store all users
	mapping(address => User) public users;
	// store users count
	uint public usersCount;

	constructor () public {
		registration("Ivan", "Ivanov", 18);
	}

	function	registration (string _firstName, string _lastName, uint _age) public {
		// require a valid user
		require(_age >= 18, "< 18 years old");

		usersCount++;
		users[msg.sender] = User(msg.sender, _firstName, _lastName, _age);
	}

	function userRegistered (address userAddres) publick view returns (bool) {
		return users[userAddress].age != 0;
	}
}