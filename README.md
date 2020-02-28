# W3cool

// We realize this is a late commit, but it's to help guide the marking

The app allows UoT students to buy/sell used textbooks. 
The structure of our code consists of 3 route files for each page (profile, home page, login) and another file for session information . Information requested is segregated appropriately according to their relevance to their respective pages. The HTTP requests are handled by the server file (textBookApp.js) and the scripts are organised in a similar fashion to the route files. The exception is that the profile view has two sets of script and route files. Due to a certain data passing challenge between script files that determines if the profile page is being viewed by the owner or another user, we were forced to make multiple files as a work-around due to time constraints. The permissions were handled by a function at the top of each script file that would make an HTTP request to determine the session of the current user and would display the view accordingly. This included page redirection, allowing/showing extra features, and simply displaying the HTML of the page.

app hosted on heroku website: https://myapp748.herokuapp.com/

Features that we weren't able to implement in time were mainly the admin functionality, which includes deleting listings, users and altering some of the user's data. We also didn't get to implement users being able to delete their own accounts. Those were the main things, we had hoped to implement other small features for user-friendliness. but at this point, they are just ideas.
