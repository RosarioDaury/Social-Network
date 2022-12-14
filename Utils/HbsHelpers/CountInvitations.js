function CountInvitations(event, invitations) {
    console.log({ event, invitations })
    var count = invitations.filter(el => el.eventId === event.id)
    return count.length || 0;
}

module.exports = CountInvitations;