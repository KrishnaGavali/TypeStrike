// Function to search for friends
const searchFriends = async (FriendUserId) => {
    try {

        const response = await fetch('http://localhost:3000/auth/profilebyId', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "userid": FriendUserId
            },

        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error('Error searching for friends:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Function to add a new friend
const addFriend = async (email, friendEmail) => {
    try {
        const response = await fetch('http://localhost:3000/auth/addFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, friendEmail }),
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error('Error adding friend:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const getFriends = async (email) => {
    try {
        const response = await fetch('http://localhost:3000/auth/getFriends', {
            method: 'GET',
            headers: {
                'email': email,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error('Error getting friends:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


const FriendsAPI = { searchFriends, addFriend, getFriends };
export default FriendsAPI;
