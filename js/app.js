(function() {
  // Any text that follows a // or is surrounded by /* */ is a comment.
  //  The computer will ignore comments, but they can be quite helpful for us mere humans.

  /*****************************************************
   * The Setup
   *****************************************************/
  var score = 0;  // The 'var' keyword defines a variable.
                  //  Variables are buckets to hold data.
                  // You can change the data stored in a variable.
                  // This is often necessary, but be careful that you don't over do it.
                  // Changing the value of variables will lead to more complex code that's
                  //  more likely to have bugs.

  var PASSING_SCORE = .8; // It's common practice to write a variable that isn't supposed to change
                          //  in all capital letters.  It's known as a 'constant'

  // A list of items in [] (a.k.a. square brackets) is called an 'array'
  // The first item in an array is at position 0, the second is position 1 and so on...
  //  Yes, I know that's weird, but it's just how it is in JavaScript :)
  var questions = [
    '2 + 2?',
    '6 - 3?',
    '10 + 1?',
    'Who was the first president of the US?',
    'What is the first letter of the alphabet?'
  ];
  var answers = [
    '4', '3', '11', 'George Washington', 'a'
  ];
  var index = 0; // We'll use this to hold our current position in our arrays.
                 //  This sort of variable is usually called an index and it's name is
                 //  shortened to the letter 'i'.


  /*****************************************************
   * The Action
   *****************************************************/
  say('Hello');  // let's greet the user

  // Here we will ask our first question.
  // Note we specify the array of questions and the index of the
  //  question we want to ask.
  ask(questions, index, function reviewAnswer(answer) {

    // When the user answers the question, his/her answer will be placed
    //  in the 'answer' variable, and this code will be run

    // We use the same index for both the question and answer array
    //  so we must be careful that each array is in the correct order

    if (answer == answers[index]) {  // == is a way to ask 'are these two things equal?'
      say('Correct!');
      score++;  // same as score = score + 1
    } else {
      say('Sorry');
    }

    // The code below will decide if there are more questions to ask...

    index++; // Here we move our index up one
             //  We don't yet know if we have more questions to ask.
             //  If we do, our index variable will set to the position of the next question.
             //  If we do not, our index variable will be set to 1 number higher than the last
             //   question's position.  This is equal to the length of the question array
             //   (remember our array starts at position 0).

    if (index < questions.length) {
      // If we have not reach the last question, we should ask another
      ask(questions, index, reviewAnswer)
    } else {

      // When we have reached the last question, tell the user how he/she did.
      say('You got ' + score + ' out of ' + questions.length + ' correct!');

      // let's do some math to determine if our user passed the quiz
      if (score / questions.length >= PASSING_SCORE) {
        say('Good Job!')
      } else {
        say("Looks like it's time to hit the books!")
      }
    }
  });

  // That's the end of the main action
  // What you'll find below gets pretty advanced.
  // Don't be afraid of it, but don't worry if it's not clear.


  /*****************************************************
   * The Helpers
   *****************************************************/
  var spokenWordsList;
  function say(words, callback) {
    if (spokenWordsList == undefined) {
      sayImmediately(words);
      spokenWordsList = [];
    }
    spokenWordsList.push({ text: words, callback: callback });
  }

  function ask(questions, index, handleAnswer) {
    var $answer = $('#answer'),
        $submitAnswer = $('#submit-answer'),
        answer;

    say(questions[index], askingQuestion);

    $submitAnswer.on('click', recieveAnswer);
    $answer.keypress(function (key) {
      if (key.which === 13) {
        $submitAnswer.trigger('click');
      }
    });

    setTimeout(function awaitAnswer() {
      if (answer) {
        $submitAnswer.off('click', recieveAnswer);
        clearAnswer();
        notAskingQuestion();
        handleAnswer(answer);
      } else {
        setTimeout(awaitAnswer, 500);
      }
    }, 500);

    function clearAnswer() {
      $answer.val('');
    }
    function recieveAnswer() {
      answer = $answer.val();
    };
  }

  function greenBear() {
    $('#questioner img').attr('src', 'images/greenbear.gif');
  }
  function redBear() {
    $('#questioner img').attr('src', 'images/redbear.gif');
  }
  function normalBear() {
    $('#questioner img').attr('src', 'images/bear.gif');
  }

  function askingQuestion() {
    $('body').addClass('askingQuestion');
    $('#answer').focus();
  }

  function notAskingQuestion() {
    $('body').removeClass('askingQuestion');
  }

  function sayImmediately(words) {
    $('#spoken-words').text(words);
  }

  setInterval(function speechLoop() {
    var wordsToSpeak = spokenWordsList.shift();
    if (wordsToSpeak) {
      sayImmediately(wordsToSpeak.text)
      if (wordsToSpeak.callback) {
        wordsToSpeak.callback();
      }
    }
  }, 2000);
})();
