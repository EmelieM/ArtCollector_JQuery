/**
 * 
 * #rep-one 
 * 
 */

// DO NOT MODIFY THIS FUNCTION
async function processRepOne( targetElement ) {
    if (targetElement.hasClass('do')) {
      return "Good job, you clicked the right button.";
    } else {
      throw Error("You clicked the wrong button!");
    }
  }
  
  // Please modify this function:
//   $('#rep-one').on('click', 'button', function () {
//     processRepOne( $(this) )
//       .then(function (successObj) {
//         $('#rep-one .message').text(successObj);
//       })
//       .catch(function (error) {
//         $('#rep-one .message').text(error.message);
//       });
//   });

  $('#rep-one').on('click', 'button', async function () {

      try{
        const result = await processRepOne($(this));
        $('#rep-one .message').text(result);
    }
    catch (error){
        $('#rep-one .message').text(error.message);
    }
  });

 
  
  /**
   * 
   * #rep-two
   * 
   */
  
  /* DO NOT MODIFY */
  async function processRepTwo() {
    const ageElement = $('#rep-two input');
  
    const age = Number(ageElement.val());
  
    if (0 < age && age < 130) {
      return "You can use our app!";
    } else {
      throw Error("Please enter a valid age");
    }
  }
  
  // Please do modify
//   $('#rep-two input').on('input', function () {
//     processRepTwo($(this))
//       .then(function (successObj) {
//         $('#rep-two .message').text(successObj);
//         $('#rep-two button').attr('disabled', false);
//       })
//       .catch(function (error) {
//         $('#rep-two .message').text(error.message);
//         $('#rep-two button').attr('disabled', true);
//       })
//   });

  $('#rep-two input').on('input', async function () {
    
    try{
        const result = await processRepTwo($(this));
        $('#rep-two .message').text(result);
        $('#rep-two button').attr('disabled', false);
    }
    catch (error){
        $('#rep-two .message').text(error.message);
        $('#rep-two button').attr('disabled', true);
    }

  });
  
  /**
   * 
   * #rep-three 
   * 
   */
  
  // DO NOT MODIFY THESE FUNCTIONS
  async function asyncReverse(str) {
    return str.split('').reverse().join('');
  }
  
  async function asyncExcite(str) {
    return str.toUpperCase() + "!!!";
  }
  
  // DO MODIFY THIS
//   $('#rep-three input').on('input', function () {
//     const text = $(this).val();
  
//     asyncReverse(text)
//       .then(function (reversedText) {
//         return asyncExcite(reversedText)
//       })
//       .then(function (excitedReversedText) {
//         $('#rep-three .message').text(excitedReversedText);
//       });
//   });
  
  $('#rep-three input').on('input', async function () {
    
    try{
    const text = await $(this).val();
    const reversedText = await asyncReverse(text)
    const excitedText = await asyncExcite(reversedText)
    $('#rep-three .message').text(excitedText)
    }
    catch(error){
        console.dir(error)
    }

    
  });
  
  /**
   * 
   * #rep-four
   * 
   */
  
  // DO NOT MODIFY THESE FUNCTIONS
  async function getUser(id) {
    const user = [
      { id: 1, username: 'joe' },
      { id: 2, username: 'jane' },
      { id: 3, username: 'willa' }
    ].find(user => id === user.id);
  
    if (!user) {
      throw Error('There is no user with that id');
    }
  
    return user;
  }
  
  async function getPosts(userId) {
    return [
      { id: 1, userId: 1, text: 'hello!' },
      { id: 2, userId: 2, text: 'how are you?' },
      { id: 3, userId: 1, text: 'fine, thanks' },
      { id: 4, userId: 3, text: 'neat' }
    ].filter(post => userId === post.userId);
  }
  
  // DO MODIFY THIS
//   $('#rep-four input').on('input', function () {
//     const id = Number( $(this).val() );
  
//     getUser(id)
//       .then(function (user) {
//         getPosts(user.id)
//           .then(function (posts) {
//             // render BOTH user and post info
//             $('#rep-four .info').html($(`
//               <h2>${ user.username }</h2>
//               ${
//                 posts.map(post => `<p>${ post.text }</p>`).join('')
//               }
//             `));
//           })
//           .catch(function (postError) {
//             console.error(postError);
//           });
//       }).catch(function (userError) {
//         console.error(userError);
//       });
//   });

  $('#rep-four input').on('input', async function () {
    const id = Number( $(this).val() );
  
    try{
        const user = await getUser(id)
        const posts = await getPosts(user.id)
        await $('#rep-four .info').html($(`
            <h2>${ user.username }</h2>
              ${
                posts.map(post => `<p>${ post.text }</p>`).join('')
              }
           `));
    }
    catch(error){
        console.dir(error)
    }

  });