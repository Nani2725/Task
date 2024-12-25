document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const commentContainer = document.querySelector('.comment-container');
    const commentSection = document.getElementById('comment-section');

    // Handle the login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.text())
        .then(message => {
            if (message === 'Login successful.') {
                // Hide the login form and show the comment section
                loginForm.style.display = 'none';
                commentContainer.style.display = 'block';
                renderComments(commentsData); // Call to render comments after successful login
            } else {
                loginMessage.textContent = message;
            }
        })
        .catch(error => {
            loginMessage.textContent = 'Error logging in.';
            console.error('Error:', error);
        });
    });

    // Initial mock data for comments
    const commentsData = [
        { id: 1, username: 'Sai', text: 'This is a great post!', likes: 3, liked: false, replies: [] },
        { id: 2, username: 'Leela', text: 'I totally agree with you!', likes: 2, liked: false, replies: [] }
    ];

    // Function to render comments and their replies
    function renderComments(comments) {
        commentSection.innerHTML = ''; // Clear existing content

        comments.forEach(comment => {
            const commentCard = document.createElement('div');
            commentCard.classList.add('comment-card');
            commentCard.id = `comment-${comment.id}`; // Unique ID for each comment

            // Comment Header (Avatar + Username)
            const commentHeader = document.createElement('div');
            commentHeader.classList.add('comment-header');
            
            const avatar = document.createElement('img');
            avatar.src = "img/profile.jpg";
            avatar.alt = "Avatar";
            avatar.classList.add('comment-avatar');
            
            const username = document.createElement('span');
            username.classList.add('username');
            username.innerText = comment.username;

            commentHeader.appendChild(avatar);
            commentHeader.appendChild(username);

            // Comment Body (Text)
            const commentBody = document.createElement('div');
            commentBody.classList.add('comment-body');
            commentBody.innerText = comment.text;

            // Comment Footer (Like & Reply Buttons)
            const commentFooter = document.createElement('div');
            commentFooter.classList.add('comment-footer');
            
            const likeButton = document.createElement('button');
            likeButton.classList.add('like-btn');
            likeButton.innerText = comment.liked ? `Unlike (${comment.likes})` : `Like (${comment.likes})`;
            likeButton.onclick = () => handleLike(comment, likeButton);

            const replyButton = document.createElement('button');
            replyButton.classList.add('reply-btn');
            replyButton.innerText = 'Reply';
            replyButton.onclick = () => toggleReplyForm(comment, commentCard); // Pass commentCard as argument

            commentFooter.appendChild(likeButton);
            commentFooter.appendChild(replyButton);

            // Append all parts to the comment card
            commentCard.appendChild(commentHeader);
            commentCard.appendChild(commentBody);
            commentCard.appendChild(commentFooter);

            // Append the card to the comment section
            commentSection.appendChild(commentCard);

            // Render replies if any
            renderReplies(commentCard, comment.replies);
        });
    }

    // Function to handle liking/unliking a comment or a reply
    function handleLike(item, likeButton) {
        if (item.liked) {
            item.likes--;  // Decrease likes if already liked
            likeButton.innerText = `Like (${item.likes})`; // Update the button text to 'Like'
        } else {
            item.likes++;  // Increase likes if not liked
            likeButton.innerText = `Unlike (${item.likes})`; // Update the button text to 'Unlike'
        }
        item.liked = !item.liked; // Toggle the liked state
    }

    // Function to toggle the reply form (show or hide) with one click
function toggleReplyForm(comment, commentCard) {
    let replyContainer = document.querySelector(`#reply-form-${comment.id}`);

    // If the reply container doesn't exist, create it
    if (!replyContainer) {
        // Create reply input if not already present
        replyContainer = document.createElement('div');
        replyContainer.classList.add('reply-container');
        replyContainer.id = `reply-form-${comment.id}`;
        
        const replyInput = document.createElement('input');
        replyInput.classList.add('reply-input');
        replyInput.placeholder = 'Write a reply...';

        const submitButton = document.createElement('button');
        submitButton.classList.add('reply-submit-btn');
        submitButton.innerText = 'Submit';
        submitButton.onclick = () => handleReply(comment, replyInput.value);

        replyContainer.appendChild(replyInput);
        replyContainer.appendChild(submitButton);
    }

    // Toggle visibility of the reply container
    if (replyContainer.style.display === 'none' || replyContainer.style.display === '') {
        replyContainer.style.display = 'block';  // Show the reply form
    } else {
        replyContainer.style.display = 'none';   // Hide the reply form
    }

    // Append the reply container to the correct comment card if it's not already there
    if (!commentCard.contains(replyContainer)) {
        commentCard.appendChild(replyContainer);
    }
}


    // Function to handle submitting a reply
    function handleReply(comment, replyText) {
        if (replyText.trim()) {
            const newReply = {
                id: Date.now(),
                username: 'Sai Leels',
                text: replyText,
                likes: 0,
                liked: false,
                replies: []  // Nested replies array
            };
            comment.replies.push(newReply);
            renderComments(commentsData); // Re-render the comments
        }
    }

    // Function to render replies and their nested replies
    function renderReplies(commentCard, replies) {
        if (replies.length > 0) {
            const replyList = document.createElement('div');
            replies.forEach(reply => {
                const replyCard = document.createElement('div');
                replyCard.classList.add('comment-card');
                replyCard.style.marginLeft = '30px';

                const replyHeader = document.createElement('div');
                replyHeader.classList.add('comment-header');
                
                const replyUsername = document.createElement('span');
                replyUsername.classList.add('username');
                replyUsername.innerText = reply.username;

                replyHeader.appendChild(replyUsername);

                const replyBody = document.createElement('div');
                replyBody.classList.add('comment-body');
                replyBody.innerText = reply.text;

                const replyFooter = document.createElement('div');
                replyFooter.classList.add('comment-footer');

                const likeButton = document.createElement('button');
                likeButton.classList.add('like-btn');
                likeButton.innerText = `Like (${reply.likes})`;
                likeButton.onclick = () => handleLike(reply, likeButton);

                const replyButton = document.createElement('button');
                replyButton.classList.add('reply-btn');
                replyButton.innerText = 'Reply';
                replyButton.onclick = () => toggleReplyForm(reply, replyCard); // Pass replyCard as argument

                replyFooter.appendChild(likeButton);
                replyFooter.appendChild(replyButton);

                replyCard.appendChild(replyHeader);
                replyCard.appendChild(replyBody);
                replyCard.appendChild(replyFooter);

                replyList.appendChild(replyCard);

                // Recursively render nested replies
                renderReplies(replyCard, reply.replies);
            });

            commentCard.appendChild(replyList);
        }
    }
});
