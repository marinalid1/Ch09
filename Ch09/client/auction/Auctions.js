import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Edit from '@material-ui/icons/Edit'
import ViewIcon from '@material-ui/icons/Visibility'
import Divider from '@material-ui/core/Divider'
import DeleteAuction from './DeleteAuction'
import auth from '../auth/auth-helper'
import {Link} from 'react-router-dom'

// Pg 419, takes the end date and compares it with the current date to calculate the diffrence and makes a timeLeft object
const calculateTimeLeft = (date) => {
  const difference = date - new Date()
  let timeLeft = {}

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      timeEnd: false
    }
  } else {
      timeLeft = {timeEnd: true}
  }
  return timeLeft
}

// Pg 417, the Auctions component
export default function Auctions(props){
  // Pg 418, details of each auction's state are determined and rendered with the following code
  const currentDate = new Date()
  // Pg 418, take the end date as an argument and uses the calculateTimeLeft method to construct the time string rendered in the view
  // Pg 425, render a timer and a bidding section, depending on wether the current user is signed in
  const showTimeLeft = (date) => {
    let timeLeft = calculateTimeLeft(date)
    return !timeLeft.timeEnd && <span>
      {timeLeft.days != 0 && `${timeLeft.days} d `} 
      {timeLeft.hours != 0 && `${timeLeft.hours} h `} 
      {timeLeft.minutes != 0 && `${timeLeft.minutes} m `} 
      {timeLeft.seconds != 0 && `${timeLeft.seconds} s`} left
    </span>
  }

  // Pg 425, render the auction state by considering the current date and the given auction;s bidding start and end timings
  const auctionState = (auction)=>{
    return (
      <span>
          {currentDate < new Date(auction.bidStart) && `Auction Starts at ${new Date(auction.bidStart).toLocaleString()}`}
          {currentDate > new Date(auction.bidStart) && currentDate < new Date(auction.bidEnd) && <>{`Auction is live | ${auction.bids.length} bids |`} {showTimeLeft(new Date(auction.bidEnd))}</>}
          {currentDate > new Date(auction.bidEnd) && `Auction Ended | ${auction.bids.length} bids `} 
          {currentDate > new Date(auction.bidStart) && auction.bids.length> 0 && ` | Last bid: $ ${auction.bids[0].bid}`}
      </span>
    )
  }
  // Pg 420, Updating the list view
    return (
        <List dense>
        {props.auctions.map((auction, i) => {
            return   <span key={i}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar variant='square' src={'/api/auctions/image/'+auction._id+"?" + new Date().getTime()}/>
                </ListItemAvatar>
                <ListItemText primary={auction.itemName} secondary={auctionState(auction)}/>
                <ListItemSecondaryAction>
                    <Link to={"/auction/" + auction._id}>
                      <IconButton aria-label="View" color="primary">
                        <ViewIcon/>
                      </IconButton>
                    </Link>
                { auth.isAuthenticated().user && auth.isAuthenticated().user._id == auction.seller._id &&
                  <>
                    <Link to={"/auction/edit/" + auction._id}>
                      <IconButton aria-label="Edit" color="primary">
                        <Edit/>
                      </IconButton>
                    </Link>
                    <DeleteAuction auction={auction} onRemove={props.removeAuction}/>
                  </>
                }
                </ListItemSecondaryAction>
              </ListItem>
              <Divider/>
            </span>})}
        </List>
    )
}

Auctions.propTypes = {
    auctions: PropTypes.array.isRequired,
    removeAuction: PropTypes.func.isRequired
  }

