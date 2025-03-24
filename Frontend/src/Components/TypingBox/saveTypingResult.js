export const saveTypingResult = async (email, wpm, accuracy, duration) => {
    try {
        const response = await fetch('http://localhost:3000/typing/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, wpm, accuracy, duration }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};