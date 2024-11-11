// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/AggregatorV3Interface.sol";

contract BetreaConst {
    enum BetDirection {
        Up,
        Down
    }

    struct Bet {
        address player;
        BetDirection direction;
        uint256 timestamp;
        uint amount;
        uint currentPrice;
        uint80 roundId;
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
        uint targetPrice,
        uint80 roundId
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
        (uint80 round, int256 latestPrice, , , ) = priceFeed.latestRoundData();
        uint currentPrice = uint(latestPrice);
        uint betId = betCount++;
        bets[betId] = Bet(
            msg.sender,
            _direction,
            block.timestamp,
            msg.value,
            currentPrice,
            round,
            false
        );

        emit BetPlaced(
            betId,
            msg.sender,
            _direction,
            msg.value,
            currentPrice,
            round
        );
    }

    function settleBet(uint _betId) external onlyOwner {
        Bet storage bet = bets[_betId];
        require(bet.timestamp + 8 seconds < block.timestamp, "Bet not expired");
        require(!bet.settled, "Bet already settled");
        uint80 newRoundId = bet.roundId + 4;

        int256 latestPrice = getRoundPrice(newRoundId);
        uint currentPrice = uint(latestPrice);

        bool won = false;
        if (
            (bet.direction == BetDirection.Up &&
                currentPrice > bet.currentPrice) ||
            (bet.direction == BetDirection.Down &&
                currentPrice < bet.currentPrice)
        ) {
            won = true;
        }

        uint payout = 0;
        if (won) {
            payout = (bet.amount / 100) * 120;
            payable(bet.player).transfer(payout);
        }

        bet.settled = true;
        emit BetSettled(_betId, bet.player, won, payout);
    }

    function placeAndSettleBetWithTrue(
        BetDirection _direction
    ) external payable {
        (uint80 round, int256 latestPrice, , , ) = priceFeed.latestRoundData();
        uint currentPrice = uint(latestPrice);
        uint betId = betCount++;
        bets[betId] = Bet(
            msg.sender,
            _direction,
            block.timestamp,
            msg.value,
            currentPrice,
            round,
            false
        );
        int256 formalPrice = getRoundPrice(round - 4);
        uint formalPriceUint = uint(formalPrice);
        bool won = false;
        if (
            (_direction == BetDirection.Up && currentPrice > formalPriceUint) ||
            (_direction == BetDirection.Down && currentPrice < formalPriceUint)
        ) {
            won = true;
        }
        uint payout = 0;
        if (won) {
            payout = (msg.value / 100) * 120;
            payable(msg.sender).transfer(payout);
        }
        bets[betId].settled = true;

        emit BetPlaced(
            betId,
            msg.sender,
            _direction,
            msg.value,
            currentPrice,
            round
        );
        emit BetSettled(betId, msg.sender, won, payout);
    }

    function withdraw() external onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner).transfer(balance);
    }

    function getLatestPrice() public view returns (int, uint80) {
        (uint80 round, int price, , , ) = priceFeed.latestRoundData();
        return (price, round);
    }

    function getRoundPrice(uint _roundId) public view returns (int) {
        (, int price, , , ) = priceFeed.getRoundData(uint80(_roundId));
        return price;
    }
}
