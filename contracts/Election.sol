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
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
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
        // require that they haven't voted before
        require(!voters[msg.sender], "Already voted");
        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount,
                                              "Not valid candidate");


        // record that voter has voted
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
