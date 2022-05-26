
import './Avatar.scss'

export default function Avatar({ id, showName }) {
    const friends = JSON.parse(sessionStorage.getItem('ppFriends'))
    let friend = null;

    if (friends) {
        friend = friends.filter(matchId)[0];

        function matchId(user) {
            return user.id === id
        }
    }


    return (
        <>
            {friend && (
                <div className="avatar" style={{ backgroundImage: `url(${friend.imageURL})` }}>
                    <img src={friend.imageURL} alt={`${friend.displayName}'s avatar`} title={friend.displayName} />
                </div>
            )}

            {friend && showName && (
                <span className="avatar-name">{friend.displayName}</span>
            )}
        </>

    )
}