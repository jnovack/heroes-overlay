nodejs-express-boilerplate
==========================

`nodejs-express-boilerplate` gives the developer a clean slate to start with
while bundling enough useful features so as to remove all those redundant
tasks that can derail a project before it even really gets started.


### Development

A `nodemon.json` file should be created in the root so that `grunt` can run
properly.  This would hold all run-time environment variables you do not wish
to commit to the git repo.

    {
        "env": {
            "PORT": 3000
        }
    }
