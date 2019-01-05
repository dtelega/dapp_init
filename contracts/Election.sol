pragma solidity ^0.4.24;

contract Election {
	// Model a Candidate
    struct Candidate {
        uint    id;
        string  name;
        uint    voteCount;
    }

    bool electionIsOpen;
    address passportAddress;
    address owner;

    // Read/write candidates
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;
    // Store accounts that have voted
    mapping(address => bool) public voters;

    constructor (address _passportAddress) public {
        owner = msg.sender;
        passportAddress = _passportAddress;
        electionIsOpen = true;
        addCandidate("1st candidate");
        addCandidate("2nd candidate");
    }

    function addCandidate (string _name) public {
        // require owner
        require (owner == msg.sender, "You are not allowed to do this");
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidateId) public {
        // require open election
        require(electionIsOpen, "Sorry, election is closed");
        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount,
                                              "Not valid candidate");
        // require passport
        require(Passport(passportAddress).userIsRegistered(msg.sender),
                                        "Require passport information");
        // require that they haven't voted before
        require(!voters[msg.sender], "Already voted");

        // store that this account is vote
        voters[msg.sender] = true;
        // update candidate vote Count
        candidates[_candidateId].voteCount ++;
    }

    function closeElection() public {
        // require owner
        require (owner == msg.sender, "You are not allowed to do this");
        require (electionIsOpen, "Election is already closed");
        electionIsOpen = false;
    }
}

contract Passport {
    function userIsRegistered (address userAddress) public view returns (bool);
}
