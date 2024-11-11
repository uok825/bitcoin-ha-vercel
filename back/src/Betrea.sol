// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/AggregatorV3Interface.sol";

contract Betrea {
    enum BetDirection {
        Up,
        Down
    }

    struct Bet {
        address player;
        BetDirection direction;
        uint amount;
        uint targetPrice;
        bool settled;
    }

    AggregatorV3Interface internal priceFeed;
    mapping(uint => Bet) public bets;
    uint public betCount;
    address public owner;

    event BetPlaced(
        uint indexed betId,
        address indexed player,
        BetDirection direction,
        uint amount,
        uint targetPrice
    );
    event BetSettled(
        uint indexed betId,
        address indexed player,
        bool won,
        uint payout
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        priceFeed = AggregatorV3Interface(
            address(0x43A444AC5d00b96Daf62BC00C50FA47c1aFCf3C3)
        );
        owner = msg.sender;
    }

    function placeBet(BetDirection _direction) external payable {
        (, int256 latestPrice, , , ) = priceFeed.latestRoundData();
        uint targetPrice = uint(latestPrice);

        uint betId = betCount++;
        bets[betId] = Bet(
            msg.sender,
            _direction,
            msg.value,
            targetPrice,
            false
        );

        emit BetPlaced(betId, msg.sender, _direction, msg.value, targetPrice);
    }

    function settleBet(uint _betId) external onlyOwner {
        Bet storage bet = bets[_betId];
        require(!bet.settled, "Bet already settled");

        (, int256 latestPrice, , , ) = priceFeed.latestRoundData();
        uint currentPrice = uint(latestPrice);

        bool won = false;
        if (
            (bet.direction == BetDirection.Up &&
                currentPrice > bet.targetPrice) ||
            (bet.direction == BetDirection.Down &&
                currentPrice < bet.targetPrice)
        ) {
            won = true;
        }

        uint payout = 0;
        if (won) {
            payout = bet.amount * 2;
            payable(bet.player).transfer(payout);
        }

        bet.settled = true;
        emit BetSettled(_betId, bet.player, won, payout);
    }

    function withdraw() external onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner).transfer(balance);
    }

    function getLatestPrice() public view returns (int) {
        (, int price, , , ) = priceFeed.latestRoundData();
        return price;
    }
}
