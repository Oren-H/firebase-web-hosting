isBackgroundVisible = true;
body = document.body;

function turnOffImage() {
    if (isBackgroundVisible) {
        body.style.backgroundImage = 'none'; // Hide the background image
    } else {
        body.style.backgroundImage = 'url("sarahbrown.jpeg")'; // Show the background image
    }

    isBackgroundVisible = !isBackgroundVisible; // Toggle the state
}

// Note that we construct the class here, but we don't need to assign it to a variable.

function checkAnswers() {
    let correctAnswers = 0;

    // Check the answers and update the correctAnswers count
    const answer1 = document.querySelector('input[name="q1"]:checked');
    const answer2 = document.querySelector('input[name="q2"]:checked');
    const answer3 = document.querySelector('input[name="q3"]:checked');
    const answer4 = document.querySelector('input[name="q4"]:checked');
    const answer5 = document.querySelector('input[name="q5"]:checked');
    const answer6 = document.querySelector('input[name="q6"]:checked');
    const answer7 = document.querySelector('input[name="q7"]:checked');
    const answer8 = document.querySelector('input[name="q8"]:checked');

    if (answer1 && answer1.value === 'a') {
        correctAnswers++;
    }
    if (answer2 && answer2.value === 'a') {
        correctAnswers++;
    }
    if (answer3 && answer3.value === 'b') {
        correctAnswers++;
    }
    if (answer4 && answer4.value === 'b') {
        correctAnswers++;
    }
    if (answer5 && answer5.value === 'b') {
        correctAnswers++;
    }
    if (answer6 && answer6.value === 'b') {
        correctAnswers++;
    }
    if (answer7 && answer7.value === 'c') {
        correctAnswers++;
    }
    if (answer8 && answer8.value === 'b') {
        correctAnswers++;
    }

    // Display the result
    const result = document.getElementById('result');
    result.innerHTML = `You got ${correctAnswers} out of 8 questions correct!`;
}
