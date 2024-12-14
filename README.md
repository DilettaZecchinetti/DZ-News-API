# Northcoders News API

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>News API</title>
</head>
<body>
  <h1>Project Description</h1>
  <p>This is a REST API for a news application that allows users to read articles, post comments, and interact with the content in various ways.</p>

  <h2>Hosted Version</h2>
  <p>The live version of the project is available here: <a href="[Your Hosted URL]" target="_blank">Your Hosted URL</a></p>
  <p>(Note: It may take a moment to load as the server is started on Render.)</p>

  <h2>Running the Project Locally</h2>
  <p>To run the project locally, ensure that you have both Node.js and PostgreSQL installed on your machine. Follow the steps below to get started.</p>

  <h3>Step 1: Clone the Repository</h3>
  <pre><code>
git clone [your-repo-link]
cd [your-repo-folder]
  </code></pre>

  <h3>Step 2: Install Dependencies</h3>
  <p>Install the required dependencies using npm:</p>
  <pre><code>npm install</code></pre>

  <h3>Step 3: Set Up Environment Variables</h3>
  <p>To configure the environment for local development and testing, create two <code>.env</code> files in the root of the project:</p>
  <ul>
    <li><code>.env.development</code></li>
    <li><code>.env.test</code></li>
  </ul>
  <p>Add the following variables to each of the respective files:</p>

  <h4>For <code>.env.development</code>:</h4>
  <pre><code>PGDATABASE=nc_news</code></pre>

  <h4>For <code>.env.test</code>:</h4>
  <pre><code>PGDATABASE=nc_news_test</code></pre>

  <h3>Step 4: Set Up the Database</h3>
  <p>To create and seed the local development database, run the following commands:</p>
  <pre><code>npm run setup-dbs
npm run seed
  </code></pre>
  <p>This will set up the database structure and populate it with the initial data needed for testing and development.</p>

  <h3>Step 5: Running Tests</h3>
  <p>To verify that everything is working as expected, run the test suite:</p>
  <pre><code>npm test</code></pre>
  <p>This will run the tests to ensure that your application is functioning correctly.</p>

  <h2>Exploring the API</h2>
  <p>Once the setup is complete, you can start interacting with the API locally. You can use tools like Postman or Insomnia, or simply curl the API endpoints from the command line.</p>
</body>
</html>

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
